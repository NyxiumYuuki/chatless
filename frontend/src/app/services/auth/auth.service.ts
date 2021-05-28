import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {JSdata, MessageService} from "../message/message.service";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // @ts-ignore
  islog: boolean;

  constructor(private messageService: MessageService) { }

  getLogged(): boolean {
    return this.islog;
  }

  setLogged(value: boolean): void {
    this.islog = value;
  }

  sendAuthentication(login: string, password: string): Observable<JSdata> {
    return this.messageService.sendMessage('checkLogin', {
      'login': login,
      'password': password
    });
  }

  finalizeAuthentication(data: JSdata): void {
    if (data.status === 'ok'){
      this.setLogged(true);
    }
    else{
      this.setLogged(false);
    }
  }
}
