import axios from "axios";
import crypto from "crypto";

export type InvoiceResponse<T> = {
  PlatformID?: string | null;
  MerchantID: string;
  RpHeader: {
    Timestamp: number;
  };
  TransCode: number;
  TransMsg: string;
  Data: T | null;
};
export type IssueInvoiceResult = {
  RtnCode: number;
  RtnMsg: string;
  InvoiceNo: string;
  InvoiceDate: string;
  RandomNumber: string;
};
export type RevokeInvoiceResult = {
  RtnCode: number;
  RtnMsg: string;
  InvoiceNo: string;
};

export type InvoiceB2CProps = {
  RelateNumber: string;
  CustomerID?: string;
  CustomerIdentifier?: string;
  CustomerName?: string;
  CustomerAddr?: string;
  CustomerPhone?: string;
  CustomerEmail?: string;
  ClearanceMark?: "1" | "2";
  Print: "0" | "1";
  Donation: "0" | "1";
  LoveCode?: string;
  CarrierType?: "1" | "2" | "3" | "";
  CarrierNum?: string;
  TaxType?: "1" | "2" | "3" | "4" | "9";
  SpecialTaxType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  SalesAmount?: number;
  InvoiceRemark?: string;
  InvType?: "07" | "08";
  vat?: "0" | "1";
  items: {
    ItemSeq?: number;
    ItemName: string;
    ItemCount: number;
    ItemWord: string;
    ItemPrice: number;
    ItemTaxType?: "1" | "2" | "3";
    ItemAmount?: number;
    ItemRemark?: string;
  }[];
};

class EcpayInvoiceClient {
  merchantId: string;
  hashKey: string;
  hashIV: string;
  dryRun: boolean;
  apiEndpoint: string;

  constructor(params: {
    merchantId?: string;
    hashKey?: string;
    hashIV?: string;
    env?: "sandbox" | "production";
  }) {
    this.merchantId = params.merchantId ?? "2000132";
    this.hashKey = params.hashKey ?? "ejCk326UnaZWKisg";
    this.hashIV = params.hashIV ?? "q9jcZX8Ib9LM8wYk";
    this.dryRun = params.env ? params.env === "sandbox" : true;

    this.apiEndpoint = this.dryRun
      ? "https://einvoice-stage.ecpay.com.tw"
      : "https://einvoice.ecpay.com.tw";
  }

  private encryptPostData(params: { [key: string]: any }) {
    const postData = encodeURIComponent(JSON.stringify(params));
    const cipher = crypto.createCipheriv("aes128", this.hashKey, this.hashIV);
    let encrypted = cipher.update(postData, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  private decryptResponseData(data: string) {
    const decipher = crypto.createDecipheriv(
      "aes128",
      this.hashKey,
      this.hashIV
    );
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(data, "hex", "base64");
    decrypted += decipher.final("base64");

    return JSON.parse(decrypted.replace(/[\x00-\x20]+/g, ""));
  }

  public async issueB2CInvoice(
    params: InvoiceB2CProps
  ): Promise<InvoiceResponse<IssueInvoiceResult>> {
    const invoiceData: InvoiceB2CProps = {
      TaxType: "1",
      InvType: "07",
      vat: "1",
      ...params,
    };
    const { items, ...rest } = invoiceData;

    const { data } = await axios.post(`${this.apiEndpoint}/B2CInvoice/Issue`, {
      MerchantID: this.merchantId,
      RqHeader: { Timestamp: Math.floor(new Date().getTime() / 1000) },
      Data: this.encryptPostData({
        ...rest,
        items: items.map((item) => {
          return {
            ...item,
            ItemAmount: item.ItemAmount ?? item.ItemPrice * item.ItemCount,
          };
        }),
      }),
    });

    return {
      PlatformID: data.PlatformID ?? null,
      MerchantID: data.MerchantID,
      RpHeader: data.RpHeader,
      TransCode: data.TransCode,
      TransMsg: data.TransMsg,
      Data: data.Data
        ? (this.decryptResponseData(data.Data) as IssueInvoiceResult)
        : null,
    };
  }

  public async revokeB2CInvoice(
    InvoiceNumber: string,
    InvoiceDate: string,
    InvalidReason = ""
  ): Promise<InvoiceResponse<RevokeInvoiceResult>> {
    const { data } = await axios.post(
      `${this.apiEndpoint}/B2CInvoice/Invalid`,
      {
        MerchantID: this.merchantId,
        RqHeader: { Timestamp: Math.floor(new Date().getTime() / 1000) },
        Data: this.encryptPostData({
          MerchantID: this.merchantId,
          InvoiceNo: InvoiceNumber,
          InvoiceDate,
          Reason: InvalidReason,
        }),
      }
    );
    return {
      PlatformID: data.PlatformID ?? null,
      MerchantID: data.MerchantID,
      RpHeader: data.RpHeader,
      TransCode: data.TransCode,
      TransMsg: data.TransMsg,
      Data: this.decryptResponseData(data.Data) as RevokeInvoiceResult,
    };
  }
}

export default EcpayInvoiceClient;
