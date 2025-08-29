import WorkMain2 from "@/components/section/work/workmain2";
import WorkMain3 from "@/components/section/work/workmain3";
import WorkMain4 from "@/components/section/work/workmain4";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 bg-[#F1F1F1]">
      <div className="col-span-full w-full">
        <WorkMain2 />
      </div>
      <div className="col-span-full w-full">
        <WorkMain3 />
      </div>
      <div className="col-span-full w-full">
        <WorkMain4 />
      </div>
    </div>
  );
}
