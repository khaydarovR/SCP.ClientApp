import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon"
import {SafeItemComponent} from "../../safe-item/safe-item.component";
import {RecordItemComponent} from "../../record-item/record-item.component";
import {RecordService} from "../../services/record.service";
import {IGetLinkedSafeResponse} from "../../remote/response/IGetLinkedSafeResponse";
import {IGetRecordResponse} from "../../remote/response/GetRecordResponseю";
import {Router} from "@angular/router";
import {IReadRecordResponse} from "../../remote/response/IReadRecordResponse";
import {PageNotifyService} from "../../services/page-notify.service";
import { ImportExcelComponent } from '../../import-excel/import-excel.component';
import { API_BASE_URL } from '../../data/myConst';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SafeItemComponent, RecordItemComponent, ImportExcelComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{
  @Output() recSelected = new EventEmitter<IGetRecordResponse>();

  records!: IGetRecordResponse[]
  private _inputSafe?: IGetLinkedSafeResponse
  private selectedRecord!: IGetRecordResponse

  constructor(private recordService: RecordService, private router: Router, private notify: PageNotifyService, private http: HttpClient) {
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
        next: value => {
          this.records = value as IGetRecordResponse[]
        },
        error: e => this.notify.pushMany(e.error)
      })
    }
  }

  createRecord() {
    if (this.inputSafe){
      this.router.navigate(['/create-record', this.inputSafe.id, this.inputSafe.title]);
    }
  }


  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.onImport();
  }

  file: File | null = null;
  onImport() {
    if (!this.file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    const safeId = this._inputSafe?.id; // Replace 'your-safe-id' with actual safe ID
    const url = `${API_BASE_URL}api/Record/Import/Import?safeId=${safeId}`;

    this.http.post(url, formData)
      .subscribe(
        (response) => {
          console.log('Import successful:', response);
          alert('Import successful!');
        },
        (error) => {
          console.error('Import failed:', error);
          alert('Import failed. Please try again.');
        }
      );
  }


  onSelectRecord(recFromList: IGetRecordResponse) {
    this.selectedRecord = recFromList
    this.recSelected.emit(this.selectedRecord);
  }
}
