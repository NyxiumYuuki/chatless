import { Injectable } from '@angular/core';
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // @ts-ignore
  // @ts-ignore
  public roomId: string;
  // @ts-ignore
  public messageText: string;
  public messageArray: {user: string, message: string}[] = [];
  private storageArray = [];

  // @ts-ignore
  public showScreen: boolean;

  // @ts-ignore
  public phone: string;
  // @ts-ignore
  public currentUser;
  // @ts-ignore
  public selectedUser;

  public userList = [
    {
      id: 1,
      name: 'Yuki Vachot',
      phone: '0608020103',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Wilfried Vallee',
      phone: '0604080701',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Khai Phan',
      phone: '0603050960',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    }
  ];

  constructor() {}
  sendAuthentication(phone: string): boolean {
    this.phone = phone;
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());
    //console.log("2 -", this.currentUser.phone);
    console.log("3 -", this.phone);
    if(this.currentUser) {
      this.showScreen = true;
      console.log("user : TRUE", this.phone.toString());
    } else {
      console.log("error user", this.phone.toString());
    }
    return this.showScreen ;
  }


}
