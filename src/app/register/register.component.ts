import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {PageNotifyService} from "../services/page-notify.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  password2 = '';

  constructor(private authService: AuthService, private pushNotifyService: PageNotifyService) {
  }

  onSubmitRegister() {
    if(this.formIsValid() == false){
      return
    }

    this.authService.register(this.email, this.password, this.username).subscribe(response => {
      if (response === true) {
        this.pushNotifyService.push('Аккаунте создан')
      } else {
        const errors: string[] = response as string[];
        for (let e of errors){
          this.pushNotifyService.push(e)
        }
      }
    });
  }

  private formIsValid(): boolean{
    if (this.username == '' || this.email == '' || this.password == '' || this.password2 == ''){
      this.pushNotifyService.push('Заполните все поля!')
      return false
    }

    if (this.password != this.password2){
      this.pushNotifyService.push('Пароли не совпадают!')
      return false
    }

    if(!this.isValidEmail(this.email)){
      this.pushNotifyService.push('Напишите корректный email')
      return false
    }

    return true
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
