import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {JSdata, MessageService} from "../message/message.service";
import {HttpClient} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // @ts-ignore
  islog: boolean;


  constructor(
    private http: HttpClient,
    private MS: MessageService
  ) {}

  sendAuthentication(login: string, password: string): Observable<JSdata> {
    const data = new FormData();
    if (login !== null && login !== undefined && password !== null && password !== undefined) {
      data.append(login, password);
    }
    return this.MS.sendMessage('checkLogin', {
      login : login,
      Password: password
    });
  }

  finalizeAuthentication(data: JSdata): void{
    if (data.status === 'ok') {
      this.islog = true;
    } else {
      this.islog = false;
    }
  }

}
