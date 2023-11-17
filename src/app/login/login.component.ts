import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";
import {FormsModule, NgForm} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private authService: AuthService, private snackBar: MatSnackBar) {
  }

  onSubmit() {
    console.log(this.email)
    if (this.email && this.password) {
      let res = this.authService.login(this.email, this.password);
      this.openSnackBar('Успешно')
    }
  }


  openSnackBar(text: string) {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';


    this.snackBar.open(text, 'OK', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }
}
