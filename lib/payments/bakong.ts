interface PaymentRequest {
  amount: number;
  currency?: "USD" | "KHR";
  description: string;
  merchantId: string;
  transactionRef: string;
}

export async function generateKhqrPayment(payment: PaymentRequest) {
  // Use require to avoid type mismatch issues from third-party package typings.
  const bakongKhqrModule = require("bakong-khqr");
  const BakongKHQR = bakongKhqrModule.BakongKHQR;
  const IndividualInfo = bakongKhqrModule.IndividualInfo;
  const khqrData = bakongKhqrModule.khqrData;

  const requestCurrency =
    payment.currency === "USD" ? khqrData.currency.usd : khqrData.currency.khr;

  const optionalData = {
    currency: requestCurrency,
    amount: payment.amount,
    billNumber: payment.transactionRef,
    storeLabel: "PsarPulse Subscription",
    terminalLabel: "PsarPulse Web Checkout",
    merchantCategoryCode: "5999",
    expirationTimestamp: Date.now() + 15 * 60 * 1000,
  };

  const accountId = payment.merchantId || "demo_merchant@bk";

  const individualInfo = new IndividualInfo(
    accountId,
    "PsarPulse",
    "Phnom Penh",
    optionalData,
  );

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);
  const qrString = response?.data
    ? ((response.data as { qr?: string }).qr ?? "")
    : "";
  const md5Hash = response?.data
    ? ((response.data as { md5?: string }).md5 ?? "")
    : "";

  return {
    qrString,
    md5: md5Hash,
    transactionId: payment.transactionRef,
  };
}
