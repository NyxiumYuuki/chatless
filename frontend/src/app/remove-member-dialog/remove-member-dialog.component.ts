import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../services/message/message.service";
import {environment} from "../../environments/environment";
import {AddMemberDialogData} from "../add-member-dialog/add-member-dialog.component";

@Component({
  selector: 'app-remove-member-dialog',
  templateUrl: './remove-member-dialog.component.html',
  styleUrls: ['./remove-member-dialog.component.scss']
})
export class RemoveMemberDialogComponent {

  memberName = '';
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<RemoveMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberDialogData,
    @Inject(MessageService) private messageService: MessageService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteMember(){
    this.messageService.sendMessage(environment.urlCPR, "conversations/removeRoomMember", {owner: this.data.owner, conversationid: this.data.conversationid, member: this.memberName}).subscribe(data => {
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
