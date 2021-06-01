import { Component, OnInit } from '@angular/core';
import {MessageService} from "../services/message/message.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  login2 = '';
  password2 = '';
  password4 = '';
  errorMessage = '';
  succesMessage = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

  }

  register(): void {
    if(this.password4 !== this.password2){
      console.log("error");
      this.errorMessage = 'Les mots de passe ne sont pas identiques.';
    }
    else {
      this.messageService.sendMessage(environment.urlCL,"register",{username: this.login2, password: this.password2}).subscribe(data => {
        if (data.status !== 'ok') {
          this.succesMessage = '';
          this.errorMessage = data.data.reason;
        } else {
          //console.log(data.data);
          this.errorMessage = '';
          this.succesMessage = data.data;
        }
      });
    }
  }
}
