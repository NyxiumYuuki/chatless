import { Injectable } from '@angular/core';
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // @ts-ignore
  public roomId: string;
  // @ts-ignore
  public name: string;
  // @ts-ignore
  public login: string;

  // @ts-ignore
  public showScreen: boolean;

  // @ts-ignore
  public password: string;
  // @ts-ignore
  public currentUser;

  public userList = [
    {
      id: 1,
      name: 'Yuki Vachot',
      login: 'yuki',
      password: 'vachot1',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Wilfried Vallee',
      login: 'wilfried',
      password: 'vallee2',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Khai Phan',
      login: 'khai',
      password: 'phan3',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    }
  ];

  constructor() {}

  sendAuthentication(login:string, password: string): boolean {
    this.login = login;
    this.password = password;
    this.currentUser = this.userList.find(user => user.password === this.password.toString());
    this.userList = this.userList.filter((user) => user.password !== this.password.toString());
    if(this.currentUser) {
      this.showScreen = true;
    } else {
      console.log("Password Error", this.password.toString());
    }
    return this.showScreen ;
  }

  sendAuth(password: string): any {
    this.password = password;
    return this.currentUser ;
  }

}
