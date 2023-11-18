import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { IProduct } from './remote/dto/product';
import { products as data } from './data/product'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { PageNotifyService } from './services/page-notify.service';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {AuthService} from "./services/auth.service";
import {ISessia} from "./data/sessia";



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
  ]
})
export class AppComponent implements OnInit {
  constructor(
      private pageNotifyService: PageNotifyService,
      private authService: AuthService
    ){
    this.isLoading = true;
  }



  isLoading: Boolean = false;
  isAuth: Boolean = false;
  showFiller: boolean = false;

  sessia? : ISessia | null


  ngOnInit(): void {
    this.authService.session$.subscribe((session: ISessia|null) => {
      this.sessia = session;
      this.isAuth = session !== null;
    });
    let sessia = this.authService.getSession()
    if (sessia !== null){
      this.pageNotifyService.push('Учетная запись: ' + sessia.userName)
    }
  }

  onLogout(): void{
    this.authService.logout()
    location.assign("login")
  }


}
