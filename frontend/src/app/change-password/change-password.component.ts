import { Component, OnInit } from '@angular/core';
import {MessageService} from "../services/message/message.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  username = sessionStorage.getItem('login');
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  succesMessage = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  changePassword(): void {
    console.log(this.username);
    if(this.newPassword !== this.confirmPassword){
      this.errorMessage = 'Les mots de passe ne sont pas identiques.';
    }
    else {
      this.messageService.sendMessage(environment.urlCL,"changePassword",{username: this.username, password: this.oldPassword, newpassword: this.confirmPassword}).subscribe(data => {
        if (data.status !== 'ok') {
          this.succesMessage = '';
          this.errorMessage = data.data.reason;
        } else {
          this.errorMessage = '';
          this.succesMessage = data.data;
        }
      });
    }
  }
}
