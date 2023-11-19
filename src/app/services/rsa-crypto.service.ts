import {Injectable} from '@angular/core';
import * as jsrsasign from 'jsrsasign';
import JSEncrypt from 'jsencrypt';
import forge from "node-forge";

@Injectable({
  providedIn: 'root'
})
export class RsaCryptoService {
  private clientPublicKeyPem?: string;
  private clientPrivateKeyPem!: string;


  constructor() {
    let keyPair = this.generateKeyPair();
    this.clientPublicKeyPem = keyPair.publicKey
    this.clientPrivateKeyPem = keyPair.privateKey
  }

  generateKeyPair(): {publicKey: string, privateKey: string} {
    const rsa = forge.pki.rsa;
    const keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

    return {publicKey, privateKey};
  }

  decrypt(encryptedData: string) {
    const privateKeyFromPem = forge.pki.privateKeyFromPem(this.clientPrivateKeyPem);

    // decode base64
    const bytes = forge.util.decode64(encryptedData);

    return privateKeyFromPem.decrypt(bytes);
  }



    hash(data: string): string {
        let hash = jsrsasign.KJUR.crypto.Util.hashString(data, 'sha256');
        return hash;
    }


    encrypt(message: string, publicKeyBase64: string): string {
        let publicKey = publicKeyBase64

        let encryptor = new JSEncrypt({
            default_key_size: '2048',
        });
        encryptor.setPublicKey(publicKey); // Set the decoded public key
        let encrypted = encryptor.encrypt(message); // Encrypt the message

        if (encrypted) {
            return encrypted;
        } else {
            console.error(`Encryption failed. PublicKey: ${publicKey}, Message: ${message}`);
            throw new Error("Encryption failed.");
        }
    }


  getPubKFromClient(): string {
    return this.clientPublicKeyPem as string
  }

  getPrivKFromClient(): string {
      return this.clientPrivateKeyPem as string
  }
}
