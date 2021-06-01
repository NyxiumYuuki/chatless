import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChatInfo, ChatService} from "../services/chat/chat.service";
import {DatePipe} from "@angular/common";
import {environment} from "../../environments/environment";
import {MessageService} from "../services/message/message.service";
import {MatDialog} from "@angular/material/dialog";
import {AddMemberDialogComponent} from "../add-member-dialog/add-member-dialog.component";
import {RemoveMemberDialogComponent} from "../remove-member-dialog/remove-member-dialog.component";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {

  public username = sessionStorage.getItem('login');
  public msg = '';
  public roomId = '';

  // @ts-ignore
  @Input() room: string;

  // @ts-ignore
  @Input() typeRoom: boolean;

  // @ts-ignore
  @ViewChild('ulMessages') ulMsg: ElementRef;

  // @ts-ignore
  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  constructor(private chatservice: ChatService, private pipe: DatePipe, private messageservice: MessageService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    //console.log('ngOnChange :'+this.room);
    this.chatservice.leaveRoom();
    // @ts-ignore
    document.getElementById('messages').innerHTML = '';
    if(this.room === 'General' || this.room === 'general'){
      this.room = 'general';
      this.chatservice.setUrl(environment.urlCG);
      this.chatservice.setRoom(this.room);
      this.chatServiceOnNewMessage(this.room);
    }
    else{
      let dataMessage;
      if(this.typeRoom){
        dataMessage = {
          member: this.username,
          roomName: this.room,
        }
      }
      else{
        dataMessage = {
          sender: this.username,
          receiver: this.room,
        }
      }
      this.chatservice.setUrl(environment.urlCPR);
      this.messageservice.sendMessage(environment.urlCPR,"conversations/getConv",dataMessage).subscribe(data => {
        if (data.status !== 'ok') {
          console.log(data.data.reason);
        } else {
          if(data.data === null){
            this.messageservice.sendMessage(environment.urlCPR, "conversations/newConv", {
              sender: this.username,
              receiver: this.room,
            }).subscribe(data2 => {
              if (data2.status !== 'ok') {
                console.log(data2.data.reason);
              } else {
                //console.log(data.data);
                this.roomId = data2.data._id;
                this.chatservice.setRoom(this.roomId)
                this.chatServiceOnNewMessage(this.roomId);
              }
            });
          }
          else{
            if(typeof data.data !== 'undefined' && typeof data.data._id !== 'undefined'){
              //console.log(data.data);
              this.roomId = data.data._id;
              this.chatservice.setRoom(this.roomId);
              this.chatServiceOnNewMessage(this.roomId);
            }
          }
        }
      });
    }
  }

  chatServiceOnNewMessage(room: string){
    this.chatservice.onNewMessage(room).subscribe((infos: ChatInfo[]) => {
      for(let data of infos){
        if(data !== undefined && data.date !== undefined){
          if(data.username === 'Server'){
            this.ulMsg.nativeElement.insertAdjacentHTML('beforeend', '<li><span class="text-primary">['+this.pipe.transform(data.date, 'dd/MM/yyyy HH:MM:ss')+'] </span><span class="text-danger">'+data.message+'</span></li>');
          }
          else{
            this.ulMsg.nativeElement.insertAdjacentHTML('beforeend','<li><span class="text-primary">['+this.pipe.transform(data.date, 'dd/MM/yyyy HH:MM:ss')+'] </span><span class="text-success">'+data.username+' </span>:<span class="text-secondary"> '+data.message+'</span></li>');
          }
        }
      }
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    });
  }

  sendButtonClick(){
    //console.log('Button working');
    if(this.msg && this.username && this.room){
      if(this.room === 'general'){
        //console.log("sendButton general");
        this.chatservice.sendMessage(this.username, this.room,  this.msg);
        //console.log(this.username, this.room, this.msg);
      }
      else{
        //console.log("sendButton private");
        this.chatservice.sendMessage(this.username, this.roomId,  this.msg);
        //console.log(this.username, this.roomId, this.msg);
      }
      this.msg = '';
    }
  }

  addMember(){
    let dataMessage;
    if(this.typeRoom){
      dataMessage = {
        member: this.username,
        roomName: this.room,
      }
    }
    else{
      dataMessage = {
        sender: this.username,
        receiver: this.room,
      }
    }
    this.messageservice.sendMessage(environment.urlCPR, "conversations/getConv", dataMessage).subscribe(data => {
      if (data.status !== 'ok') {
        console.log(data.data.reason);
      } else {
        this.roomId = data.data._id;
        const dialogRef = this.dialog.open(AddMemberDialogComponent, {
          width: '50%',
          data: {owner: this.username, conversationid: this.roomId}
        });
        dialogRef.afterClosed().subscribe(data2 => {
          console.log(data2);
          this.listMembers();
        });
      }
    });
  }

  removeMember(){
    let dataMessage;
    if(this.typeRoom){
      dataMessage = {
        member: this.username,
        roomName: this.room,
      }
    }
    else{
      dataMessage = {
        sender: this.username,
        receiver: this.room,
      }
    }
    this.messageservice.sendMessage(environment.urlCPR, "conversations/getConv", dataMessage).subscribe(data => {
      if (data.status !== 'ok') {
        console.log(data.data.reason);
      } else {
        this.roomId = data.data._id;
        const dialogRef = this.dialog.open(RemoveMemberDialogComponent, {
          width: '50%',
          data: {owner: this.username, conversationid: this.roomId}
        });
        dialogRef.afterClosed().subscribe(data2 => {
          console.log(data2);
          this.listMembers();
        });
      }
    });
  }

  listMembers(){
    let dataMessage;
    if(this.typeRoom){
      dataMessage = {
        member: this.username,
        roomName: this.room,
      }
    }
    else{
      dataMessage = {
        sender: this.username,
        receiver: this.room,
      }
    }
    this.messageservice.sendMessage(environment.urlCPR, "conversations/getConv", dataMessage).subscribe(data => {
      if (data.status !== 'ok') {
        console.log(data.data.reason);
      } else {
        this.roomId = data.data._id;
        this.messageservice.sendMessage(environment.urlCPR, "conversations/getMembers", {conversationid: this.roomId}).subscribe(data2 => {
          if (data2.status !== 'ok') {
            console.log(data2.data.reason);
          } else {
            if(typeof data2.data[0] !== 'undefined'){
              this.ulMsg.nativeElement.insertAdjacentHTML('beforeend', '<li><span class="text-danger">Membres: '+data2.data[0].members+'</span></li>');
            }
          }
        });
      }
    });

  }
}
