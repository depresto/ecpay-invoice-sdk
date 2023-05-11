import EcpayInvoiceClient from "./ecpay-invoice.client";

const getRandomId = () => Math.floor(Math.random() * 1_000_000).toString();
const client = new EcpayInvoiceClient({
  merchantId: "2000132",
  hashKey: "ejCk326UnaZWKisg",
  hashIV: "q9jcZX8Ib9LM8wYk",
  env: "sandbox",
});

test("issueB2CInvoice", async () => {
  const data = await client.issueB2CInvoice({
    RelateNumber: getRandomId(),
    Print: "0",
    Donation: "0",
    CarrierType: "1",
    SpecialTaxType: 0,
    CustomerEmail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });

  expect(data.Data?.RtnCode).toBe(1);
});

test("revokeB2CInvoice", async () => {
  const data = await client.issueB2CInvoice({
    RelateNumber: getRandomId(),
    Print: "0",
    Donation: "0",
    CarrierType: "1",
    SpecialTaxType: 0,
    CustomerEmail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });
  expect(data.Data?.RtnCode).toBe(1);

  if (!data.Data) return;

  const { InvoiceNo, InvoiceDate } = data.Data;
  const revokeData = await client.revokeB2CInvoice(
    InvoiceNo,
    InvoiceDate.split("+")[0],
    "Reason"
  );
  expect(revokeData.Data?.RtnCode).toBe(1);
});

test("issueB2CAllowance", async () => {
  const data = await client.issueB2CInvoice({
    RelateNumber: getRandomId(),
    Print: "0",
    Donation: "0",
    CarrierType: "1",
    SpecialTaxType: 0,
    CustomerEmail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });
  expect(data.Data?.RtnCode).toBe(1);

  if (!data.Data) return;

  const { InvoiceNo, InvoiceDate } = data.Data;
  const allowanceData = await client.issueB2CAllowance({
    InvoiceNo,
    InvoiceDate: InvoiceDate.split("+")[0],
    AllowanceNotify: "E",
    NotifyMail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });
  expect(allowanceData.Data?.RtnCode).toBe(1);
});

test("revokeB2CAllowance", async () => {
  const data = await client.issueB2CInvoice({
    RelateNumber: getRandomId(),
    Print: "0",
    Donation: "0",
    CarrierType: "1",
    SpecialTaxType: 0,
    CustomerEmail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });
  expect(data.Data?.RtnCode).toBe(1);

  if (!data.Data) return;

  const { InvoiceNo, InvoiceDate } = data.Data;
  const allowanceData = await client.issueB2CAllowance({
    InvoiceNo,
    InvoiceDate: InvoiceDate.split("+")[0],
    AllowanceNotify: "E",
    NotifyMail: "wayne@havbeat.com",
    Items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });
  expect(allowanceData.Data?.RtnCode).toBe(1);

  if (!allowanceData.Data) return;

  const { IA_Allow_No } = allowanceData.Data;
  const revokeAllowanceData = await client.revokeB2CAllowance(
    InvoiceNo,
    IA_Allow_No,
    "Reason"
  );
  expect(revokeAllowanceData.Data?.RtnCode).toBe(1);
});
