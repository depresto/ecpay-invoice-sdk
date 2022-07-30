import EcpayInvoiceClient from "./ecpay-invoice.client";

test("issueB2CInvoice", async () => {
  const client = new EcpayInvoiceClient({});
  const data = await client.issueB2CInvoice({
    RelateNumber: Math.floor(Date.now() / 1000).toString(),
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
