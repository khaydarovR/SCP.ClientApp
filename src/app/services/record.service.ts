import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {RsaCryptoService} from "./rsa-crypto.service";
import {ICreateRecordDTO} from "../remote/dto/ICreateRecordDTO";
import {BASE_URL} from "../data/myConst";
import transformJavaScript from "@angular-devkit/build-angular/src/tools/esbuild/javascript-transformer-worker";

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly endpoint = 'api/Record/Create';

  constructor(private http: HttpClient, private cryptoService: RsaCryptoService) {}

  async createRecord(title: string,
                     login: string,
                     pw: string,
                     secret: string,
                     forResource: string,
                     safeId: string): Promise<boolean> {
    let res = false;

    // Convert observable to promise to store the public key from safe.
    let publicKeyFromSafe = await firstValueFrom(this.getPublicKeyFromSafe(safeId));

    console.log('pub key from safe: ' + publicKeyFromSafe);

    //

    // Encryption calls
    console.log(this.cryptoService)
    const loginEncrypted= this.cryptoService.encrypt(login, publicKeyFromSafe);
    const pwEncrypted = this.cryptoService.encrypt(pw, publicKeyFromSafe);
    const secretEncrypted = this.cryptoService.encrypt(secret, publicKeyFromSafe);


    // Hashing and signing
    const rawData = loginEncrypted;
    const hashedData = this.cryptoService.hash(rawData);
    const signature = this.cryptoService.encrypt(hashedData, this.cryptoService.getPubKFromClient());

    console.log('encrypted secrets hash ' + hashedData);

    console.log('signature base 64 ' + signature);

    const recordData: ICreateRecordDTO = {
      title: title,
      login: loginEncrypted,
      pw: pwEncrypted,
      secret: secretEncrypted,
      forResource: forResource,
      safeId: safeId,
      signature: signature,
      clientPrivK: this.cryptoService.getPrivKFromClient()
    };

    console.log('dto ' + recordData);

    // Convert the post observable to a promise
    try {
      const response = await this.http.post<boolean>(BASE_URL+this.endpoint, recordData).toPromise();
      console.log(response);
      res = true;
    } catch (e) {
      console.log(e);
    }

    return res;
  }


  getPublicKeyFromSafe(safeId: string): Observable<string> {
    let res = this.getPublicKeyForSafe(safeId);
    return res
  }

  getPublicKeyForSafe(safeId: string): Observable<string> {
    return this.http.get(BASE_URL + `api/Safe/Pubk/${safeId}`, {responseType: 'text'});
  }
}
