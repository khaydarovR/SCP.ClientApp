import { Routes } from '@angular/router';
import {AccountComponent} from "./account/account.component";
import {inject} from "@angular/core";
import {CanActivate} from "./services/can-activate.service";
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,

  },
  {
    path: '/',
    component: AppComponent,

  },
];
