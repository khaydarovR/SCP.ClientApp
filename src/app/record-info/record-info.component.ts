import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";

@Component({
  selector: 'app-record-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './record-info.component.html',
  styleUrl: './record-info.component.css'
})
export class RecordInfoComponent {
  @Input() inputRec: IReadRecordResponse = new class implements IReadRecordResponse {
    eLogin = '';
    ePw= '';
    eSecret= '';
    forResource= '';
    id='';
    isDeleted= false;
    title= '';
  }

  isChecked: boolean = false;
  isChecked2: boolean = false;

  get ePw(): string {
    return this.inputRec?.ePw ?? '';
  }

  set ePw(value: string) {
    this.inputRec = this.inputRec ?? {};
    this.inputRec.ePw = value;
  }

  get eSecret(): string {
    return this.inputRec?.eSecret ?? '';
  }

  set eSecret(value: string) {
    this.inputRec = this.inputRec ?? {};
    this.inputRec.eSecret = value;
  }
}
