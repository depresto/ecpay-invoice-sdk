# ECPay Invoice SDK

綠界發票 SDK

## Installation

```bash
yarn add ecpay-invoice-sdk
```

## Usage

### Create SDK Instance (ES5)

```javascript
const EcpayInvoiceClient = require("ecpay-invoice-sdk");
const client = new EcpayInvoiceClient({
  merchantId: "ECPay Invoice Merchant ID",
  hashKey: "ECPay Invoice Hash Key",
  hashIV: "ECPay Invoice Hash IV",
  env: "production", // 'sandbox' | 'production'
});
```

### Create SDK Instance (ES6)

```javascript
import EcpayInvoiceClient from "ecpay-invoice-sdk";
const client = new EcpayInvoiceClient({
  merchantId: "ECPay Invoice Merchant ID",
  hashKey: "ECPay Invoice Hash Key",
  hashIV: "ECPay Invoice Hash IV",
  env: "production", // 'sandbox' | 'production'
});
```

### Issue B2C invoice

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.issueB2CInvoice({

});
```

## Revoke B2C invoice

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.revokeB2CInvoice(
  "AA123456",       // 發票號碼
  "YYYY-MM-DD",     // 發票開立日期
  "invoke reason"   // 作廢原因
);
```

### Issue B2C Allowance

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.issueB2CAllowance({

});
```

## Revoke B2C Allowance

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.revokeB2CAllowance(
  "AA123456",       // 發票號碼
  "2016022615195209",     // 折讓號
  "invoke reason"   // 作廢原因
);
```
