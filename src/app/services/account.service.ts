import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../remote/dto/product';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private client: HttpClient) {

  }

  getAllItems(): Observable<IProduct[]> {
    return this.client.get<IProduct[]>("https://fakestoreapi.com/products");
  }
}
