import {Component, Inject, OnInit} from '@angular/core';
import {MessageService} from "../services/message/message.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../environments/environment";

export interface CreateRoomDialogData {
  owner: string;
}

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent{

  newRoomName = '';
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<CreateRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoomDialogData,
    @Inject(MessageService) private messageService: MessageService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateRoom(){
    this.messageService.sendMessage(environment.urlCPR, "conversations/newRoom", {owner: this.data.owner, roomName: this.newRoomName}).subscribe(data => {
      if (data.status !== 'ok') {
        console.log(data.data.reason);
        this.errorMessage = data.data.reason;
      }
      else{
        this.dialogRef.close({
          data: data.data
        });
      }
    });
  }
}
