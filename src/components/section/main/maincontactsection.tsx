"use client";

import { memo, useState } from "react";
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UnderlineToBackground from "@/components/fancy/text/underline-to-background";

const socialLinks = [
  {
    name: "CONTACT",
    x: "30%",
    y: "10%",
    children: (
      <>
        <div className="w-1/3 p-8 md:p-14 text-xl font-medium text-[#0015ff] leading-loose">CONTACT</div>
        <div className="w-2/3 p-8 md:p-14 text-xl font-medium text-[#0015ff] leading-loose">
          <Link href="mailto:sales@iihus.com">
            <UnderlineToBackground targetTextColor="#f0f0f0" className="cursor-pointer">
              SALES@IIHUS.COM
            </UnderlineToBackground>
          </Link>
          <br />
          <Link href="mailto:iih@iihus.com">
            <UnderlineToBackground targetTextColor="#f0f0f0" className="cursor-pointer">
              IIH@IIHUS.COM
            </UnderlineToBackground>
          </Link>
          <br />
          <br />
          INSTAGRAM&nbsp;
          <Link href="https://instagram.com/fellows.my" target="_blank" rel="noopener noreferrer">
            <UnderlineToBackground targetTextColor="#f0f0f0" className="cursor-pointer">
              @FELLOWS.MY
            </UnderlineToBackground>
          </Link>
        </div>
      </>
    ),
  },
  { name: "AI와 견적 작성해보기", x: "30%", y: "30%" },
  { name: "FELLOWS BLOG", x: "75%", y: "10%", angle: -4, href: "/blog" },
  { name: "FELLOWS WORKS", x: "40%", y: "20%", angle: 10, href: "/works" },
  { name: "FELLOWS SaaS", x: "20%", y: "40%", href: "/service/dashboard" },
];

const stars = ["✱", "✽", "✦", "✸", "✹", "✺"];

const PhysicsGravitySection = memo(function PhysicsGravitySection({ onMenuSelect }: { onMenuSelect: (menu: string) => void }) {
  return (
    <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
      {socialLinks.map((link) => (
        <MatterBody key={link.name} matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x={link.x} y={link.y} angle={link.angle || 0} isDraggable={false}>
          {link?.href ? (
            <Link
              href={link.href}
              className={cn(
                "select-none text-xl sm:text-2xl md:text-3xl font-bold border border-[#0015ff] rounded-full hover:cursor-pointer md:px-8 md:py-4 py-3 px-6",
                "bg-white text-[#0015ff] hover:bg-[#0015ff] hover:text-white"
              )}
            >
              {link.name}&nbsp;→
            </Link>
          ) : (
            <button
              onClick={() => onMenuSelect(link.name)}
              className={cn(
                "select-none text-xl sm:text-2xl md:text-3xl font-bold border border-[#0015ff] rounded-full hover:cursor-pointer md:px-8 md:py-4 py-3 px-6",
                "bg-white text-[#0015ff] hover:bg-[#0015ff] hover:text-white"
              )}
            >
              {link.name}
            </button>
          )}
        </MatterBody>
      ))}

      {stars.map((star, i) => (
        <MatterBody
          key={i}
          matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
          x={`${Math.random() * 80 + 10}%`}
          y={`${Math.random() * 80 + 10}%`}
          angle={Math.random() * 360}
        >
          <div
            className={`aspect-square w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#0015ff] text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl md:text-3xl`}
          >
            {star}
          </div>
        </MatterBody>
      ))}

      {[0, 1].map((value, index) => {
        return (
          <MatterBody
            key={index}
            matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
            x={`${Math.random() * 80 + 10}%`}
            y={`${Math.random() * 80 + 10}%`}
            angle={Math.random() * 360}
            bodyType="circle"
          >
            <div
              className={`aspect-square w-14 h-14 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-[#0015ff] text-white rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-extrabold`}
            >
              →
            </div>
          </MatterBody>
        );
      })}
    </Gravity>
  );
});

export default function MainContactSection() {
  const [selectedMenu, setSelectedMenu] = useState<string>("CONTACT");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="col-span-1 flex flex-col gap-4 md:gap-6 aspect-square">
        <div className="w-full h-fit flex">
          <div className="w-1/3 rounded-4xl p-7 md:p-14 bg-[#45f3a2]">
            <AspectRatio ratio={1 / 1}>
              <Image alt="펠로우즈 이미지 로고" src="/fellows/logo-img.svg" fill className="obejct-cover" />
            </AspectRatio>
          </div>
          <div className="w-2/3 rounded-4xl p-7 md:p-14 bg-[#45f3a2]">
            <AspectRatio ratio={3 / 1}>
              <Image alt="펠로우즈 글자 로고" src="/fellows/logo-text.svg" fill className="obejct-cover" />
            </AspectRatio>
          </div>
        </div>
        <div className="w-full h-full flex-1 bg-zinc-100 rounded-4xl flex">{socialLinks.filter((l) => l.name == selectedMenu)[0]?.children}</div>
      </div>
      <div className="relative col-span-1 bg-zinc-100 rounded-4xl aspect-square overflow-hidden">
        <PhysicsGravitySection onMenuSelect={setSelectedMenu} />
      </div>
    </div>
  );
}
