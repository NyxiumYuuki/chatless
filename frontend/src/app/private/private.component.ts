import {NgModule, Component, OnInit, Input} from '@angular/core';
import {ChatService} from "../services/chat/chat.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../services/auth/auth.service";
import {MessageService} from "../services/message/message.service";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  dataSource = new MatTableDataSource<userList>();
  // @ts-ignore
  public roomId: string;
  // @ts-ignore
  public messageText: string;
  public messageArray: {user: string, message: string}[] = [];
  private storageArray = [];

  // @ts-ignore
  public showScreen: boolean;

  // @ts-ignore
  public password: string;
  // @ts-ignore
  public currentUser;
  // @ts-ignore
  public selectedUser;



  constructor(
    private Auth: AuthService,
    private chatService: ChatService,
    private MS: MessageService

  ) {
  }

  ngOnInit(): void {
    this.MS.sendMessage('Cours/CoursGet', {}).subscribe( send => {
      console.log(send.data);
      this.dataSource.data = send.data as userList[];
    });

    // this.chatService.getMessage()
    //   .subscribe((data: {user: string, message: string}) => {
    //     this.messageArray.push(data);
    //     if (this.roomId) {
    //       setTimeout( () => {
    //         this.storageArray = this.chatService.getStorage();
    //         //@ts-ignore
    //         const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    //         //@ts-ignore
    //         this.messageArray = this.storageArray[storeIndex].chats;
    //       }, 500);
    //     }
    //   });

  }

  // selectUserHandler(login: string): void {
  //   this.login = login;
  //   this.selectedUser = this.userList.find(user => user.password === password);
  //   this.roomId = this.selectedUser.roomId[this.currentUser.id];
  //   this.messageArray = [];
  //
  //   // this.storageArray = this.chatService.getStorage();
  //   // // @ts-ignore
  //   // const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
  //   //
  //   // if (storeIndex > -1) {
  //   //   // @ts-ignore
  //   //   this.messageArray = this.storageArray[storeIndex].chats;
  //   // }
  //
  //   this.join(this.login);
  // }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      message: this.messageText
    });

    // this.storageArray = this.chatService.getStorage();
    // // @ts-ignore
    // const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
    //
    // if (storeIndex > -1) {
    //   // @ts-ignore
    //   this.storageArray[storeIndex].chats.push({
    //     user: this.currentUser.name,
    //     message: this.messageText
    //   })
    // } else {
    //   const updateStorage = {
    //     roomId: this.roomId,
    //     chats: [{
    //       user: this.currentUser.name,
    //       message: this.messageText
    //     }]
    //   };
    //   // @ts-ignore
    //   this.storageArray.push(updateStorage);
    // }
    // this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }

}

export interface userList {
  login: string;
}
