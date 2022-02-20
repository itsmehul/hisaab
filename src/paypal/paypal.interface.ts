interface PurchaseUnits {
  amount: Amount;
  reference_id?: string;
  description?: string;
}

interface Amount {
  value: number;
  currency_code: string;
}

export interface PaypalPaymentObject {
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: PurchaseUnits[];
}
