import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NetworkService } from './network.service';

@WebSocketGateway()
export class NetworkGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly networkService: NetworkService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Method to emit IP updates
  sendIpStatusUpdate(data: { ip: string; alive: boolean }) {
    this.server.emit('ipStatusUpdate', data);
  }
}
