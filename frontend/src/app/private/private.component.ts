import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {ChatService} from "../services/chat/chat.service";
import {MessageService} from "../services/message/message.service";
import {CreateRoomDialogComponent} from "../create-room-dialog/create-room-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  public username = sessionStorage.getItem('login');
  public roomSelected = 'general';
  public privateRoomActivate = false;

  // @ts-ignore
  @ViewChild('userList') userList: ElementRef;

  constructor(private chatservice: ChatService, private messageservice: MessageService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.changeListGeneral();
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

  changeListPrivate(): void{
    this.privateRoomActivate = true;
    // @ts-ignore
    document.getElementById('userList').innerHTML = '';
    this.messageservice.sendMessage(environment.urlCPR,'conversations/getRooms', {member: this.username}).subscribe(
      data => {
        if (data.status !== 'ok'){
          console.log(data.data.reason);
        }
        else{
          console.log(data.data);
          for(let user of data.data){
            if(user !== undefined && user.roomName !== undefined){
              this.userList.nativeElement.insertAdjacentHTML('beforeend', '<div class="user-card" [id]="'+user.roomName+'"><img src="../../assets/image/room.png" height="25" width="25"/><p class="username">'+user.roomName+'</p></div>');
            }
          }
        }
      }
    );
  }

  changeListGeneral(): void{
    this.privateRoomActivate = false;
    // @ts-ignore
    document.getElementById('userList').innerHTML = '<div class="user-card"><p class="username">General</p></div>';
    this.messageservice.sendMessage(environment.urlCL,'getUsers', {username: this.username}).subscribe(
      data => {
        if (data.status !== 'ok'){
          console.log(data.data.reason);
        }
        else{
          for(let user of data.data){
            if(user !== undefined && user.login !== undefined){
              this.userList.nativeElement.insertAdjacentHTML('beforeend', '<div class="user-card" [id]="'+user.login+'"><img src="../../assets/image/user.png" height="25" width="25"/><p class="username">'+user.login+'</p></div>');
            }
          }
        }
      }
    );
  }

  newRoom(): void{
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      width: '50%',
      data: {owner: this.username}
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      this.changeListPrivate();
    });
  }
}
