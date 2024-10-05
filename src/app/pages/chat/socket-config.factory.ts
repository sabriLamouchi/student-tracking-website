import { SocketIoConfig } from 'ngx-socket-io';
import { AuthService } from 'src/app/authentication/auth.service';

export function socketIoConfigFactory(): SocketIoConfig {
  return {
    url: 'http://localhost:3000/chat',
    options: {
      auth: {
        token: `${localStorage.getItem("JWT_Token")}`,  // Dynamically get the token
      },
      transports: ['websocket'],
    },
  };
}
