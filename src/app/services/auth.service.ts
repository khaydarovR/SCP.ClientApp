import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../remote/dto/product";
import {BASE_URL} from "../data/myConst";
import {ISignInResponse} from "../remote/dto/ISignInResponse";
import {ICreateAccountDTO} from "../remote/dto/ICreateAccountDTO";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signInResponse!: string
  constructor(private client: HttpClient) {

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

  login(login: string, pw: string): string {
    this.client.get<string>(BASE_URL + "").subscribe({
      next: (response) => {
        this.signInResponse = response
        this.setSession({token: response})
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    })
    return this.signInResponse
  }

  private setSession(authResult: {token: string}) {
    const token = authResult.token;
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
