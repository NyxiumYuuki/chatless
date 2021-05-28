import {NgModule, Component, OnInit, Input} from '@angular/core';
import {ChatService} from "../services/chat/chat.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../services/auth/auth.service";


@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  public userList = [
    {
      id: 1,
      name: 'Yuki Vachot',
      login: 'yuki',
      password: 'vachot1',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Wilfried Vallee',
      login: 'wilfried',
      password: 'vallee2',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Khai Phan',
      login: 'khai',
      password: 'phan3',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    }
  ];

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

  ) {
    this.currentUser = this.Auth.sendAuth(this.currentUser);
    this.userList = this.userList.filter((user) => user.password !== this.currentUser.password.toString());
    console.log(this.userList);
  }

  ngOnInit(): void {
    this.chatService.getMessage()
      .subscribe((data: {user: string, message: string}) => {
        this.messageArray.push(data);
        if (this.roomId) {
          setTimeout( () => {
            this.storageArray = this.chatService.getStorage();
            //@ts-ignore
            const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
            //@ts-ignore
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
      });

  }

  selectUserHandler(password: string): void {
    this.selectedUser = this.userList.find(user => user.password === password);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    // @ts-ignore
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      // @ts-ignore
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.storageArray = this.chatService.getStorage();
    // @ts-ignore
    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      // @ts-ignore
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      })
    } else {
      const updateStorage = {
        roomId: this.roomId,
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

}
