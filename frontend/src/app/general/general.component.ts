import { Component, OnInit } from '@angular/core';
import {ChatService} from "../services/chat/chat.service";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  public currentUser;

  // @ts-ignore
  public user:String;
  // @ts-ignore
  public room:String;
  // @ts-ignore
  public messageText: string;
  messageArray:Array<{user:String,message:String}> = [];
  private storageArray = [];

  // @ts-ignore
  public showScreen: boolean;

  // @ts-ignore
  public password: string;
  // @ts-ignore
  public currentUser;
  // @ts-ignore
  public selectedUser;

  public userList = [
    {
      id: 1,
      name: 'Yuki Vachot',
      login: 'yuki',
      password: 'vachot1',
      room: 'general'
    },
    {
      id: 2,
      name: 'Wilfried Vallee',
      login: 'wilfried',
      password: 'vallee2',
      room: 'general'
    },
    {
      id: 3,
      name: 'Khai Phan',
      login: 'khai',
      password: 'phan3',
      room: 'general'
    }
  ];


  constructor(private chatService:ChatService,
              private Auth: AuthService
  ) {
    this.currentUser = this.Auth.sendAuth(this.currentUser);
    this.userList = this.userList.filter((user) => user.password !== this.currentUser.password.toString());
    console.log(this.userList);

    this.chatService.newUserJoined()
      .subscribe(data=> this.messageArray.push(data));


    this.chatService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data));

    this.chatService.getMessage()
      .subscribe(data=>this.messageArray.push(data));
  }
  ngOnInit(): void {
    this.chatService.getMessage()
      .subscribe((data: {user: string, message: string}) => {
        this.messageArray.push(data);
        if (this.room) {
          setTimeout( () => {
            this.storageArray = this.chatService.getStorage();
            //@ts-ignore
            const storeIndex = this.storageArray.findIndex((storage) => storage.room === this.room);
            //@ts-ignore
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
      });

  }

  selectUserHandler(password: string): void {
    this.selectedUser = this.userList.find(user => user.password === password);
    this.room = this.selectedUser.room[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    // @ts-ignore
    const storeIndex = this.storageArray.findIndex((storage) => storage.room === this.room);

    if (storeIndex > -1) {
      // @ts-ignore
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    // @ts-ignore
    this.join(this.currentUser.name, this.room);
  }

  join(username: string, room: string): void {
    this.chatService.joinRoom({user: username, room: room});
  }

  sendMessage()
  {
    this.chatService.sendMessage({user:this.user, room:this.room, message:this.messageText});

    this.storageArray = this.chatService.getStorage();
    // @ts-ignore
    const storeIndex = this.storageArray.findIndex((storage) => storage.room === this.room);

    if (storeIndex > -1) {
      // @ts-ignore
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      })
    } else {
      const updateStorage = {
        room: this.room,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };
      // @ts-ignore
      this.storageArray.push(updateStorage);
    }
    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }


  leave(){
    this.chatService.leaveRoom({user:this.user, room:this.room});
  }


}
