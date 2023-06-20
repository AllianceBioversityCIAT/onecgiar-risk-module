import { Logger, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws.mw';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor() {}
  lockedObject = {};
  @SubscribeMessage('risk-lock')
  riskLock(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const user = WsJwtGuard.getPayloadFromToken(socket.handshake.auth);
    this.lockedObject[data] = { socket_id: socket.id, user: user };
    this.server.emit('locked', this.lockedObject);
  }
  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }
  @SubscribeMessage('risk-unlock')
  riskUnlockLock(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const user = WsJwtGuard.getPayloadFromToken(socket.handshake.auth);
    delete this.lockedObject[data];
    this.server.emit('locked', this.lockedObject);
  }

  removeBySocketID(socket_id) {
    Object.keys(this.lockedObject).forEach((risk_id) => {
      if (this.lockedObject[risk_id].socket_id == socket_id)
        delete this.lockedObject[risk_id];
      this.server.emit('locked', this.lockedObject);
    });
  }

  onModuleInit() {
    this.server.on('connect', (socket) => {
      socket.on('disconnect', (data) => {
        this.removeBySocketID(socket.id);
      });

      //  setTimeout(() => {
      this.server.emit('locked', this.lockedObject);
      //   }, 500);
    });
  }
}
