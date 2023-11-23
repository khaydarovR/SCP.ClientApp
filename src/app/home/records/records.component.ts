import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SafeItemComponent} from "../../safe-item/safe-item.component";
import {RecordItemComponent} from "../../record-item/record-item.component";
import {RecordService} from "../../services/record.service";
import {IGetLinkedSafeResponse} from "../../remote/response/IGetLinkedSafeResponse";
import {IGetRecordResponse} from "../../remote/response/GetRecordResponseю";
import {Router} from "@angular/router";
import {IReadRecordResponse} from "../../remote/response/IReadRecordResponse";

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SafeItemComponent, RecordItemComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{
  @Output() recSelected = new EventEmitter<IGetRecordResponse>();

  records!: IGetRecordResponse[]
  private _inputSafe?: IGetLinkedSafeResponse
  private selectedRecord!: IGetRecordResponse

  constructor(private recordService: RecordService, private router: Router) {
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
    console.log(this.inputSafe);
    if (this._inputSafe?.id != undefined){
      console.log('request to get all from ' + this._inputSafe.id)
      this.recordService.getAllRecords(this._inputSafe!.id).subscribe({
        next: value => this.records = value,
        error: e => console.log(e)
      })
    }
  }

  createRecord() {
    if (this.inputSafe){
      this.router.navigate(['/create-record', this.inputSafe.id, this.inputSafe.title]);
    }
  }

  onSelectRecord(recFromList: IGetRecordResponse) {
    this.selectedRecord = recFromList
    this.recSelected.emit(this.selectedRecord);
  }
}
