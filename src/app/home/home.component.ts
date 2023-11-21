import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SafeItemComponent} from "../safe-item/safe-item.component";
import {SafeService} from "../services/safe.service";
import {MatDialog} from "@angular/material/dialog";
import {PageNotifyService} from "../services/page-notify.service";
import {SafesComponent} from "../safes/safes.component";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {RecordsComponent} from "../records/records.component";
import {RecordInfoComponent} from "../record-info/record-info.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, MatButtonModule, SafeItemComponent, SafesComponent, RecordsComponent, RecordInfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private safeService: SafeService,
              private notify: PageNotifyService,
              public dialog: MatDialog) {
  }


  public safeToSend?: IGetLinkedSafeResponse
  onSafeSelectedInChild(safe: IGetLinkedSafeResponse) {
    this.safeToSend = safe
  }



}
