import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

@WebSocketGateway(3001, { transports: ['websocket'] })
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private docs = new Map<string, Doc>();
  private providers = new Map<string, WebsocketProvider>();

  handleConnection(client: WebSocket, req: Request) {
    const roomId =
      new URL(req.url, 'http://localhost').searchParams.get('room') ||
      'default';

    if (!this.docs.has(roomId)) {
      this.docs.set(roomId, new Doc());
    }

    const ydoc = this.docs.get(roomId)!;

    const provider = new WebsocketProvider(
      'ws://localhost:3001',
      roomId,
      ydoc,
      { connect: false },
    );

    provider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        client.send(Buffer.from(encodeStateAsUpdate(ydoc)));
      }
    });

    client.on('message', (message: Buffer) => {
      applyUpdate(ydoc, message);
      this.broadcast(message, client);
    });

    this.providers.set(roomId, provider);
  }

  handleDisconnect(client: WebSocket) {
    // Cleanup logic
  }

  private broadcast(message: Buffer, sender: WebSocket) {
    this.server.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
