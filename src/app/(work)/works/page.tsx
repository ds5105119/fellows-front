import WorkMain1 from "@/components/section/work/workmain1";
import WorkMain2 from "@/components/section/work/workmain2";

export default async function Home() {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12">
      <WorkMain1 />
      <div className="col-span-full w-full">
        <WorkMain2 />
      </div>
    </div>
  );
}
