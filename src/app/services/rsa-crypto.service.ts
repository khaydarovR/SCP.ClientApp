import {Injectable} from '@angular/core';
import * as jsrsasign from 'jsrsasign';
import JSEncrypt from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class RsaCryptoService {
  private privateKeyBase64?: string;
  private publicKeyBase64?: string;
  private publicKeyPem?: string;

  private clientPrivateKeyPem!: string;


  constructor() {
    this.generateKeyPair();
  }

    private async generateKeyPair() {
        window.crypto.subtle.generateKey(
            {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["sign", "verify"]
        )
            .then( async (keyPair) => {

                // export js-based private key into pkcs8 arrayBuffer format
                const exportedPrivateKey = await window.crypto.subtle.exportKey(
                    'pkcs8',
                    keyPair.privateKey
                );

                // turn arrayBuffer into a base64 string
                let base64PrivateKey = btoa(String.fromCharCode(...new Uint8Array(exportedPrivateKey)));
                this.privateKeyBase64 = base64PrivateKey;
                // Convert the base64 private key to PEM format
                let PEMKey = "";
                let slicedBase64 = base64PrivateKey.match(/.{1,64}/g);
                if (slicedBase64){
                    PEMKey = slicedBase64.join('\n');
                }
                PEMKey = `-----BEGIN PRIVATE KEY-----\n${PEMKey}\n-----END PRIVATE KEY-----`
                this.clientPrivateKeyPem = PEMKey

                // similarly get exported public key in spki arrayBuffer format
                const exportedPublicKey = await window.crypto.subtle.exportKey(
                    'spki',
                    keyPair.publicKey
                );

                // and convert it into base64 string
                let base64PublicKey = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
                this.publicKeyBase64 = base64PublicKey;

                // Do the same process to convert public key to spki PEM format
                let PEMPublicKey = "";
                let slicedBase64PublicKey = base64PublicKey.match(/.{1,64}/g);
                if (slicedBase64PublicKey){
                    PEMPublicKey = slicedBase64PublicKey.join('\n');
                }
                let v = `-----BEGIN PUBLIC KEY-----\n${PEMPublicKey}\n-----END PUBLIC KEY-----`
                this.publicKeyPem = v

            }).catch((e) => {
            console.error(e);
        });
    }

    hash(data: string): string {
        let hash = jsrsasign.KJUR.crypto.Util.hashString(data, 'sha256');
        return hash;
    }


    sign(data: string): string {
        const signature = new jsrsasign.KJUR.crypto.Signature({alg: "SHA256withRSA"});
        // Initialize with private key, not public
        signature.init(this.clientPrivateKeyPem!); // Make sure you use your privateKeyPem instead of publicKeyPem
        signature.updateString(data);
        const hexSignature = signature.sign();
        const b64Signature = jsrsasign.hextob64(hexSignature); // Use hextob64 instead of hextob64u
        return b64Signature;
    }

    encrypt(message: string, publicKeyBase64: string): string {
        let publicKey = publicKeyBase64
        console.log('Key for encr: ', publicKey);

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
    return this.publicKeyBase64 as string
  }

  getPrivKFromClient(): string {
      return this.privateKeyBase64 as string
  }
}
