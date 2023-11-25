import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {PageNotifyService} from "./page-notify.service";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {IPatchRecordDTO} from "../remote/dto/IPatchRecordDTO";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {BASE_URL} from "../data/myConst";
import {catchError, map, Observable, of, tap, throwError} from "rxjs";
import {IGetUserResponse} from "../remote/response/IGetUserResponse";
import {IInviteRequestDTO} from "../remote/dto/IInviteRequestDTO";

@Injectable({
  providedIn: 'root'
})
export class SafeAccessService {

  constructor(private client: HttpClient, private notify: PageNotifyService) { }

  public GetLinkedUsers(){
    return this.client.get<Array<IGetUserResponse>>(BASE_URL + 'api/SafeAccess/GetLinkedUsers')
  }

  public sendInviteRequest(request: IInviteRequestDTO): Observable<string> {
    const url = BASE_URL + 'api/SafeAccess/InviteRequest';
    return this.client.post<string>(url, request)
  }

}
