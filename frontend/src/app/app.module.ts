import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GeneralComponent } from './general/general.component';
import { PrivateComponent } from './private/private.component';
import { NavbarComponent } from './navbar/navbar.component';
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GeneralComponent,
    PrivateComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }