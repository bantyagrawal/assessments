import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private token: string | null = '';
  private socket: any;
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  createConnection() {
    this.socket = io('http://localhost:3000', {
      auth: {
        token: this.token
      }
    });
  }
  sendMessage(message: any) {
    this.socket.emit('sendNotification', message);
  }

  // seenNotification(data: any) {
  //   this.socket.emit('seennotification',data);
  // }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message',
        (message: any) => {
          observer.next(message);
        });
    });
  }
}
