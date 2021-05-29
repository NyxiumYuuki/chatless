import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface JSdata{
  status: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  constructor(private http: HttpClient) { }
  sendMessage(baseurl: string, url: string, data: any): Observable<JSdata> {
    const CreatURL = baseurl.concat('/').concat(url);
    //console.log(CreatURL, data);
    return this.http.post<JSdata>(
      CreatURL,
      data,
      {withCredentials: true}
    );
  }
}

