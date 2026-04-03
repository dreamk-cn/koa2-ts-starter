import type { WebSocket} from 'ws';

type WithRoom = {
  roomId: string;
};

type WithUser = {
  userId: string;
  userName: string;
};

type BaseServerMessage = {
  timestamp?: number;
};

type SignalMessage<T extends string, D> = BaseServerMessage & WithRoom & WithUser & {
  type: T;
  data: D;
};

export type JoinedMessage = BaseServerMessage & WithRoom & WithUser & {
  type: 'joined';
  data: {
    peers: {
      userId: string;
      userName: string;
    }[];
  };
};

export type PeerJoinedMessage = BaseServerMessage & WithRoom & WithUser & {
  type: 'peer-joined';
};

export type PeerLeftMessage = BaseServerMessage & WithRoom & WithUser & {
  type: 'peer-left';
};

export type OfferMessage = SignalMessage<'offer', RTCSessionDescriptionInit>;
export type AnswerMessage = SignalMessage<'answer', RTCSessionDescriptionInit>;
export type IceCandidateMessage = SignalMessage<'ice-candidate', RTCIceCandidateInit>;

export type ErrorMessage = BaseServerMessage & {
  type: 'error';
  roomId?: string;
  error: string;
};

export type ServerToClientMessage =
  | JoinedMessage
  | PeerJoinedMessage
  | PeerLeftMessage
  | OfferMessage
  | AnswerMessage
  | IceCandidateMessage
  | ErrorMessage;


/** 
 * 客户到发送到服务端的消息
 */
export type ClientToServerMessage =
| {
    type: 'join';
    roomId: string;
    userName?: string;
  }
| {
    type: 'leave';
    roomId: string;
  }
| {
    type: 'offer';
    roomId: string;
    data: RTCSessionDescriptionInit;
  }
| {
    type: 'answer';
    roomId: string;
    data: RTCSessionDescriptionInit;
  }
| {
    type: 'ice-candidate';
    roomId: string;
    data: RTCIceCandidateInit;
  };

/**
 * 表示连接到信令服务器的用户
 */
export type User = {
  userId: string;
  userName: string;
  socket: WebSocket;
  roomId?: string;
}

/**
 * 表示一个最多容纳两名用户的房间
 */
export interface Room {
  id: string;
  users: Map<string, User>; // userId -> User
}