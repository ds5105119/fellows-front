"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { updateEmailRequest, updateEmailVerify } from "@/hooks/fetch/server/user";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailUpdateRequest() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updateEmail, setUpdateEmail] = useState("");
  const [otp, setOtp] = useState("");

  // 이메일 인증 요청을 처리하는 로직 (기존과 동일)
  const handleSubmitEmail = async () => {
    if (!EMAIL_REGEX.test(updateEmail)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // API 호출 및 status 반환값은 그대로 유지
      const status = await updateEmailRequest(updateEmail);

      if (status === 200) {
        toast.success("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
        setStep(2);
      } else {
        // 서버에서 다른 상태 코드를 반환하는 경우 (e.g., 409)
        toast.error("이미 사용 중이거나 잘못된 이메일입니다.");
      }
    } catch (error) {
      toast.error("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP 코드 인증 핸들러 (기존과 동일)
  const handleVerifyOtp = async (completedOtp: string) => {
    setIsLoading(true);
    try {
      const status = await updateEmailVerify(updateEmail, completedOtp);

      if (status === 200) {
        toast.success("이메일이 성공적으로 변경되었습니다!");
        await fetch("/api/auth/session/update");
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
      handleSubmitEmail();
    }
  };

  return (
    // 전체를 form으로 감싸고 onSubmit 핸들러 연결
    <form onSubmit={handleFormSubmit} className="w-full h-full flex flex-col relative">
      {/* 단계에 따라 다른 콘텐츠를 보여주는 영역 */}
      <div className="grow overflow-y-auto">
        {step === 1 ? (
          // --- 1단계: 이메일 입력 ---
          <AnimatedUnderlineInput
            placeholder="새 이메일 주소"
            type="email"
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.target.value)}
            disabled={isLoading}
            required
            className="pt-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 w-full">
              <span className="font-semibold text-gray-800">{updateEmail}</span>로 코드를 보내 드렸습니다
              <br />
              아래 입력란에 인증 코드를 입력하면 자동으로 이메일이 변경됩니다.
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

      {/* 하단 고정 버튼 영역 */}
      <div className="w-full sticky bottom-0 z-20">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
        <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
          {step === 1 ? (
            <Button
              className={cn("w-full h-[3.5rem] rounded-2xl text-lg font-semibold")}
              type="submit" // 폼 제출을 트리거
              disabled={isLoading || !updateEmail}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              인증 메일 받기
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
