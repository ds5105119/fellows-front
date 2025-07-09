"use client";

import { useState, useEffect } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useSWR from "swr";
import { Logo } from "@/components/resource/selectlogo";
import { DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function CreateProjectTermsSection({ termsAccepted, setTermsAccepted }: { termsAccepted: boolean; setTermsAccepted: (accepted: boolean) => void }) {
  const [terms1Accepted, setTerms1Accepted] = useState(termsAccepted);
  const [terms2Accepted, setTerms2Accepted] = useState(termsAccepted);

  const privacy = useSWR(`${process.env.NEXT_PUBLIC_TERM_URL}/service/new/privacy`, (url) => fetch(url).then((res) => res.text()), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const third = useSWR(`${process.env.NEXT_PUBLIC_TERM_URL}/service/new/third`, (url) => fetch(url).then((res) => res.text()), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    setTermsAccepted(terms1Accepted && terms2Accepted);
  }, [terms1Accepted, terms2Accepted, setTermsAccepted]);

  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div className="w-full">
        <p className="text-sm font-medium text-muted-foreground mb-4">프로젝트를 만들기 위해 동의가 필요한 약관들이에요</p>
      </div>
      <div className="flex flex-col w-full space-y-2">
        <div className="w-full flex items-start space-x-2">
          <button className="flex items-center space-x-2" onClick={() => setTerms1Accepted(!terms1Accepted)}>
            <CheckIcon className={cn("mt-[0.25rem] !size-5", terms1Accepted || termsAccepted ? "text-blue-500" : "text-zinc-500")} strokeWidth={3} />
            <span
              className={cn(
                "text-sm font-bold px-2 py-1 rounded-full bg-blue-50 select-none",
                terms1Accepted || termsAccepted ? "text-blue-500 bg-blue-50" : "text-zinc-500 bg-zinc-50"
              )}
            >
              필수
            </span>
          </button>
          <div className="ml-1 pt-0 space-x-2">
            <span className="text-sm font-medium">Fellows 서비스 약관 및 개인정보 수집 · 이용 · 제공 동의</span>
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-sm font-medium hover:underline cursor-pointer">(보기)</span>
              </DialogTrigger>
              <DialogContent className="h-[96%] sm:h-4/5 sm:max-w-xl" showCloseButton={false}>
                <DialogHeader className="p-3">
                  <DialogTitle className="sr-only">Fellows 서비스 약관 및 개인정보 수집 · 이용 · 제공 동의</DialogTitle>
                  <DialogDescription className="sr-only" />
                  <div className="select-none">
                    <Logo />
                  </div>
                  <div className="absolute top-3 right-3">
                    <DialogClose asChild>
                      <button type="button" className="text-gray-900 p-3 rounded-md hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200">
                        <XIcon />
                      </button>
                    </DialogClose>
                  </div>
                </DialogHeader>
                <div className="w-full h-full prose-sm prose-h1:font-extrabold pl-3 pt-3 pb-2 text-left overflow-y-auto overflow-x-hidden scrollbar-hide">
                  {privacy.data && <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacy.data.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n")}</ReactMarkdown>}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full flex items-start space-x-2">
          <button className="flex items-center space-x-2" onClick={() => setTerms2Accepted(!terms2Accepted)}>
            <CheckIcon className={cn("mt-[0.25rem] !size-5", terms2Accepted || termsAccepted ? "text-blue-500" : "text-zinc-500")} strokeWidth={3} />
            <span
              className={cn(
                "text-sm font-bold px-2 py-1 rounded-full bg-blue-50 select-none",
                terms2Accepted || termsAccepted ? "text-blue-500 bg-blue-50" : "text-zinc-500 bg-zinc-50"
              )}
            >
              필수
            </span>
          </button>
          <div className="ml-1 pt-0 space-x-2">
            <span className="text-sm font-medium">개인정보 제 3자 제공 동의</span>
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-sm font-medium hover:underline cursor-pointer">(보기)</span>
              </DialogTrigger>
              <DialogContent className="h-[96%] sm:h-4/5 sm:max-w-xl" showCloseButton={false}>
                <DialogHeader className="p-3">
                  <DialogTitle className="sr-only">개인정보 제 3자 제공 동의</DialogTitle>
                  <DialogDescription className="sr-only" />
                  <div className="select-none">
                    <Logo />
                  </div>
                  <div className="absolute top-3 right-3">
                    <DialogClose asChild>
                      <button type="button" className="text-gray-900 p-3 rounded-md hover:bg-gray-100 active:bg-gray-100 transition-colors duration-200">
                        <XIcon />
                      </button>
                    </DialogClose>
                  </div>
                </DialogHeader>
                <div className="w-full h-full prose-sm prose-h1:font-extrabold pl-3 pt-3 pb-2 text-left overflow-y-auto overflow-x-hidden scrollbar-hide">
                  {third.data && <ReactMarkdown remarkPlugins={[remarkGfm]}>{third.data.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n")}</ReactMarkdown>}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
