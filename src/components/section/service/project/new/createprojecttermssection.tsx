import { CheckIcon } from "lucide-react";

export function CreateProjectTermsSection() {
  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div className="w-full">
        <p className="text-sm font-medium text-muted-foreground mb-4">프로젝트를 만들기 위해 동의가 필요한 약관들이에요</p>
      </div>
      <div className="flex flex-col w-full space-y-1.5">
        <div className="w-full flex space-x-1.5">
          <CheckIcon className="mt-[0.25rem] !size-5 text-blue-500" strokeWidth={3} />
          <div className="space-x-1">
            <span className="text-sm font-bold text-blue-500">필수</span>
            <span className="text-sm font-medium">Fellows 서비스 약관 및 개인정보 수집 · 이용 · 제공 동의</span>
          </div>
        </div>

        <div className="w-full flex space-x-1.5">
          <CheckIcon className="mt-[0.25rem] !size-5 text-blue-500" strokeWidth={3} />
          <div className="space-x-1">
            <span className="text-sm font-bold text-blue-500">필수</span>
            <span className="text-sm font-medium">개인정보 제 3자 제공 동의</span>
          </div>
        </div>
      </div>
    </div>
  );
}
