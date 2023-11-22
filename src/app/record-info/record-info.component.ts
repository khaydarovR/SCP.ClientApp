import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {MatChipsModule} from "@angular/material/chips";
import {PageNotifyService} from "../services/page-notify.service";
import {RecordService} from "../services/record.service";

@Component({
  selector: 'app-record-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, FormsModule, MatChipsModule],
  templateUrl: './record-info.component.html',
  styleUrl: './record-info.component.css'
})
export class RecordInfoComponent implements OnInit {
  _originalRecord!: IReadRecordResponse
  @Input() currentSafeId?: string
  isShow = false
  editMod = false
  deleteMod = false

  constructor(private notify: PageNotifyService, private  recordService: RecordService) {
  }

  private _inputRec: IReadRecordResponse = {
    eLogin: '',
    ePw: '',
    eSecret: '',
    forResource: '',
    id: '',
    isDeleted: false,
    title: '',
  }

  @Input()
  set inputRec(val: IReadRecordResponse) {
    this._inputRec = val;
    if (this._originalRecord == undefined || this._originalRecord.id != val.id){
      this._originalRecord = structuredClone(val)
      this.isShow = false
      this.editMod = false

      // Checking _originalRecord before calling showSecrets
      if (this._originalRecord) {
        this.showSecrets(false)
      }
    }
  }

  get inputRec(): IReadRecordResponse {
    return this._inputRec;
  }


  showSecrets(isS: boolean) {
    if (!isS){
      this._inputRec.eSecret = '㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️'
      this._inputRec.eLogin = '㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️'
      this._inputRec.ePw = '㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️㊙️'
    }
    else {
      this._inputRec = structuredClone(this._originalRecord)
    }
    this.isShow = isS
    if (!isS){
      this.editMod = false
    }
  }

  onEditMode(isEditMode: boolean) {
    this.editMod = isEditMode
    if (isEditMode){
      this.isShow = true
      this.showSecrets(this.isShow)
    }

  }

  ngOnInit(): void {
  }


  onDelete(dmode: boolean) {
    this.deleteMod = dmode
  }

  onSubmitEdit(){
    let data: IReadRecordResponse = {
      title: this.inputRec.title,
      id: this.inputRec.id,
      forResource: this.inputRec.forResource,
      eLogin: this.inputRec.eLogin,
      ePw: this.inputRec.ePw,
      eSecret: this.inputRec.eSecret,
      isDeleted: this.deleteMod,
    }

    this.recordService.updateRecord(data, this.currentSafeId!).then(r => {
      if (Array.isArray(r)){
        this.notify.pushMany(r)
      }
      if (r === true){
        this.notify.push('Успешно')
        this.deleteMod = false
        this.editMod = false
        this.showSecrets(false)
      }
      else {
        this.notify.push('Ошибка')
      }
    })
  }
}
