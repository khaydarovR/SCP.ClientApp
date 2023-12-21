import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {PageNotifyService} from "../services/page-notify.service";
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { OAuthService } from 'angular-oauth2-oidc';
import {AppModule} from "../app.module";
import { JwtHelperService } from '@auth0/angular-jwt';

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
  jwtToken  = '';

  private redirectUri = 'https://localhost:7192/api/OAuth/Google';
  private clientId = '313139694363-orcunjq74ubditjhrce01n8l2e8jjr8c.apps.googleusercontent.com';
  private scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  constructor(private authService: AuthService,
              private pushNotifyService: PageNotifyService,
              private socialAuthService: SocialAuthService,
              private http: HttpClient,
              private oauthService: OAuthService,
              private route: ActivatedRoute,
              private router: Router,
              private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.googleAuthUrlGen = `https://accounts.google.com/o/oauth2/v2/auth`+
      `?redirect_uri=${this.redirectUri}`+
      `&prompt=consent`+
      `&response_type=code`+
      `&state=http://localhost:4200/register?jwt=`+
      `&client_id=${this.clientId}`+
      `&scope=${this.scope}`+
      `&access_type=offline`

    this.route.queryParams.subscribe(params => {
      if (params['jwt']) {
        this.jwtToken = params['jwt'];
        const decodedToken = this.jwtHelper.decodeToken(this.jwtToken);
        const userId = decodedToken.nameid;
        console.log(userId)
        this.authService.GetUserInfo(userId).subscribe({
          next: r => {
            this.authService.setSession({
              userId: r.userId,
              userName: r.userName,
              jwt: r.jwt
            });
            this.router.navigate(['/home']);
          },
          error: err => {
            console.error(err);
          }
        })
      }
      else {
        console.log('jwt empty')
      }
    });
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


  public googleAuthUrlGen: string = ""


}
