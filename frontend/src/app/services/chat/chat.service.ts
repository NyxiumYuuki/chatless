import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private url = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.url);
  }

  // @ts-ignore
  joinRoom(data): void {
    this.socket.emit('join', data);
  }

  // @ts-ignore
  sendMessage(data): void{
    this.socket.emit('message', data);
  }

  getMessage(): Observable<any> {
    return new Observable<{user: string, message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
  }

  newUserJoined()
  {
    let observable = new Observable<{user:String, message:String}>(observer=>{
      this.socket.on('new user joined', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }

  // @ts-ignore
  leaveRoom(data){
    this.socket.emit('leave',data);
  }

  userLeftRoom(){
    let observable = new Observable<{user:String, message:String}>(observer=>{
      this.socket.on('left room', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }

  getStorage() {
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }

}
