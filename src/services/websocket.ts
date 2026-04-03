import { Server } from 'node:http';
import { WebSocket } from 'ws';
import crypto from 'node:crypto';
import type { User, ServerToClientMessage, ClientToServerMessage, Room } from './type';
import { messageSchema } from './schema';
import { generateRandomNickName } from './util';

/** 心跳间隔（30秒） */
const HEARTBEAT_INTERVAL = 30000;
/** 每房间允许的最大用户数 */
const MAX_ROOM_USERS = 2;

// 房间与用户的全局状态
export const rooms = new Map<string, Room>();
export const users = new Map<WebSocket, User>();

/**
 * 向特定的 WebSocket 客户端发送一条 JSON 消息。
 */
function sendMessage(socket: WebSocket, message: ServerToClientMessage): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ ...message, timestamp: Date.now() }));
  }
}

/**
 * 向同一房间内的所有其他用户广播一条消息
 */
function broadcastToRoom(roomId: string, excludeUserId: string, message: ServerToClientMessage): void {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const [userId, user] of room.users) {
    if (userId !== excludeUserId) {
      sendMessage(user.socket, message);
    }
  }
}

/**
 * 处理join消息：管理房间进入及用户名的唯一性。
 */
function handleJoin(socket: WebSocket, message: Extract<ClientToServerMessage, { type: 'join'}>): void {
  const { roomId, userName = generateRandomNickName() } = message;

  if (!roomId) {
    sendMessage(socket, { type: 'error', roomId: '', error: 'Room ID is required' });
    return;
  }

  let room = rooms.get(roomId);
  if (!room) {
    room = { id: roomId, users: new Map() };
    rooms.set(roomId, room);
  }

  if (room.users.size >= MAX_ROOM_USERS) {
    sendMessage(socket, { type: 'error', roomId, error: 'Room is full' });
    return;
  }

  // Ensure unique userName within the room
  let finalUserName = userName;
  const existingNames = Array.from(room.users.values()).map(u => u.userName);
  while (existingNames.includes(finalUserName)) {
    finalUserName = generateRandomNickName();
  }

  const userId = crypto.randomUUID();
  const user: User = {
    userId,
    userName: finalUserName,
    socket,
    roomId
  };

  room.users.set(userId, user);
  users.set(socket, user);

  // 通知有用户加入的消息
  sendMessage(socket, {
    type: 'joined',
    roomId,
    userId,
    userName: finalUserName,
    data: {
      peers: Array.from(room.users.values())
        .filter(u => u.userId !== userId)
        .map(u => ({ userId: u.userId, userName: u.userName }))
    }
  });

  // Notify others in the room
  broadcastToRoom(roomId, userId, {
    type: 'peer-joined',
    roomId,
    userId,
    userName: finalUserName
  });

  console.warn('rooms', rooms.values())

  console.log(`User ${finalUserName} (${userId}) joined room ${roomId}`);
}

/**
 * 处理用户离开或断开连接时的清理工作。
 */
function handleLeave(socket: WebSocket): void {
  const user = users.get(socket);
  if (!user) return;

  const { roomId, userId, userName } = user;
  if (roomId) {
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(userId);
      console.log(`User ${userName} (${userId}) left room ${roomId}`);

      // Notify others
      broadcastToRoom(roomId, userId, {
        type: 'peer-left',
        roomId,
        userId,
        userName
      });

      // Cleanup empty room
      if (room.users.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} closed`);
      }
    }
  }

  users.delete(socket);
}

/**
 * 向对等端转发信令消息（Offer、Answer、ICE Candidate）。
 */
function handleSignaling(socket: WebSocket, message: Extract<
  ClientToServerMessage,
  { type: 'offer' | 'answer' | 'ice-candidate' }
>): void {
  const user = users.get(socket);
  if (!user || !user.roomId) {
    sendMessage(socket, { type: 'error', roomId: message.roomId, error: 'Not in a room' });
    return;
  }

  const forwardMessage = {
    ...message,
    userId: user.userId,
    userName: user.userName,
  };

  broadcastToRoom(user.roomId, user.userId, forwardMessage);
}

/**
 * 初始化 socket 心跳。
 */
function setupHeartbeat(socket: WebSocket): void {
  let isAlive = true;

  socket.on('pong', () => {
    isAlive = true;
  });

  const interval = setInterval(() => {
    if (!isAlive) {
      console.log('检测到死连接，正在终止...');
      socket.terminate();
      return;
    }

    isAlive = false;
    socket.ping();
  }, HEARTBEAT_INTERVAL);

  socket.on('close', () => clearInterval(interval));
}

/**
 * 主 WebSocket 连接处理器
 */
export function handleWebSocketConnection(socket: WebSocket): void {
  console.warn('WebSocket connection open')
  setupHeartbeat(socket);

  socket.on('message', (data) => {
    try {
      const parsed = messageSchema.safeParse(JSON.parse(data.toString()));
      if (!parsed.success) {
        console.error('Invalid message:', parsed.error);
        sendMessage(socket, {
          type: 'error',
          roomId: '',
          error: 'Invalid message format'
        });
        return;
      }

      const message = parsed.data;

      switch (message.type) {
        case 'join':
          handleJoin(socket, message);
          break;
        case 'leave':
          handleLeave(socket);
          socket.close();
          break;
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          handleSignaling(socket, message);
          break;
        default:
          console.warn(`Unhandled message ${message}`);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      sendMessage(socket, { type: 'error', roomId: '', error: 'Invalid JSON format' });
    }
  });

  socket.on('close', () => {
    console.warn('WebSocket connection closed')
    handleLeave(socket);
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
    handleLeave(socket);
  });
}

/**
 * 利用现有的 HTTP 服务器初始化 WebSocket 服务器
 */
export function initWebSocketServer(server: Server): void {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', handleWebSocketConnection);

  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  console.log('Signaling WebSocket server initialized');
}
