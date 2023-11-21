import {Injectable} from '@angular/core';
import JSEncrypt from "jsencrypt";

@Injectable({
  providedIn: 'root'
})
export class EcnryptorService {

  constructor() { }

  encryptData(data: string, publicKey: string) {
    let encrypt = new JSEncrypt();
    publicKey = publicKey;// decode from base64
    encrypt.setPublicKey(publicKey); // setting public key
    let encryptedData = encrypt.encrypt(data); // encrypting data
    return encryptedData;
  }
}
