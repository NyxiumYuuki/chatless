import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public password = '';
  public name = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {


  }

  ngOnInit(): void {
  }


  login() : void {
    console.log(this.name, this.password);
    if (this.auth.sendAuthentication(this.name, this.password) === true){
      this.auth.sendAuth(this.password);
      this.router.navigateByUrl('/private');
    } else {
      console.log("error");
    }
  }

  login2() : void {
    console.log(this.name, this.password);
    if (this.auth.sendAuthentication(this.name, this.password) === true){
      this.auth.sendAuth(this.password);
      this.router.navigateByUrl('/general');
    } else {
      console.log("error");
    }
  }

}




