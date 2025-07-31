export class NetworkManager {
  private static instance: NetworkManager;
  public socket: WebSocket;
  private token: string;
  private callbacks: Map<string, (ops: any[]) => void> = new Map();

  private constructor(token: string) {
    const link = import.meta.env.WEBSOCKET_BASE;
    this.token = token;
    this.socket = new WebSocket(`${link}?token=${this.token}`);
    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onerror = this.handleError;
    this.socket.onclose = this.handleClose;
  }

  public static getInstance(token: string): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager(token);
    }
    return NetworkManager.instance;
  }

  public registerCallback(docId: string, callback: (ops: any[]) => void) {
    this.callbacks.set(docId, callback);
  }

  public sendOperations(docId: string, ops: any[]) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ event: "operation", data: { docId, ops } })
      );
    }
  }

  public joinDocument(docId: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ event: "joinDocument", data: { docId } })
      );
    } else {
      console.error("WebSocket is not open. Cannot join document.");
    }
  }

  private handleOpen = () => {
    console.log("WebSocket connection opened");
  };

  private handleMessage = (event: MessageEvent) => {
    try {
      const { event: eventType, data } = JSON.parse(event.data);
      if (eventType === "operation") {
        const callback = this.callbacks.get(data.docId);
        if (callback) {
          callback(data.ops);
        }
      } else if (eventType === "error") {
        console.error("Server error:", data.message);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  private handleError = (error: Event) => {
    console.error("WebSocket error:", error);
  };

  private handleClose = () => {
    console.log("WebSocket closed. Attempting to reconnect...");
    setTimeout(() => {
      this.socket = new WebSocket(`${import.meta.env.WEBSOCKET_BASE}?token=${this.token}`);
      this.socket.onopen = this.handleOpen;
      this.socket.onmessage = this.handleMessage;
      this.socket.onerror = this.handleError;
      this.socket.onclose = this.handleClose;
    }, 1000);
  };

  close() {
    this.socket.close();
  }
}