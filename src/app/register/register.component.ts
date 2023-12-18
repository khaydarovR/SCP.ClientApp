import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {PageNotifyService} from "../services/page-notify.service";
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { OAuthService } from 'angular-oauth2-oidc';
import {AppModule} from "../app.module";
import {Observable} from "rxjs";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GoogleSigninButtonModule, AppModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit{
  username = '';
  email = '';
  password = '';
  password2 = '';

  private googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private redirectUri2 = 'https://localhost:7192/api/OAuth/Google';
  private redirectUri3 = window.location.origin + '/index.html';
  private redirectUri = 'http://localhost:4200/register';
  private clientId = '313139694363-orcunjq74ubditjhrce01n8l2e8jjr8c.apps.googleusercontent.com';
  constructor(private authService: AuthService,
              private pushNotifyService: PageNotifyService,
              private socialAuthService: SocialAuthService,
              private http: HttpClient,
              private oauthService: OAuthService) {
    oauthService.redirectUri = this.redirectUri
    oauthService.clientId = this.clientId
    oauthService.loginUrl = this.googleAuthUrl;
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

  OauthLoginFlow() {
    // this.authService.sendGoogleAuthRequest().subscribe({
    //   next: r => console.log(r),
    //   error: e => console.log(e)
    // });
    this.oauthService.initCodeFlow();
  }

  ngOnInit(): void {

  }

}
