"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { updatePhoneRequest, updatePhoneVerify } from "@/hooks/fetch/server/user";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// 국제 전화번호 (숫자 7~15자리, + 가능)
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

// 하이픈 자동 추가 함수 (한국 번호만 하이픈, 해외는 그대로)
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, ""); // 숫자만 추출

  // 해외 번호 (+ 시작한 경우 → 하이픈 없이 그대로)
  if (value.startsWith("+")) {
    return `+${digits}`;
  }

  // 한국 번호 (02-123-4567, 010-1234-5678 등)
  if (digits.startsWith("02")) {
    return digits.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
  } else if (digits.startsWith("1")) {
    return digits; // 긴급 번호 등
  } else {
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  }
};

export default function PhoneUpdateRequest() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatePhone, setUpdatePhone] = useState("");
  const [otp, setOtp] = useState("");

  // 휴대폰 인증 요청
  const handleSubmitPhone = async () => {
    const rawPhone = updatePhone.replace(/\D/g, ""); // 숫자만 추출

    if (!PHONE_REGEX.test(rawPhone)) {
      toast.error("올바른 휴대폰 번호를 입력해주세요. (예: 01012345678, +821012345678)");
      return;
    }

    setIsLoading(true);
    try {
      const status = await updatePhoneRequest(rawPhone); // <-- 숫자만 보내기

      if (status === 200) {
        toast.success("인증 코드가 발송되었습니다. 문자 메시지를 확인해주세요.");
        setStep(2);
      } else {
        toast.error("이미 사용 중이거나 잘못된 휴대폰 번호입니다.");
      }
    } catch (error) {
      toast.error("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP 인증
  const handleVerifyOtp = async (completedOtp: string) => {
    setIsLoading(true);
    const rawPhone = updatePhone.replace(/\D/g, "");

    try {
      const status = await updatePhoneVerify(rawPhone, completedOtp);

      if (status === 200) {
        toast.success("휴대폰 번호가 성공적으로 변경되었습니다!");
        await fetch("/api/user/update");
        router.push("/service/settings/profile");
        router.refresh();
      } else {
        toast.error("인증 코드가 올바르지 않거나 만료되었습니다.");
        setOtp("");
      }
    } catch (error) {
      toast.error("인증 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      handleSubmitPhone();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full h-full flex flex-col relative">
      <div className="grow overflow-y-auto">
        {step === 1 ? (
          // --- 1단계: 휴대폰 입력 ---
          <AnimatedUnderlineInput
            placeholder="새 휴대폰 번호"
            type="tel"
            value={updatePhone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              setUpdatePhone(formatted);
            }}
            disabled={isLoading}
            required
            className="pt-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 w-full">
              <span className="font-semibold text-gray-800">{updatePhone}</span>로 인증 코드를 보내드렸습니다.
              <br />
              아래 입력란에 인증 코드를 입력하면 자동으로 휴대폰 번호가 변경됩니다.
            </p>
            <div className="my-24">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={handleVerifyOtp} disabled={isLoading}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-12" />
                  <InputOTPSlot index={1} className="size-12" />
                  <InputOTPSlot index={2} className="size-12" />
                  <InputOTPSlot index={3} className="size-12" />
                  <InputOTPSlot index={4} className="size-12" />
                  <InputOTPSlot index={5} className="size-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="w-full sticky bottom-0 z-20">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
        <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
          {step === 1 ? (
            <Button className={cn("w-full h-[3.5rem] rounded-2xl text-lg font-semibold")} type="submit" disabled={isLoading || !updatePhone}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              인증 코드 받기
            </Button>
          ) : (
            <Button
              className={cn("w-full h-[3.5rem] rounded-2xl text-lg font-semibold")}
              type="button"
              onClick={() => {
                router.push("/service/settings/profile");
                router.refresh();
              }}
              disabled={isLoading}
            >
              취소
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
