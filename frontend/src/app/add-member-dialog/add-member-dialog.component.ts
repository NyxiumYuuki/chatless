import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../services/message/message.service";
import {environment} from "../../environments/environment";

export interface AddMemberDialogData {
  owner: string;
  conversationid: string
}


@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent{

  memberName = '';
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<AddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberDialogData,
    @Inject(MessageService) private messageService: MessageService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddMember(){
    this.messageService.sendMessage(environment.urlCPR, "conversations/addRoomMember", {owner: this.data.owner, conversationid: this.data.conversationid, member: this.memberName}).subscribe(data => {
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
