import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyService} from "../services/key.service";
import {IApiKeyResponse} from "../remote/response/ApiKeyResponse";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {SafeService} from "../services/safe.service";
import {PageNotifyService} from "../services/page-notify.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-acc',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, FormsModule, MatSelectModule],
  templateUrl: './acc.component.html',
  styleUrl: './acc.component.css'
})
export class AccComponent implements OnInit{
  tokenE = ''
  keys: IApiKeyResponse[] = []
  dayLife: number = 30
  _selectedSafeId: string = ''
  _safes: IGetLinkedSafeResponse[] = []
  keyName: string = ''
  userName: string = '';
  userId: string = '';

  set selectedSafeId(val: string) {
    this._selectedSafeId = val
  }
  get selectedSafeId():string{
    return this._selectedSafeId;
  }

  constructor(private keyServ: KeyService,
              private safeServ: SafeService,
              private notify: PageNotifyService,
              private acc: AuthService) {
  }

  ngOnInit(): void {
    this.keyServ.GetMyKeys().subscribe({
      next: r => this.keys = r
    })
    this.safeServ.getLinkedSafes().subscribe({
      next: r => {
        if (r[0] != ''){
          this._safes = r as IGetLinkedSafeResponse[]
        }
      }
    })
    this.tokenE = localStorage.getItem('jwt')?? '';
    this.userName = localStorage.getItem('name')?? '';
    this.userId = localStorage.getItem('id')?? '';
  }


  createKey() {
    this.keyServ.createApiKey({
      safeId: this._selectedSafeId,
      dayLife: this.dayLife,
      name: this.keyName
    }).subscribe({
      next: r => {
        if (r === true){
          this.notify.push("Успешно")
          this.ngOnInit()
        }
        else {
          this.notify.push('Ошибка')
        }
      }
    })
  }

  deleteKey(id: string) {
    this.keyServ.Delete(id).subscribe({
      next: r => {
        if (r === true){
          this.notify.push("Успешно")
          this.ngOnInit()
        }else {
          this.notify.push('Ошибка')
        }
      }
    })
  }

    blockApiKey(id: string, isb: boolean) {
      this.keyServ.blockKey(id, isb).subscribe({
        next: r => {
          if (r === true){
            this.notify.push("Усешно")
            this.ngOnInit()
          }
          else {
            this.notify.push("Ошибка")
          }
        }
      })
    }

  facOn(fa: boolean) {
    let user = this.acc.getSession();
    if (user?.id){
      this.acc.change2Fa(user?.id, fa).subscribe({
        next: r => {
          if (r === true){
            this.notify.push("Успешно")
          }else {
            this.notify.push("Ошибка")
          }
        }
      });
    }
  }

  renewKey(id: string) {
    
  }
}
