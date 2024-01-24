import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, filter, map, Observable, of, Subject, switchMap, tap, throwError} from "rxjs";
import {API_BASE_URL, FRONT_BASE_URL} from "../data/myConst";
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

  private readonly redirectUriGoogle = API_BASE_URL + 'api/OAuth/Google';
  private readonly clientIdGoogle = '313139694363-orcunjq74ubditjhrce01n8l2e8jjr8c.apps.googleusercontent.com';
  private readonly scopeGoogle = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

  private readonly redirectUriGitHub = API_BASE_URL + 'api/OAuth/Github';
  private readonly clientIdGitHub = 'ec53b6470c0c43cf1320';
  private readonly scopeGitHub = 'user:email';

  private readonly redirectUriGitea = API_BASE_URL + 'api/OAuth/Gitea';
  private readonly clientIdGitea = '9c58d41e-1ed5-41ff-875b-4c0595cbd448';
  private readonly scopeGitea = 'user';

  googleAuthUrlGen = `https://accounts.google.com/o/oauth2/v2/auth`+
    `?redirect_uri=${this.redirectUriGoogle}`+
    `&prompt=consent`+
    `&response_type=code`+
    `&state=${FRONT_BASE_URL}register?jwt=`+
    `&client_id=${this.clientIdGoogle}`+
    `&scope=${this.scopeGoogle}`+
    `&access_type=offline`

  gitHubAuthUrlGen = `https://github.com/login/oauth/authorize`+
    `?redirect_uri=${this.redirectUriGitHub}`+
    `&state=${FRONT_BASE_URL}register?jwt=`+
    `&client_id=${this.clientIdGitHub}`+
    `&scope=${this.scopeGitHub}`

  giteaAuthUrlGen = `https://git.kamaz.tatar/login/oauth/authorize`+
  `?redirect_uri=${this.redirectUriGitea}`+
  `&state=${FRONT_BASE_URL}register?jwt=`+
  `&client_id=${this.clientIdGitea}`+
  `&response_type=code`+
  `&scope=${this.scopeGitea}`

  register(email: string, pw: string, userName: string): Observable<boolean | string[]> {
    const data: ICreateAccountDTO = {
      email: email,
      password: pw,
      userName: userName
    };

    return this.client.post<boolean>(API_BASE_URL + 'api/Auth/SignUp', data).pipe(
      tap(r => console.log(r)),
      map(r => r === true), // if response is true, request was successful
      catchError((e) => {
        console.error(e.error);
        return of(e.error); // if there was an error, return the error list from the error response
      })
    );
  }

  login(login: string, pw: string, fac: string): Observable<ISignInResponse | undefined> {
    return this.client.get<ISignInResponse>(API_BASE_URL + `api/Auth/SignIn?Email=${login}&Password=${pw}&fac=${fac}`).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError((e) => {
        return of(undefined);
      })
    );
  }


  sendCode(login: string): Observable<boolean | undefined> {
    return this.client.post<boolean>(API_BASE_URL + `api/Auth/Code2FA?email=${login}`, {}).pipe(
      tap(response => {
        return response
      }),
      catchError((e) => {
        return of(undefined);
      })
    );
  }


  public change2Fa(uId: string, isOn: boolean){
    const url = API_BASE_URL + 'api/Auth/Activ2FA';
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

  GetUserInfo(userId: string) {
    const url = API_BASE_URL + 'api/User/Info';
    return this.client.get<IUserInfoResponse>(url, {
      params: {
        uId: userId,
      }
    })
  }
}
