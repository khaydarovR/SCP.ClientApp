import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SafeItemComponent} from "../safe-item/safe-item.component";
import {SafeService} from "../services/safe.service";
import {MatDialog} from "@angular/material/dialog";
import {MSafeCreateComponent} from "../m-safe-create/m-safe-create.component";
import {ICreateSafeDTO} from "../remote/dto/ICreateSafeDTO";
import {PageNotifyService} from "../services/page-notify.service";
import {SafesComponent} from "../safes/safes.component";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, MatButtonModule, SafeItemComponent, SafesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



  constructor(private safeService: SafeService,
              private notify: PageNotifyService,
              public dialog: MatDialog) {
  }





}
