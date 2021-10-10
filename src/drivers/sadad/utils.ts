import forge from 'node-forge';

export const signData = (data: string, key: string) => {
  const cert = forge.pki.certificateFromPem(key);
  // create envelop data
  const p7 = forge.pkcs7.createEnvelopedData();
  // add certificate as recipient
  p7.addRecipient(cert);
  // set content
  p7.content = forge.util.createBuffer();
  p7.content.putString(data);

  // encrypt
  p7.encrypt();

  // obtain encrypted data with DER format
  const bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();

  const str = Buffer.from(bytes, 'binary').toString('utf8');

  return str;
};
