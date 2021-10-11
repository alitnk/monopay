import CryptoJS from 'crypto-js';

export const signData = (message: string, key: string): string => {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  // console.log(CryptoJS.enc.Utf8.stringify(keyHex), CryptoJS.enc.Hex.stringify(keyHex));
  // console.log(CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Hex)));

  // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};
