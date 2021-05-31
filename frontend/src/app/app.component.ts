import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private titleService: Title, private router: Router) {
  }

  ngOnInit(): void {
    this.setTitle('Chat Polytech');
  }

  public setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }
}
