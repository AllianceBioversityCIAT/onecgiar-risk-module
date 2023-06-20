import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from './constants';
@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;
    const client: Socket = context.switchToWs().getClient();
    //  const { authorization } = client.handshake.headers;
    const { authorization } = client.handshake.auth;
    if (!authorization) throw new UnauthorizedException();

    const token: string = authorization.split(' ')[1];
    const payload = verify(token, jwtConstants.secret);

    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.auth;
    if (!authorization) throw new UnauthorizedException();

    const token: string = authorization.split(' ')[1];

    const payload = verify(token, jwtConstants.secret);
    return payload;
  }

  static getPayloadFromToken(auth) {
    const { authorization } = auth;
    const token: string = authorization.split(' ')[1];

    const payload = verify(token, jwtConstants.secret);
    return payload;
  }
}
