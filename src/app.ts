import { server} from '@/app/index'
import { config } from '@/config/index'

server.listen(config.port, () => {
  console.log(`Server is running at http://127.0.0.1:${config.port} [${config.env}]`);
})
