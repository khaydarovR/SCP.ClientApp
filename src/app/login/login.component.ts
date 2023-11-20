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
  constructor(private authService: AuthService, private pushNotifyService: PageNotifyService) {
  }

  onSubmit() {
    console.log(this.email)
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(response => {
        if (response) {
          this.pushNotifyService.push('Успешно')
          location.assign("home")
        } else {
          this.pushNotifyService.push('Логин или пароль не верный')
        }
      });
    }
  }
}
