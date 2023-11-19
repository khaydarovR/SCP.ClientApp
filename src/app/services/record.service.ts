import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {RsaCryptoService} from "./rsa-crypto.service";
import {ICreateRecordDTO} from "../remote/dto/ICreateRecordDTO";
import {BASE_URL} from "../data/myConst";
import transformJavaScript from "@angular-devkit/build-angular/src/tools/esbuild/javascript-transformer-worker";
import {EcnryptorService} from "./ecnryptor.service";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {IReadRecordDTO} from "../remote/dto/IReadRecordDTO";

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly endpoint = 'api/Record/Create';

  constructor(private http: HttpClient, private cryptoService: RsaCryptoService,
              private encryptorForServer: EcnryptorService) {}

  async createRecord(title: string,
                     login: string,
                     pw: string,
                     secret: string,
                     forResource: string,
                     safeId: string): Promise<boolean> {
    const publicKeyFromSafe = await this.getPublicKey(safeId);

    // Encrypt all secrets
    const encryptedData = this.encryptData(login, pw, secret, publicKeyFromSafe);
    if (encryptedData === null){
      return false;
    }

    // Hash and sign
    const {signature} = this.hashAndSign(encryptedData);

    // Create record data
    const recordData = this.createRecordData(title, forResource, safeId, encryptedData, signature);

    return this.postRecordData(recordData);
  }

// Fetch public key as a function
  private async getPublicKey(safeId: string): Promise<string> {
    console.log('Getting public key from safe');
    return await firstValueFrom(this.getPublicKeyFromSafe(safeId));
  }

// Encrypt function
  private encryptData(login: string, pw: string, secret: string, publicKey: string) {
    const loginEncrypted = this.encryptorForServer.encryptData(login, publicKey);
    const pwEncrypted = this.encryptorForServer.encryptData(pw, publicKey);
    const secretEncrypted = this.encryptorForServer.encryptData(secret, publicKey);

    if (loginEncrypted === false || pwEncrypted === false || secretEncrypted === false){
      return null;
    }
    return { loginEncrypted, pwEncrypted, secretEncrypted };
  }

// Hash and sign function
  private hashAndSign(encryptedData: any) {
    const {loginEncrypted, pwEncrypted, secretEncrypted} = encryptedData;
    const rawData = loginEncrypted + pwEncrypted + secretEncrypted;
    const hashedData = this.cryptoService.hash(rawData);
    let hashFromSumEncryptedData = hashedData;
    console.log('hashFromSumEncryptedData ' + hashFromSumEncryptedData)
    const signature = this.cryptoService.encrypt(hashFromSumEncryptedData, this.cryptoService.getPubKFromClient());
    return { signature };
  }

// Create record data function
  private createRecordData(title: string, forResource: string, safeId: string, encryptedData: any, signature: string) {
    const {loginEncrypted, pwEncrypted, secretEncrypted} = encryptedData;

    const recordData: ICreateRecordDTO = {
      title: title,
      login: loginEncrypted,
      pw: pwEncrypted,
      secret: secretEncrypted as string,
      forResource: forResource,
      safeId: safeId,
      signature: signature,
      clientPrivK: this.cryptoService.getPrivKFromClient()
    };
    return recordData;
  }

// Send post data function
  private async postRecordData(recordData: ICreateRecordDTO) {
    let res = false;
    try {
      const response = await this.http.post<boolean>(BASE_URL + this.endpoint, recordData).toPromise();
      console.log(response);
      res = true;
    } catch (e) {
      console.log(e);
    }
    return res;
  }


  private getPublicKeyFromSafe(safeId: string): Observable<string> {
    let res = this.getPublicKeyForSafe(safeId);
    return res
  }

  private getPublicKeyForSafe(safeId: string): Observable<string> {
    return this.http.get(BASE_URL + `api/Safe/Pubk/${safeId}`, {responseType: 'text'});
  }




  //Methods for get and read record
  public async readRecord(recId: string): Promise<IReadRecordResponse> {
    let pubK = this.cryptoService.getPubKFromClient();

    // Wrap the data source in a Promise
    return new Promise<IReadRecordResponse>((resolve, reject) => {
      this.getEncryptedRecord(recId, pubK).subscribe(
        {
          next: response => {
            response.eLogin = this.cryptoService.decrypt(response.eLogin);
            response.ePw = this.cryptoService.decrypt(response.ePw);
            response.eSecret = this.cryptoService.decrypt(response.eSecret);

            resolve(response as IReadRecordResponse); // Resolve the Promise
          },
          error: error => reject(error) // Reject on error
        }
      );
    });
  }

  private getEncryptedRecord(recId: string, pubKey: string): Observable<IReadRecordResponse> {
    let data: IReadRecordDTO = {
      pubKey: pubKey,
      recId: recId
    }

    return this.http.post<IReadRecordResponse>(`${BASE_URL}api/Record/Read?`, data);
  }
}
