import AIRecommendSkeleton from "@/components/section/service/new/airecommendskeleton";

interface RecommendationLoadingProps {
  currentStep: number;
  totalSteps: number;
  isRecommanding: boolean;
  hasCompleted: boolean;
}

export function RecommendationLoading({ currentStep, totalSteps, isRecommanding, hasCompleted }: RecommendationLoadingProps) {
  return (
    <div className="w-full px-5 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between">
        <div className="w-[80%]">
          <p className="text-sm font-medium text-blue-600">{`Step ${currentStep} / ${totalSteps}`}</p>
          <p className="text-2xl md:text-3xl font-bold mt-3">구현에 필요한 기능을 추천하고 있어요.</p>
          <p className="text-sm md:text-base font-normal text-muted-foreground mt-2 whitespace-pre-wrap">프로젝트에 꼭 필요한 기능만 추천해드릴께요.</p>
        </div>
      </div>

      <div className="flex justify-center mt-24 md:mt-36 mb-64 md:mb-64">
        <AIRecommendSkeleton isLoading={isRecommanding} hasCompleted={hasCompleted} />
      </div>
    </div>
  );
}
