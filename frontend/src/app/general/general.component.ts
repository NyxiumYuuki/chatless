import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatInfo, ChatService} from "../services/chat/chat.service";
import {environment} from "../../environments/environment";
import {DatePipe} from "@angular/common";
import {MessageService} from "../services/message/message.service";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  public username = sessionStorage.getItem('login');
  private room = 'general';
  public msg = '';

  // @ts-ignore
  @ViewChild('ulMessages') ulMsg: ElementRef;


  constructor(private chatservice: ChatService, private pipe: DatePipe, private messageservice: MessageService) {}

  ngOnInit() {
    console.log('General working');
    this.messageservice.sendMessage(environment.urlCL,'getUsers', {username: this.username}).subscribe(
      data => {
        if (data.status !== 'ok'){
          console.log(data.data.reason);
        }
        else{
          console.log(data.data);
        }
      }
    );
    this.chatservice.setUrl(environment.urlCG);
    this.chatservice.setRoom(this.room);
    this.chatservice.onNewMessage(this.room).subscribe((infos: ChatInfo[]) => {
      for(let data of infos){
        if(data !== undefined && data.date !== undefined){
          if(data.username === 'Server'){
            this.ulMsg.nativeElement.insertAdjacentHTML('beforeend', '<li><span class="text-danger">'+data.message+'</span></li>');
          }
          else{
            this.ulMsg.nativeElement.insertAdjacentHTML('beforeend','<li><span class="text-primary">['+this.pipe.transform(data.date, 'dd/MM/yyyy HH:MM:ss')+'] </span><span class="text-success">'+data.username+' </span>:<span class="text-secondary"> '+data.message+'</span></li>');
          }
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  sendButtonClick(){
    console.log('Button working');
    if(this.msg && this.username){
      this.chatservice.sendMessage(this.username, this.room, this.msg);
      console.log(this.username, this.room, this.msg);
      this.msg = '';
    }
  }
}
