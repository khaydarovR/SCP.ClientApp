import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {catchError, firstValueFrom, map, Observable, ObservableInput, throwError} from 'rxjs';
import {RsaCryptoService} from "./rsa-crypto.service";
import {ICreateRecordDTO} from "../remote/dto/ICreateRecordDTO";
import {BASE_URL} from "../data/myConst";
import {EcnryptorService} from "./ecnryptor.service";
import {IReadRecordResponse} from "../remote/response/IReadRecordResponse";
import {IReadRecordDTO} from "../remote/dto/IReadRecordDTO";
import {IGetRecordResponse} from "../remote/response/GetRecordResponseю";
import {IPatchRecordDTO} from "../remote/dto/IPatchRecordDTO";

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly endpointToCreate = 'api/Record/Create';
  private readonly endpointToUpdate = 'api/Record/Patch';

  constructor(private http: HttpClient, private cryptoService: RsaCryptoService,
              private encryptorForServer: EcnryptorService) {}

  public async createRecord(title: string,
                     login: string,
                     pw: string,
                     secret: string,
                     forResource: string,
                     safeId: string): Promise<boolean|string[]> {
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
    let hashFromSumEncryptedData = this.cryptoService.hash(rawData);
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
    try {
      const response = await this.http.post<boolean|string[]>(BASE_URL + this.endpointToCreate, recordData, { observe: 'response' }).toPromise();
      console.log(response);

      // Check status code - return boolean or errors list
      if (response!.status === 200) {
        return response!.body as boolean;
      } else {
        // As per docs, body should contain the array of error strings on non-200 status.
        return response!.body as string[];
      }
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        console.error(e);
        if (e.error != null && Array.isArray(e.error)) {
          // We're expecting the errors to be in the HttpErrorResponse's `error` field,
          // when the response couldn't be delivered successfully at all
          return e.error as string[];
        } else {
          return [`Unexpected error: ${e.message}`];
        }
      } else {
        console.error(e);
        return [`Unexpected error: ${e}`];
      }
    }
  }


  private getPublicKeyFromSafe(safeId: string): Observable<string> {
    return this.getPublicKeyForSafe(safeId)
  }

  private getPublicKeyForSafe(safeId: string): Observable<string> {
    return this.http.get(BASE_URL + `api/Safe/Pubk/${safeId}`, {responseType: 'text'});
  }


  //Methods for get and read record
  public readRecord(recId: string): Observable<IReadRecordResponse> {
    let pubK = this.cryptoService.getPubKFromClient();

    return this.getEncryptedRecord(recId, pubK).pipe(
      map(response => {
        response.eLogin = this.cryptoService.decrypt(response.eLogin);
        response.ePw = this.cryptoService.decrypt(response.ePw);
        response.eSecret = this.cryptoService.decrypt(response.eSecret);
        return response as IReadRecordResponse;
      })
    );
  }

  private getEncryptedRecord(recId: string, pubKey: string): Observable<IReadRecordResponse> {
    let data: IReadRecordDTO = {
      pubKey: pubKey,
      recId: recId
    }

    return this.http.post<IReadRecordResponse>(`${BASE_URL}api/Record/Read`, data)
  }

  getAllRecords(safeId: string):Observable<IGetRecordResponse[]> {
    return this.sendRequestForGetAllRecords(safeId)

  }

  private sendRequestForGetAllRecords(safeId: string){
    return this.http.get<IGetRecordResponse[]>(`${BASE_URL}api/Record/GetAll?safeId=${safeId}`);
  }


  //Request for edit record

  public async updateRecord(rec: IReadRecordResponse, safeId: string){
    const publicKeyFromSafe = await this.getPublicKey(safeId);

    // Encrypt all secrets
    const encryptedData = this.encryptData(rec.eLogin, rec.ePw, rec.eSecret, publicKeyFromSafe);
    let eData : IPatchRecordDTO = {
      title: rec.title,
      id: rec.id,
      login: encryptedData!.loginEncrypted,
      pw: encryptedData!.pwEncrypted,
      secret: encryptedData!.secretEncrypted,
      isDeleted: rec.isDeleted,
      forResource: rec.forResource,
      signature: "",
      //для проверки подписи
      clientPrivK: this.cryptoService.getPrivKFromClient()
    }
    return this.patchRecord(eData)
  }
  private async patchRecord(recordData: IPatchRecordDTO) {
    try {
      const response = await this.http
        .patch<boolean|string[]>(BASE_URL + this.endpointToUpdate, recordData, { observe: 'response' }).toPromise();
      console.log(response);

      // Check status code - return boolean or errors list
      if (response!.status === 200) {
        return response!.body as boolean;
      } else {
        // As per docs, body should contain the array of error strings on non-200 status.
        return response!.body as string[];
      }
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        console.error(e);
        if (e.error != null && Array.isArray(e.error)) {
          // We're expecting the errors to be in the HttpErrorResponse's `error` field,
          // when the response couldn't be delivered successfully at all
          return e.error as string[];
        } else {
          return [`Unexpected error: ${e.message}`];
        }
      } else {
        console.error(e);
        return [`Unexpected error: ${e}`];
      }
    }
  }
}
