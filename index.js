const HashKey = "5294y06JbISpM5x9"
const HashIV = "v77hoKGq4kWxNNIS"

function createMacValue() {}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0")
}

let date = new Date()
let mm = date.getMonth() + 1
let dd = date.getDate()

let dateCode = [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("/")
let timeCode = [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(":")
console.log(dateCode)
console.log(timeCode)

let dateTimeCode = [
  date.getFullYear(),
  padTo2Digits(date.getMonth() + 1),
  padTo2Digits(date.getDate()),
  padTo2Digits(date.getHours()),
  padTo2Digits(date.getMinutes()),
  padTo2Digits(date.getSeconds()),
].join("")

console.log(dateTimeCode)
let order_params = {
  MerchantTradeNo: `NO${dateTimeCode}`,
  MerchantTradeDate: `${dateCode} ${timeCode}`,
  MerchantID: 2000132,
  PaymentType: "aio",
  TotalAmount: 2000,
  TradeDesc: "訂單測試",
  ItemName: "商品1#商品",
  ReturnURL: "https://www.ecpay.com.tw/return_url.php",
  ChoosePayment: "Credit",
  ClientBackURL: "https://www.ecpay.com.tw/client_back_url.php",
  ItemURL: "https://www.ecpay.com.tw/item_url.php",
  Remark: "交易備註",
  OrderResultURL: "https://www.ecpay.com.tw/order_result_url.php",
  NeedExtraPaidInfo: "Y",
  InvoiceMark: "N",
  EncryptType: 1,
}

let keys = Object.keys(order_params).sort()
console.log(keys)

let rawCode = `HashKey=${HashKey}`
keys.forEach((e) => {
  //   console.log(e)
  //   console.log(order_params[e])
  rawCode += `&${e}=${order_params[e]}`
})

rawCode += `&HashIV=${HashIV}`

console.log(rawCode)

let encoded = encodeURI(rawCode)
console.log(encoded)

let lowered = encoded.toLowerCase()
console.log(lowered)

const getSHA256Hash = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("")
  return hash
}

getSHA256Hash(lowered).then((e) => {
  console.log(e)
  console.log(document.getElementById("CheckMacValue"))
  document.getElementById("MerchantTradeNo").value = order_params["MerchantTradeNo"]
  document.getElementById("MerchantTradeDate").value = order_params["MerchantTradeDate"]
  document.getElementById("TradeDesc").value = order_params["TradeDesc"]
  document.getElementById("ItemName").value = order_params["ItemName"]
  document.getElementById("CheckMacValue").value = e
})
