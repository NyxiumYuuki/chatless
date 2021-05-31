import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {ChatService} from "../services/chat/chat.service";
import {MessageService} from "../services/message/message.service";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  public username = sessionStorage.getItem('login');
  public roomSelected = 'general';

  // @ts-ignore
  @ViewChild('userList') userList: ElementRef;

  constructor(private chatservice: ChatService, private messageservice: MessageService) {}

  ngOnInit(): void {
    this.messageservice.sendMessage(environment.urlCL,'getUsers', {username: this.username}).subscribe(
      data => {
        if (data.status !== 'ok'){
          console.log(data.data.reason);
        }
        else{
          //console.log(data.data);
          //data.data = data.data.concat(data.data).concat(data.data).concat(data.data).concat(data.data).concat(data.data).concat(data.data).concat(data.data).concat(data.data);
          for(let user of data.data){
            if(user !== undefined && user.login !== undefined){
                this.userList.nativeElement.insertAdjacentHTML('beforeend', '<div class="user-card" [id]="'+user.login+'"><img src="../../assets/image/user.png" height="25" width="25"/><p class="username">'+user.login+'</p></div>');
            }
          }
        }
      }
    );
  }

  selectRoom(event: Event): void {
    if((event.target as Element).className !== 'user-list-card'){
      const room = (event.target as Element).textContent;
      //console.log(room);
      if(room !== '' && room !== null) {
        this.roomSelected = room;
      }
    }
  }

}
