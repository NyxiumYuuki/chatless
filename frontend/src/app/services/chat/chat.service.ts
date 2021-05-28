import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface ChatInfo {
  username: string,
  date: Date,
  room: string,
  message: string
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private url: string;

  constructor() {
    this.url = '';
    this.socket = io();
  }

  setUrl(url: string){
    this.url = url;
    this.setSocket();
  }

  setSocket(){
    this.socket = io(this.url, {
      withCredentials: true
    });
  }

  sendMessage(username: string | null, room: string, message: string) {
    this.socket.emit(room, {
      username: username,
      date: new Date(),
      room: room,
      message: message
    });
  }

  onNewMessage() {
    return new Observable(observer => {
      this.socket.on('general', infos => {
        observer.next(infos);
      });
    });
  }
}
