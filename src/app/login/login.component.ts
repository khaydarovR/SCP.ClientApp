import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";
import {FormsModule, NgForm} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {RouterLink} from "@angular/router";
import {PageNotifyService} from "../services/page-notify.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatSelectModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  twoFACode: string = '';
  codeIsSend = false;
  constructor(private authService: AuthService, private pushNotifyService: PageNotifyService) {
  }

  onSubmit() {
    if (!this.codeIsSend){
      this.authService.sendCode(this.email).subscribe(
        {
          next: r => {
            if (r === true){
              this.pushNotifyService.push('Подтвредите вход с кодом из письма')
            }
            else {
              this.pushNotifyService.push('ОШибка отправки кода')
            }
          }
        }
      )
    }

    if (this.codeIsSend){
      if (this.email && this.password) {
        this.authService.login(this.email, this.password, this.twoFACode).subscribe(response => {
          if (response) {
            this.pushNotifyService.push('Успешно')
            location.assign("home")
          } else {
            this.pushNotifyService.push('Логин или пароль не верный')
          }
        });
      }
    }

    this.codeIsSend = true

  }
}
