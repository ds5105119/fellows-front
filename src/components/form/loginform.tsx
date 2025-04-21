"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Toast } from "@/components/toast/toast";
import { login } from "@/hooks/account/user";

const initialState = {
  code: "",
  message: "",
};

const LoginForm = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.code === "SERVER_ERROR") {
      setToastMessage("로그인에 실패하였습니다.");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="이메일"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
        </div>
        <div className="grid gap-1 relative">
          <Label className="sr-only" htmlFor="password">
            비밀번호
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            autoCapitalize="none"
            autoComplete="current-password"
            autoCorrect="off"
            required={true}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
          </button>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "로그인"}
        </Button>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </form>
  );
};

export default LoginForm;
