export class Ticket {
  _id?: string;
  code: string;
  purchaseDateTime: Date;
  amount: number;
  purchaser: string;

  constructor(code: string, purchaseDateTime: Date, amount: number, purchaser: string) {
    this.code = code;
    this.purchaseDateTime = purchaseDateTime;
    this.amount = amount;
    this.purchaser = purchaser;
  }
}
