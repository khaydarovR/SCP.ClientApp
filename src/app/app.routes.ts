import { Routes } from '@angular/router';

import {inject} from "@angular/core";
import {CanActivate} from "./services/can-activate.service";
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    component: AppComponent,
  },
];
