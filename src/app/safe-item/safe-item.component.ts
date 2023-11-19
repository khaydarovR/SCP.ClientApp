import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecordService} from "../services/record.service";
import {SafeService} from "../services/safe.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {PageNotifyService} from "../services/page-notify.service";
import {MSafeCreateComponent} from "../m-safe-create/m-safe-create.component";
import {ICreateSafeDTO} from "../remote/dto/ICreateSafeDTO";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-safe-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './safe-item.component.html',
  styleUrl: './safe-item.component.css'
})
export class SafeItemComponent{
  @Input() safe?: IGetLinkedSafeResponse;
  constructor(private recordService: RecordService) {
  }



  createRecord() {
    try {
      let res = this.recordService.createRecord(
        "title1",
        "log1",
        "pw1",
        "sec1",
        "res1",
        "39332870-484c-4c4a-899e-65446edf14a4"
      )
    } catch (e) {
      console.log(e)
    }
  }
}
