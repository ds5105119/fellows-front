import { CheckIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useSWR from "swr";
import { toast } from "sonner";

export function CreateProjectTermsSection() {
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

  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div className="w-full">
        <p className="text-sm font-medium text-muted-foreground mb-4">프로젝트를 만들기 위해 동의가 필요한 약관들이에요</p>
      </div>
      <div className="flex flex-col w-full space-y-2">
        <div className="w-full flex items-center space-x-2">
          <button className="flex items-center space-x-2" onClick={() => toast.info("꼭 동의가 필요한 항목이에요")}>
            <CheckIcon className="mt-[0.25rem] !size-5 text-blue-500" strokeWidth={3} />
            <span className="text-sm font-bold text-blue-500 px-2 py-1 rounded-full bg-blue-50 select-none">필수</span>
          </button>
          <span className="text-sm font-medium">Fellows 서비스 약관 및 개인정보 수집 · 이용 · 제공 동의</span>
          <Dialog>
            <DialogTrigger className="text-sm font-medium hover:underline">(보기)</DialogTrigger>
            <DialogContent className="max-h-[96%] sm:max-h-4/5 sm:max-w-xl overflow-y-auto overflow-x-hidden scrollbar-hide">
              <DialogHeader>
                <DialogTitle className="sr-only">Fellows 서비스 약관 및 개인정보 수집 · 이용 · 제공 </DialogTitle>
                <DialogDescription className="sr-only" />
              </DialogHeader>
              <div className="w-full prose-sm prose-h1:font-extrabold p-4 text-left">
                {privacy.data && <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacy.data.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n")}</ReactMarkdown>}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full flex items-center space-x-2">
          <button className="flex items-center space-x-2" onClick={() => toast.info("꼭 동의가 필요한 항목이에요")}>
            <CheckIcon className="mt-[0.25rem] !size-5 text-blue-500" strokeWidth={3} />
            <span className="text-sm font-bold text-blue-500 px-2 py-1 rounded-full bg-blue-50 select-none">필수</span>
          </button>
          <span className="text-sm font-medium">개인정보 제 3자 제공 동의</span>
          <Dialog>
            <DialogTrigger className="text-sm font-medium hover:underline">(보기)</DialogTrigger>
            <DialogContent className="max-h-[96%] sm:max-h-4/5 sm:max-w-xl overflow-y-auto overflow-x-hidden scrollbar-hide">
              <DialogHeader>
                <DialogTitle className="sr-only">개인정보 제 3자 제공 동의</DialogTitle>
                <DialogDescription className="sr-only" />
              </DialogHeader>
              <div className="w-full prose-sm prose-h1:font-extrabold p-4 text-left">
                {third.data && <ReactMarkdown remarkPlugins={[remarkGfm]}>{third.data.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n")}</ReactMarkdown>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
