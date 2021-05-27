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


  public phone = '';


  constructor(
    private auth: AuthService,
    private router: Router
  ) {


  }

  ngOnInit(): void {
  }


  login() : void {
    console.log('1 -Phone :', this.phone);
    if (this.auth.sendAuthentication(this.phone) === true){
      this.router.navigateByUrl('/private');
    } else {
      console.log("error");
    }
  }

}












