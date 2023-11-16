import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AccountComponent } from "./account/account.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { IProduct } from './remote/dto/product';
import { products as data } from './data/product'
import { ProductComponent } from "./product/product.component";
import { AccountService } from './services/account.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { PageNotifyService } from './services/error.service';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
        CommonModule,
        RouterOutlet,
        AccountComponent,
        MatSlideToggleModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        ProductComponent,
        MatProgressSpinnerModule,
    ]
})
export class AppComponent implements OnInit {
  constructor(
      private accountService: AccountService,
      private pageNotifyService: PageNotifyService
    ){
    this.products = []
    this.isLoading = true;
  }

  title = 'TsBosClient';

  products: IProduct[] = data;

  details: Boolean = true;

  isLoading: Boolean = false;


  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getAllItems().subscribe({
      next: p => {
        this.products = p;
        this.isLoading = false;
      },
      error: this.errorHandler.bind(this)
    });
  }

  private errorHandler(error: HttpErrorResponse){
    this.pageNotifyService.handle(error.message)
    this.isLoading = false
    return throwError(() => error.message)
  }

}
