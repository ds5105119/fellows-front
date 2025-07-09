// EmailUpdateRequest.tsx
"use client";

import { useState } from "react";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateEmailRequest } from "@/hooks/fetch/server/user";
import { toast } from "sonner";

export default function EmailUpdateRequest() {
  const [updateEmail, setUpdateEmail] = useState("");

  const handleSubmit = async () => {
    const status = await updateEmailRequest(updateEmail);

    if (status === 409) {
      toast.error("이미 사용 중인 이메일입니다.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="grow overflow-y-auto">
        <AnimatedUnderlineInput placeholder="이메일 주소" type="email" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
      </div>

      <div className="w-full sticky bottom-0 z-20">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
        <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
          <Button className={cn("w-full h-[3.5rem] rounded-2xl text-lg font-semibold")} type="submit" onClick={handleSubmit}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
