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
import { PageNotifyService } from './services/error.service';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";


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
      private pageNotifyService: PageNotifyService
    ){
    this.products = []
    this.isLoading = true;
  }

  title = 'TsBosClient';

  products: IProduct[] = data;

  details: Boolean = true;

  isLoading: Boolean = false;
  showFiller: boolean = false;


  ngOnInit(): void {

  }



}
