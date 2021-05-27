import {NgModule, Component, OnInit} from '@angular/core';
import {ChatService} from "../services/chat/chat.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


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
      phone: '0608020103',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Wilfried Vallee',
      phone: '0604080701',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Khai Phan',
      phone: '0603050960',
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
  public phone: string;
  // @ts-ignore
  public currentUser;
  // @ts-ignore
  public selectedUser;



  constructor(
    private chatService: ChatService,

  ) {


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

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone === phone);
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

