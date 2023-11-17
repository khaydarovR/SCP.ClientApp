import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {IProduct} from "../remote/dto/product";
import {BASE_URL} from "../data/myConst";
import {ISignInResponse} from "../remote/response/ISignInResponse";
import {ICreateAccountDTO} from "../remote/dto/ICreateAccountDTO";
import {PageNotifyService} from "./error.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signInResponse!: ISignInResponse
  constructor(private client: HttpClient, private pageNotifyService: PageNotifyService) {

  }

  register(email: string, pw: string, userName: string) {
    const data: ICreateAccountDTO = {
      email: email,
      password: pw,
      userName: userName
    };
    return this.client.post(BASE_URL + 'Auth/SignUp', data).subscribe({
      next: (response) => console.log('Account created successfully', response),
      error: (e) => console.error(e),
      complete: () => console.info('Account creation request complete')
    });
  }

  login(login: string, pw: string): ISignInResponse {
    this.client.get<ISignInResponse>(BASE_URL + `api/Auth/SignIn?Email=${login}&Password=${pw}`).subscribe({
      next: (response) => {
        this.signInResponse = response
        console.log(response)
        this.setSession(response)
      },
      error: (e) => this.pageNotifyService.handle(e),
      complete: () => console.info('complete')
    })
    return this.signInResponse
  }

  private setSession(sessia: ISignInResponse) {
    const token = sessia.jwt;
    localStorage.setItem('id_token', token);
  }

  public getSession(): string{
    let t = localStorage.getItem('id_token')
    return t??''
  }

  logout() {
    localStorage.removeItem("id_token");
  }

}
