# 綠界發票(ECPay) Node.js SDK [![CI](https://github.com/depresto/ecpay-invoice-sdk/workflows/CI/badge.svg)](https://github.com/depresto/ecpay-invoice-sdk/actions?query=workflow%3ACI) [![codecov](https://badgen.net/codecov/c/github/depresto/ecpay-invoice-sdk)](https://codecov.io/gh/depresto/ecpay-invoice-sdk)


## 安裝 Installation

```bash
# yarn
yarn add ecpay-invoice-sdk

# npm
npm install --save ecpay-invoice-sdk

# pnpm
pnpm add ecpay-invoice-sdk
```

## 使用方式 Usage

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

### 開立發票 Issue B2C invoice

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7896)

```javascript
await client.issueB2CInvoice({
  RelateNumber: "ORDERID12345",
  Print: "0",                   // 0：不列印 1：要列印
  Donation: "0",                // 0：不捐贈 1：要捐贈
  CarrierType: "1",             // 空字串：無載具 1：綠界電子發票載具 2：自然人憑證號碼 3：手機條碼載具
  SpecialTaxType: 0,            // 特種稅額類別
  CustomerEmail: "test@example.com",
  Items: [
    { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
  ],
});
```

## 作廢發票 Revoke B2C invoice

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.revokeB2CInvoice(
  "AA123456",       // 發票號碼
  "YYYY-MM-DD",     // 發票開立日期
  "invoke reason"   // 作廢原因
);
```

### 開立折讓 Issue B2C Allowance

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7901)

```javascript
await client.issueB2CAllowance({
  InvoiceNo: "AA123456",          // 發票號碼
  InvoiceDate: "2023-01-01",      // 發票開立日期
  AllowanceNotify: "E",           // S：簡訊 E：電子郵件 A：皆通知時 N：皆不通知
  CustomerEmail: "test@example.com",
  Items: [
    { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
  ],
});
```

## 作廢折讓 Revoke B2C Allowance

詳情請見官方文件：[文件網址](https://developers.ecpay.com.tw/?p=7809)

```javascript
await client.revokeB2CAllowance(
  "AA123456",         // 發票號碼
  "2016022615195209", // 折讓號碼
  "invoke reason"     // 作廢原因
);
```
