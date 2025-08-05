import WorkMain1 from "@/components/section/work/workmain1";
import WorkMain2 from "@/components/section/work/workmain2";
import WorkMain3 from "@/components/section/work/workmain3";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12">
      <WorkMain1 />
      <div className="col-span-full w-full">
        <WorkMain2 />
      </div>
      <div className="col-span-full w-full h-dvh">
        <WorkMain3 />
      </div>
    </div>
  );
}
