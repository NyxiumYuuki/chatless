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

  private socket: Socket | undefined;
  private url: string;
  private room: string;

  constructor() {
    this.url = '';
    this.room = '';
  }

  setUrl(url: string){
    this.url = url;
    this.setSocket();
  }

  setRoom(room: string){
    this.room = room;
  }

  setSocket(){
    this.socket = io(this.url, {
      withCredentials: true
    });
  }

  sendMessage(sender: string | null, receiver: string | null, room: string, message: string) {
    if(receiver === null){
      // @ts-ignore
      this.socket.emit(room, {
        username: sender,
        date: new Date(),
        room: room,
        message: message
      });
    }
    else{
      // @ts-ignore
      this.socket.emit('privateroom', {
        sender: sender,
        receiver: receiver,
        date: new Date(),
        message: message
      });
    }

  }
  leaveRoom(): void {
    // @ts-ignore
    this.socket?.disconnect();
  }

  onNewMessage(room: string): Observable<ChatInfo[]> {
    return new Observable(observer => {
      // @ts-ignore
      this.socket.on(room, (data: ChatInfo[]) => {
        //console.log(data);
        observer.next(data);
      });
    });
  }
}
