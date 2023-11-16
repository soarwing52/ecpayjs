var HashKey = 'ejCk326UnaZWKisg';
var HashIV = 'q9jcZX8Ib9LM8wYk';

async function createCryptoKey(keyUsage) {
  //   const hashkeyBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(HashKey));
  //   const hashIVBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(HashKey));
  // split the sha256 hash byte array into key and iv
  //   let keyPart = new Uint8Array(hashkeyBuffer.slice(0, 16));
  //   let ivPart = new Uint8Array(hashIVBuffer.slice(0, 16));
  // let ivPart = new Uint8Array(hashBuffer.slice(16));
  let keyPart = new TextEncoder().encode(HashKey);
  let ivPart = new TextEncoder().encode(HashIV);
  // create a CryptoKey object from the key byte array
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw', // format
    keyPart, // key data (as a Uint8Array)
    { name: 'AES-CBC' }, // algorithm
    false, // not extractable
    [keyUsage]
  );
  // return CryptoKey and IV
  return { cryptoKey, ivPart };
}

async function encryptData(enc) {
  const { cryptoKey, ivPart } = await createCryptoKey('encrypt');
  const data = new TextEncoder().encode(enc);
  const encryptedBytes = await window.crypto.subtle.encrypt({ name: 'AES-CBC', iv: ivPart }, cryptoKey, data);
  const encrypted = btoa(String.fromCharCode(...new Uint8Array(encryptedBytes)));
  return encrypted;
}

async function decryptData(data) {
  const { cryptoKey, ivPart } = await createCryptoKey('decrypt');
  // Convert the base64-encoded data to a Uint8Array
  const dataBytes = new Uint8Array(
    atob(data)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
  // Decrypt the data using the CryptoKey object
  const decryptedBytes = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv: ivPart }, cryptoKey, dataBytes);
  return new TextDecoder().decode(decryptedBytes);
}

async function checBarCode() {
  let BarCode = '/NPSCN59';
  BarCode = BarCode.replace('+', ' ');

  let dataToHash = {
    MerchantID: 2000132,
    BarCode: BarCode,
  };
  let strData = JSON.stringify(dataToHash);
  console.log(strData);
  strData = encodeURIComponent(strData);
  console.log(strData);
  let encrypted = await encryptData(strData);
  document.getElementById('demo').innerHTML = encrypted;

  sendDataToEcPay(encrypted);
}

function sendDataToEcPay(encoded) {
  const date1 = new Date();
  let timestamp = date1.getTime() / 1000;
  timestamp = parseInt(timestamp);
  let data = {
    MerchantID: '2000132',
    RqHeader: {
      Timestamp: timestamp,
    },
    Data: encoded,
  };
  console.log(data);

  fetch('https://einvoice-stage.ecpay.com.tw/B2CInvoice/CheckBarcode', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
}

function decryptBar() {
  let strToDecrypt = 'XiPrW0fY9qcvZyZ3p4YO9Lmy/26tRJYNg7kUScZ2pi0tTmU9lPaYomsTDWIi8QHGeHn0evGvd2e1nu+6s4r7BtU7wrH0bJXfQIbXbx185mjc6lF9lxwIoSK1G/NnP5VdaGBE0FM1Cbu11AQPbGQE+A==';
  decryptData(strToDecrypt)
    .then((result) => {
      console.log(result);
      let dec = decodeURIComponent(result);

      console.log(dec);
      document.getElementById('decode').textContent = dec;
    })
    .catch((err) => {
      alert(err.message);
    });
}
