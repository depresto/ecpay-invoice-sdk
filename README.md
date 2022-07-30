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

詳情請見官方文件：[文件網址](https://www.ecpay.com.tw/Content/files/ecpay_004.pdf)

```javascript
await client.issueB2CInvoice({

});
```

## Revoke B2C invoice

詳情請見官方文件：[文件網址](https://www.ecpay.com.tw/Content/files/ecpay_004.pdf)

```javascript
await client.revokeB2CInvoice(
  "AA123456",       // 發票號碼
  "YYYY-MM-DD",     // 發票開立日期
  "invoke reason"   // 作廢原因
);
```
