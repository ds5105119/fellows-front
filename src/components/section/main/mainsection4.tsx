export default async function MainSection4() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">다른 업체와는 비교 불허</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            글로벌 개발 파트너사의 AI 전문가 등
            <br />
            100명 이상의 전문가들과 협력하고 있어요.
          </h4>
        </div>
      </div>

      <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0 relative">
        <div className="w-full h-full bg-white rounded-3xl flex items-end justify-center overflow-hidden"></div>
        <div className="absolute top-10 left-10 flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-2">
            <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
            <p className="text-xl md:text-2xl font-extrabold tracking-normal text-foreground leading-normal">
              각 분야 전문가로 구성된 팀이
              <br />
              프로젝트 완수를 위해
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0 relative">
        <div className="w-full h-full bg-emerald-200 rounded-3xl flex items-end justify-center overflow-hidden"></div>
        <div className="absolute top-10 left-10 flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-2">
            <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/ERP</p>
            <p className="text-xl md:text-2xl font-extrabold tracking-normal text-foreground leading-normal">
              자체 ERP로 정교하게 관리되는
              <br />
              인력 시스템으로 예산 낭비 제로
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
