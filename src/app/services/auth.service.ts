import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of, Subject, tap} from "rxjs";
import {BASE_URL} from "../data/myConst";
import {ISignInResponse} from "../remote/response/ISignInResponse";
import {ICreateAccountDTO} from "../remote/dto/ICreateAccountDTO";
import {PageNotifyService} from "./page-notify.service";
import {ISessia} from "../data/sessia";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signInResponse?: ISignInResponse

  private sessionSubject = new Subject<ISessia|null>();

  public session$ = this.sessionSubject.asObservable();
  constructor(private client: HttpClient, private pageNotifyService: PageNotifyService) {

  }

  register(email: string, pw: string, userName: string): Observable<boolean | string[]> {
    const data: ICreateAccountDTO = {
      email: email,
      password: pw,
      userName: userName
    };

    return this.client.post<boolean>(BASE_URL + 'api/Auth/SignUp', data).pipe(
      tap(r => console.log(r)),
      map(r => r === true), // if response is true, request was successful
      catchError((e) => {
        console.error(e.error);
        return of(e.error); // if there was an error, return the error list from the error response
      })
    );
  }

  login(login: string, pw: string): Observable<ISignInResponse | undefined> {
    return this.client.get<ISignInResponse>(BASE_URL + `api/Auth/SignIn?Email=${login}&Password=${pw}`).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError((e) => {
        return of(undefined);
      })
    );
  }

  setSession(response: ISignInResponse){
    let session: ISessia = { id: response.userId, jwt: response.jwt, userName: response.userName};
    localStorage.setItem('id', session.id);
    localStorage.setItem('jwt',session.jwt);
    localStorage.setItem('name',session.userName);
    // notify observers that session has updated
    this.sessionSubject.next(session);
  }

  public getSession(): ISessia|null{
    let _jwt = localStorage.getItem('jwt')
    let _id = localStorage.getItem('id')
    let _name = localStorage.getItem('name')
    if (_id !== null && _jwt !== null && _name !== null) {
      let session: ISessia = { id: _id, jwt: _jwt, userName: _name};
      this.sessionSubject.next(session);
      return {
        id: _id,
        jwt: _jwt,
        userName: _name
      }
    }
    return null;
  }

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    this.sessionSubject.next(null);
  }

}
