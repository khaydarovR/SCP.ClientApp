import {Component, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SafeItemComponent} from "../safe-item/safe-item.component";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {RecordItemComponent} from "../record-item/record-item.component";
import {RecordService} from "../services/record.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {IGetRecordResponse} from "../remote/response/GetRecordResponseю";

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SafeItemComponent, RecordItemComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{
  records!: IGetRecordResponse[]
  private _inputSafe?: IGetLinkedSafeResponse

  constructor(private recordService: RecordService) {
  }

  @Input()
  set inputSafe(value: IGetLinkedSafeResponse | undefined) {
    this._inputSafe = value;
    this.valueUpdated(); // Call your update function here
  }

  get inputSafe(): IGetLinkedSafeResponse | undefined {
    return this._inputSafe;
  }

  ngOnInit(): void {

  }

  valueUpdated() {
    console.log('value updated in records component')
    console.log(this._inputSafe);
    if (this._inputSafe?.id != undefined){
      console.log('request to get all from ' + this._inputSafe.id)
      this.recordService.getAllRecords(this._inputSafe!.id).subscribe({
        next: value => this.records = value,
        error: e => console.log(e)
      })
    }
  }


  createRecord() {
    return
    try {
      let res = this.recordService.createRecord(
        "title1",
        "log1",
        "pw1",
        "sec1",
        "res1",
        "f51e78e6-3fd4-4cc8-91ea-198c6c54acea"
      )
    } catch (e) {
      console.log(e)
    }
  }



}
