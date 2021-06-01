import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ChatComponent} from "./chat/chat.component";
import {AuthGuard} from "./auth.guard";
import {ChangePasswordComponent} from "./change-password/change-password.component";

const routes: Routes = [
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  // {
  //   path: '',
  //   canActivateChild: [AuthGuard],
  //   children: [
  //     { path: 'chat', component: ChatComponent},
  //     { path: 'changePassword', component: ChangePasswordComponent}
  //   ]
  // }
  {
    path: '',
    component: LoginComponent,
  },
  { path: 'chat',
    canActivateChild: [AuthGuard],
    component: ChatComponent
  },
  { path: 'changePassword', component: ChangePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
