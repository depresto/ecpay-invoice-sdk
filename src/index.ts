import EcpayInvoiceClient from "./ecpay-invoice.client";

export type EcpayResponse<T> = {
  PlatformID?: string | null;
  MerchantID: string;
  RpHeader: {
    Timestamp: number;
  };
  TransCode: number;
  TransMsg: string;
  Data: T | null;
};

export type IssueB2CInvoiceParams = {
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
  Items: {
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
export type IssueB2CInvoiceResult = {
  RtnCode: number;
  RtnMsg: string;
  InvoiceNo: string;
  InvoiceDate: string;
  RandomNumber: string;
};

export type RevokeB2CInvoiceResult = {
  RtnCode: number;
  RtnMsg: string;
  InvoiceNo: string;
};

export type IssueB2CAllowanceParams = {
  InvoiceNo: string;
  InvoiceDate: string;
  AllowanceNotify: "E" | "S" | "A" | "N";
  CustomerName?: string;
  NotifyMail?: string;
  NotifyPhone?: string;
  AllowanceAmount?: number;
  Items: {
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
export type IssueB2CAllowanceResult = {
  RtnCode: number;
  RtnMsg: string;
  IA_Allow_No: string;
  IA_Invoice_No: string;
  IA_Date: string;
  IA_Remain_Allowance_Amt: number;
};

export type RevokeB2CAllowanceResult = {
  RtnCode: number;
  RtnMsg: string;
  IA_Invoice_No: string;
};

export default EcpayInvoiceClient;
