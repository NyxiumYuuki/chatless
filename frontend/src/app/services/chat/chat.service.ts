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
    this.joinRoom(this.room);
  }

  setSocket(){
    this.socket = io(this.url, {
      withCredentials: true
    });
  }

  sendMessage(sender: string | null, room: string, message: string) {
    if(room === 'general' || room === 'General'){
      // @ts-ignore
      this.socket.emit(room, {
        username: sender,
        date: new Date(),
        room: room,
        message: message
      });
    }
    else{
      //console.log('sendMessage private: ',sender,room,message);
      // @ts-ignore
      this.socket.emit('privateroom', {
        sender: sender,
        room: room,
        date: new Date(),
        message: message
      });
    }
  }

  joinRoom(room: string): void{
    //@ts-ignore
    this.socket.emit('joinroom', {
      room: room
    });
  }

  leaveRoom(): void {
    // @ts-ignore
    this.socket?.disconnect();
  }

  onNewMessage(room: string): Observable<ChatInfo[]> {
    //console.log('onNewMessage: ',room);
    return new Observable(observer => {
      // @ts-ignore
      this.socket.on(room, (data: ChatInfo[]) => {
        //console.log(data);
        observer.next(data);
      });
    });
  }
}
