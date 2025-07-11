"use client";

import { usePayment } from "@/hooks/fetch/payment";

export default function PaymentMain() {
  const payment = usePayment({ good_mny: 1, good_name: "테스트 상품", pay_method: "CARD" });
  return <div>PaymentMain</div>;
}
