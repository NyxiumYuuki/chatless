import {Component, Inject, Input, OnInit} from '@angular/core';
import {ChatInfo, ChatService} from "../services/chat/chat.service";
import {AuthService} from "../services/auth/auth.service";
import {MessageService} from "../services/message/message.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  private username = sessionStorage.getItem('login');
  private room = 'general';
  public msg = '';

  constructor(private chatservice: ChatService) {}

  ngOnInit() {
    console.log('General working');
    this.chatservice.setUrl(environment.urlCG);
    this.chatservice.onNewMessage().subscribe(infos => {
      console.log('message : '+infos);
    });
  }

  sendButtonClick(){
    console.log('Button working');
    if(this.msg){
      this.chatservice.sendMessage(this.username, this.room, this.msg);
      console.log(this.username, this.room, this.msg);
      this.msg = '';
    }

  }
}
