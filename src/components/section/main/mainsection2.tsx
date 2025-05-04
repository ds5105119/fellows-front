import ScrollSizeDownBox from "@/components/animation/scrollsizedownbox";
import GravityBox from "@/components/animation/gravitybox";
import Image from "next/image";

export default function MainSection2() {
  return (
    <div
      className="
      col-span-full
      flex flex-col gap-6"
    >
      <GravityBox className="w-full px-10">
        <ScrollSizeDownBox className="relative h-[700px] bg-[#faf8f5]">
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
          d<br />
        </ScrollSizeDownBox>
      </GravityBox>
    </div>
  );
}
