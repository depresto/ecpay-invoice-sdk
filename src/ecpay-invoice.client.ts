import axios from "axios";
import crypto from "crypto";
import {
  EcpayResponse,
  IssueB2CInvoiceParams,
  IssueB2CInvoiceResult,
  RevokeB2CInvoiceResult,
  IssueB2CAllowanceParams,
  IssueB2CAllowanceResult,
  RevokeB2CAllowanceResult,
} from ".";

class EcpayInvoiceClient {
  apiEndpoint: string;
  merchantId: string;
  hashKey: string;
  hashIV: string;

  constructor(params: {
    merchantId?: string;
    hashKey?: string;
    hashIV?: string;
    env?: "sandbox" | "production";
  }) {
    this.merchantId = params.merchantId ?? "2000132";
    this.hashKey = params.hashKey ?? "ejCk326UnaZWKisg";
    this.hashIV = params.hashIV ?? "q9jcZX8Ib9LM8wYk";

    this.apiEndpoint = (params.env ? params.env === "sandbox" : true)
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
    let decrypted = decipher.update(data, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const decodedData = decodeURIComponent(decrypted).replace(
      /[\x00-\x20]+/g,
      ""
    );
    return JSON.parse(decodedData);
  }

  public async issueB2CInvoice(
    params: IssueB2CInvoiceParams
  ): Promise<EcpayResponse<IssueB2CInvoiceResult>> {
    const { Items, ...rest } = params;

    return this.queryB2CApi("/B2CInvoice/Issue", {
      TaxType: "1",
      InvType: "07",
      vat: "1",
      ...rest,
      SalesAmount:
        rest.SalesAmount ??
        Items.reduce(
          (acc, item) =>
            acc + (item.ItemAmount ?? item.ItemPrice * item.ItemCount),
          0
        ),
      Items: Items.map((item) => {
        return {
          ...item,
          ItemAmount: item.ItemAmount ?? item.ItemPrice * item.ItemCount,
        };
      }),
    });
  }

  public async revokeB2CInvoice(
    InvoiceNo: string,
    InvoiceDate: string,
    Reason = ""
  ): Promise<EcpayResponse<RevokeB2CInvoiceResult>> {
    return this.queryB2CApi("/B2CInvoice/Invalid", {
      InvoiceNo,
      InvoiceDate,
      Reason,
    });
  }

  public async issueB2CAllowance(
    params: IssueB2CAllowanceParams
  ): Promise<EcpayResponse<IssueB2CAllowanceResult>> {
    const { Items, ...rest } = params;

    return this.queryB2CApi("/B2CInvoice/Allowance", {
      ...rest,
      AllowanceAmount: Items.reduce(
        (acc, item) =>
          acc + (item.ItemAmount ?? item.ItemPrice * item.ItemCount),
        0
      ),
      Items: Items.map((item) => {
        return {
          ...item,
          ItemAmount: item.ItemAmount ?? item.ItemPrice * item.ItemCount,
        };
      }),
    });
  }

  public async revokeB2CAllowance(
    InvoiceNo: string,
    AllowanceNo: string,
    Reason = ""
  ): Promise<EcpayResponse<RevokeB2CAllowanceResult>> {
    return this.queryB2CApi("/B2CInvoice/AllowanceInvalid", {
      InvoiceNo,
      AllowanceNo,
      Reason,
    });
  }

  private async queryB2CApi(
    path: string,
    params: { [key: string]: any }
  ): Promise<EcpayResponse<any>> {
    const { data } = await axios.post(`${this.apiEndpoint}${path}`, {
      MerchantID: this.merchantId,
      RqHeader: { Timestamp: Math.floor(new Date().getTime() / 1000) },
      Data: this.encryptPostData({
        MerchantID: this.merchantId,
        ...params,
      }),
    });

    return {
      PlatformID: data.PlatformID ?? null,
      MerchantID: data.MerchantID,
      RpHeader: data.RpHeader,
      TransCode: data.TransCode,
      TransMsg: data.TransMsg,
      Data: data.Data ? this.decryptResponseData(data.Data) : null,
    };
  }
}

export default EcpayInvoiceClient;
