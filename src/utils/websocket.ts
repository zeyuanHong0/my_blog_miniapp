const wsUrl = import.meta.env.VITE_APP_WS_URL;

// 最大重连次数
const MAX_RECONNECT_COUNT = 5;
// 重连间隔（毫秒）
const RECONNECT_INTERVAL = 3000;

interface WebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: (res: any) => void;
  onClose?: (res: any) => void;
  onError?: (err: any) => void;
}

class WebSocketManager {
  private options: WebSocketOptions;
  private isConnected: boolean = false;
  private isManualClose: boolean = false; // 是否主动关闭
  private reconnectCount: number = 0;
  private reconnectTimer: any = null;

  constructor(options: WebSocketOptions = {}) {
    this.options = options;
  }

  /** 建立连接 */
  connect() {
    this.isManualClose = false;

    uni.connectSocket({
      url: wsUrl,
    });

    uni.onSocketOpen((res: any) => {
      console.log("WebSocket连接成功", res);
      this.isConnected = true;
      this.reconnectCount = 0; // 重连成功后重置计数器
      this.options.onOpen?.(res);
    });

    uni.onSocketClose((res: any) => {
      console.log("WebSocket连接关闭", res);
      this.isConnected = false;
      this.options.onClose?.(res);
      // 非主动关闭时自动重连
      if (!this.isManualClose) {
        this.reconnect();
      }
    });

    uni.onSocketError((err: any) => {
      console.error("WebSocket连接错误", err);
      this.isConnected = false;
      this.options.onError?.(err);
    });

    uni.onSocketMessage((res: any) => {
      try {
        const data = JSON.parse(res.data);
        this.options.onMessage?.(data);
      } catch (e) {
        console.error("WebSocket消息解析失败", res.data);
      }
    });
  }

  /** 主动关闭连接（不触发重连） */
  close() {
    this.isManualClose = true;
    this.clearReconnectTimer();
    uni.closeSocket();
    this.isConnected = false;
  }

  /** 获取连接状态 */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /** 自动重连 */
  private reconnect() {
    if (this.reconnectCount >= MAX_RECONNECT_COUNT) {
      console.warn(
        `WebSocket重连已达最大次数(${MAX_RECONNECT_COUNT})，停止重连`,
      );
      return;
    }
    this.reconnectCount++;
    console.log(
      `WebSocket将在${RECONNECT_INTERVAL / 1000}秒后进行第${this.reconnectCount}次重连...`,
    );
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  /** 清除重连定时器 */
  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export default WebSocketManager;
