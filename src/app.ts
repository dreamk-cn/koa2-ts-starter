import { server} from '@/app/index'
import { config } from '@/config/index'
import { initWebSocketServer } from './services/websocket';

initWebSocketServer(server)

server.listen(config.port, () => {
  console.log(`Server is running at http://127.0.0.1:${config.port} [${config.env}]`);
  console.log(`WebSocket server is ready at ws://127.0.0.1:${config.port}`);
})
