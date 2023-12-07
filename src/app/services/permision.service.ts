import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PageNotifyService} from "./page-notify.service";
import {IGetUserResponse} from "../remote/response/IGetUserResponse";
import {BASE_URL} from "../data/myConst";

@Injectable({
  providedIn: 'root'
})
export class PermisionService {

  constructor(private client: HttpClient, private notify: PageNotifyService) { }

  public GetAllPermisions(){
    return this.client.get<Array<Permision>>(BASE_URL + 'api/SafeAccess/Permisions')
  }

  public getPerForUser(sId: string, uId: string){
    return this.client.get<Array<Permision>>(BASE_URL + 'api/SafeAccess/GetPer', {
      params: {sId, uId}
    })
  }

  public justInvite(safeId: string, email: string){
    return this.client.post(BASE_URL + 'api/SafeAccess/JustInvite', {}, {
      params: {safeId: safeId, email: email}, responseType: "text"
    })
  }
}

export class Permision {
  name: string;
  readonly slug: string;
  constructor(name: string, slug: string) {
    this.name = name
    this.slug = slug
  }
}
