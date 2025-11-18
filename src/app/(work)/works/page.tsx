import Navbar from "@/components/section/work/navbar";
import WorkMain2 from "@/components/section/work/workmain2";
import WorkMain4 from "@/components/section/work/workmain4";
import { CursorProvider } from "@/components/ui/cursor-controller";

export default async function Home() {
  const cursor = <div className="size-4 rounded-full bg-gray-500/40 backdrop-blur-md" />;
  return (
    <div className="md:cursor-none relative">
      <CursorProvider
        defaultContent={cursor}
        defaultVariants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        defaultTransition={{ ease: "easeInOut", duration: 0.15 }}
      >
        <Navbar />
        <div className="grid grid-cols-4 lg:grid-cols-12 bg-[#FFFFFF]">
          <div className="col-span-full w-full">
            <WorkMain2 />
          </div>
          <div className="col-span-full w-full">
            <WorkMain4 />
          </div>
        </div>
      </CursorProvider>
    </div>
  );
}
