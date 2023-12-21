import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, filter, map, Observable, of, Subject, switchMap, tap, throwError} from "rxjs";
import {BASE_URL} from "../data/myConst";
import {ISignInResponse} from "../remote/response/ISignInResponse";
import {ICreateAccountDTO} from "../remote/dto/ICreateAccountDTO";
import {PageNotifyService} from "./page-notify.service";
import {ISessia} from "../data/sessia";
import {IUserInfoResponse} from "../remote/response/IUserInfoResponse";


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

  login(login: string, pw: string, fac: string): Observable<ISignInResponse | undefined> {
    return this.client.get<ISignInResponse>(BASE_URL + `api/Auth/SignIn?Email=${login}&Password=${pw}&fac=${fac}`).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError((e) => {
        return of(undefined);
      })
    );
  }


  sendCode(login: string): Observable<boolean | undefined> {
    return this.client.post<boolean>(BASE_URL + `api/Auth/Code2FA?email=${login}`, {}).pipe(
      tap(response => {
        return response
      }),
      catchError((e) => {
        return of(undefined);
      })
    );
  }


  public change2Fa(uId: string, isOn: boolean){
    const url = BASE_URL + 'api/Auth/Activ2FA';
    return this.client.post<boolean>(url, {}, {
      params: {
        uId: uId,
        isOn: isOn
      }
    })
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


  private googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private redirectUri = 'https://localhost:7192/api/OAuth/Google';
  private clientId = '313139694363-orcunjq74ubditjhrce01n8l2e8jjr8c.apps.googleusercontent.com';
  OauthLoginFlow(): Observable<any> {

    const params = new HttpParams()
      .set('redirect_uri', this.redirectUri)
      .set('prompt', 'consent')
      .set('response_type', 'code')
      .set('client_id', this.clientId)
      .set('scope', 'https://www.googleapis.com/auth/userinfo.profile')
      .set('access_type', 'offline');

    return this.client.get(this.googleAuthUrl, {
      params: params,
      observe: 'response',
      responseType: 'text',
    }).pipe(
      catchError((error) => {
        // Check if the response is an HTTP 302
        if (true) {
          const newUrl = error.headers.get('Location');
          console.log(newUrl)
          return this.client.get(newUrl, {
            params: params,
            observe: 'response',
            responseType: 'text',
          });
        }
        return throwError(error);
      })
    );
  }

  GetUserInfo(userId: string) {
    const url = BASE_URL + 'api/User/Info';
    return this.client.get<IUserInfoResponse>(url, {
      params: {
        uId: userId,
      }
    })
  }
}
