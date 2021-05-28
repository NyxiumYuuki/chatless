import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

export interface JSdata{
  status: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  constructor(private http: HttpClient) { }
  sendMessage(url: string, data: any): Observable<JSdata> {
    const CreatURL = environment.urlCL.concat('/').concat(url);
    const FData = new FormData();
    let i: any;
    if (data !== null && data !== undefined) {
      for (i of Object.keys(data)){
        FData.append(i, data[i]);
      }
    }
    return this.http.post<JSdata>(
      CreatURL,
      FData,
      {withCredentials: true}
    );
    return this.http.post<JSdata>(CreatURL, {withCredentials: true});
  }
}

