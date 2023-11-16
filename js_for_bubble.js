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
  MerchantTradeNo: "