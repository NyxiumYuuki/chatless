import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    //console.log('connecté ? '+this.authservice.getLogged());
      console.log('test');
      this.authservice.setLogged(false);
      this.router.navigate(['/']);
  }

}
