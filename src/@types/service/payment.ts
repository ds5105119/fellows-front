import { z } from "zod";

export const PaymentStartRequestSchema = z.object({
  good_mny: z.number().describe("결제 금액"),
  pay_method: z.enum(["CARD", "BANK"]).describe("결제 수단 코드"),
  good_name: z.string().describe("상품명"),
  user_agent: z.string().nullable().optional().describe("클라이언트 User-Agent"),
});

export type PaymentStartRequest = z.infer<typeof PaymentStartRequestSchema>;

export const PaymentPageRedirectResponseSchema = z.object({
  site_cd: z.string().min(5).max(5).describe("가맹점 ID (영문 대문자+숫자 5자리)"),
  pay_method: z.string().describe("결제 수단 코드 (Mobile: CARD/BANK/MOBX 등, PC: 12자리 코드)"),
  currency: z.string().describe("화폐 단위 (Mobile: 410/840, PC: WON/USD)"),
  Ret_URL: z.string().url().describe("결제 결과를 리턴받을 가맹점 URL"),
  approval_key: z.string().max(256).describe("거래 인증 키"),
  PayUrl: z.string().url().describe("결제창 호출 주소"),
  ordr_idxx: z.string().max(20).describe("가맹점 주문번호 (중복 불가)"),
  good_name: z.string().max(100).describe("상품 이름"),
  good_mny: z.string().max(9).describe("상품 금액"),
  shop_user_id: z.string().max(50).describe("쇼핑몰 회원 ID (휴대폰/상품권 결제 시 필수)"),

  van_code: z.enum(["SCBL", "SCCL", "SCWB", "SCSK"]).optional().describe("상품권/포인트 결제 시 필수. (예: SCBL=도서문화, SCCL=컬쳐랜드 등)"),
  ActionResult: z.literal("batch").optional().describe("결제 실행 모드"),
  AppUrl: z.string().url().optional().describe("외부 앱에서 돌아올 앱스킴 (예: myapp://)"),
  good_cd: z.string().max(20).optional().describe("상품 코드"),
  buyr_name: z.string().max(40).optional().describe("주문자 이름"),
  buyr_mail: z.string().max(100).optional().describe("주문자 이메일"),
  buyr_tel2: z.string().max(20).optional().describe("주문자 휴대폰번호"),
  shop_name: z.string().max(20).optional().describe("사이트 이름 (Mobile)"),
  site_name: z.string().max(20).optional().describe("상점 이름 (PC, 영문 권장)"),
});

export type PaymentPageRedirectResponse = z.infer<typeof PaymentPageRedirectResponseSchema>;
