import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICreateSafeDTO} from "../remote/dto/ICreateSafeDTO";
import {catchError, map, Observable, of, tap} from "rxjs";
import {BASE_URL} from "../data/myConst";
import {PageNotifyService} from "./page-notify.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {ISafeStatResponse} from "../remote/response/ISafeStatResponse";

@Injectable({
  providedIn: 'root'
})
export class SafeService {

  constructor(private client: HttpClient, private notify: PageNotifyService) { }

  createSafe(dto: ICreateSafeDTO):Observable<boolean| string[]>{

    return this.client.post<boolean>(BASE_URL + 'api/Safe/CreateMy', dto).pipe(
      tap(r => console.log(r)),
      map(r => r === true),
      catchError((e) => {
        typeof(e.error.message) == "string" ? this.notify.push(e.error.message): ''
        return of(e.error);
      })
    );
  }

  getLinkedSafes():Observable<Array<IGetLinkedSafeResponse> | string[]>{

    return this.client.get<Array<IGetLinkedSafeResponse>>(BASE_URL + 'api/Safe/GetLinked').pipe(
      tap(r => console.log(r)),
      catchError((e) => {
        typeof(e.error.message) == "string" ? this.notify.push(e.error.message): ''
        return of(e.error);
      })
    );
  }

  getStatForSafe(sId: string){
    return this.client.get<ISafeStatResponse>(BASE_URL + 'api/Safe/GetStat', {
      params: {sid: sId}
    })
  }

}
