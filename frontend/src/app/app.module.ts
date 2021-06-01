import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {CommonModule, DatePipe} from "@angular/common";
import { PrivateComponent } from './private/private.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NavbarModule, WavesModule, ButtonsModule, IconsModule} from 'angular-bootstrap-md'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrivateComponent,
    ChatComponent,
    MessageComponent,
    RegisterComponent,
    ChangePasswordComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NavbarModule,
    WavesModule,
    ButtonsModule,
    IconsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
