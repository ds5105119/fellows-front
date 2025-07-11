import { PaymentStartRequest, PaymentPageRedirectResponseSchema, PaymentPageRedirectResponse } from "@/@types/service/payment";

function openPaymentForm(data: PaymentPageRedirectResponse) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.PayUrl.substring(0, data.PayUrl.lastIndexOf("/")) + "/jsp/encodingFilter/encodingFilter.jsp";
  form.name = "order_info";

  for (const [key, value] of Object.entries(data)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export const usePayment = async (params: PaymentStartRequest) => {
  const transactionRegistrationRequest = await fetch("/api/payment/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const rawTransactionRegistrationResponse = await transactionRegistrationRequest.json();
  const transactionRegistrationResponse = PaymentPageRedirectResponseSchema.parse(rawTransactionRegistrationResponse);

  openPaymentForm(transactionRegistrationResponse);
};
