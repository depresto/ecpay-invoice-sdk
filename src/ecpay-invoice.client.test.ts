import EcpayInvoiceClient from "./ecpay-invoice.client";

const randomStr = () => (Math.random() + 1).toString(36).substring(7);

test("issueB2CInvoice", async () => {
  const orderId = randomStr();

  const client = new EcpayInvoiceClient({});
  const data = await client.issueB2CInvoice({
    RelateNumber: orderId,
    Print: "0",
    Donation: "0",
    CarrierType: "1",
    SpecialTaxType: 0,
    SalesAmount: 1000,
    CustomerEmail: "wayne@havbitx.com",
    items: [
      { ItemName: "測試商品", ItemCount: 1, ItemWord: "個", ItemPrice: 1000 },
    ],
  });

  expect(data.Data?.RtnCode).toBe(1);
});
