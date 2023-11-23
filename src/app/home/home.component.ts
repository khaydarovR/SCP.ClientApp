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
import {SafesComponent} from "./safes/safes.component";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {RecordsComponent} from "./records/records.component";
import {RecordInfoComponent} from "./record-info/record-info.component";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {IGetRecordResponse} from "../remote/response/GetRecordResponseю";
import {RecordService} from "../services/record.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, MatButtonModule, SafeItemComponent, SafesComponent, RecordsComponent, RecordInfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private recordService: RecordService,
              private notify: PageNotifyService,
              public dialog: MatDialog) {
  }


  public safeToSend?: IGetLinkedSafeResponse
  public recordToSend!: IReadRecordResponse
  onSafeSelectedInChild(safe: IGetLinkedSafeResponse) {
    this.safeToSend = safe
  }

  onRecSelectedInChild(safe: IGetRecordResponse) {
    this.recordService.readRecord(safe.id).then(r =>{
      console.log(r.title)
      console.log(r.eLogin)
      console.log(r.ePw)
      console.log(r.eSecret)
      this.recordToSend = r
    })
  }



}
