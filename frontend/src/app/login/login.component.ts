import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  showCredentials(): void {
    console.log('Login :', this.login);
    console.log('Password :', this.password);
    this.auth.sendAuthentication(this.login, this.password).subscribe(data => {
      this.auth.finalizeAuthentication(data);
      if (this.auth.islog === true) {
        sessionStorage.setItem('login', this.login);
        this.router.navigateByUrl('/general');
      } else {
        this.errorMessage = data.data.reason;
        console.log(this.errorMessage);
      }
    });

  }
}




