import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../remote/dto/product';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input()
  product!: IProduct;
}
