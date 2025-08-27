import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { name: "Email", x: "30%", y: "10%" },
  { name: "AI와 견적 작성하러 가기", x: "30%", y: "30%" },
  { name: "Fellows에 직접 문의하기", x: "40%", y: "20%", angle: 10 },
  { name: "Fellows Blog", x: "75%", y: "10%", angle: -4, href: "/blog" },
  { name: "Fellows Works", x: "80%", y: "20%", angle: 5, href: "/works" },
  { name: "Fellows Saas", x: "20%", y: "40%", href: "/service/dashboard" },
];

const stars = ["✱", "✽", "✦", "✸", "✹", "✺"];

export default async function MainContactSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="col-span-1 flex flex-col gap-4 md:gap-6 aspect-square">
        <div className="w-full h-fit flex">
          <div className="w-1/3 rounded-4xl p-14 bg-[#45f3a2]">
            <AspectRatio ratio={1 / 1}>
              <Image alt="펠로우즈 이미지 로고" src="/fellows/logo-img.svg" fill className="obejct-cover" />
            </AspectRatio>
          </div>
          <div className="w-2/3 rounded-4xl p-14 bg-[#45f3a2]">
            <AspectRatio ratio={3 / 1}>
              <Image alt="펠로우즈 글자 로고" src="/fellows/logo-text.svg" fill className="obejct-cover" />
            </AspectRatio>
          </div>
        </div>
        <div className="w-full h-full flex-1 bg-zinc-100 rounded-4xl"></div>
      </div>
      <div className="relative col-span-1 bg-zinc-100 rounded-4xl aspect-square">
        <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
          {socialLinks.map((link) => (
            <MatterBody
              key={link.name}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={link.x}
              y={link.y}
              angle={link.angle || 0}
              isDraggable={false}
            >
              {link?.href ? (
                <Link
                  href={link.href}
                  className="select-none text-xl sm:text-2xl md:text-3xl font-bold bg-white text-[#0015ff] border border-[#0015ff] rounded-full hover:cursor-pointer hover:bg-[#0015ff] hover:text-white md:px-8 md:py-4 py-3 px-6"
                >
                  {link.name}&nbsp;→
                </Link>
              ) : (
                <button className="select-none text-xl sm:text-2xl md:text-3xl font-bold bg-white text-[#0015ff] border border-[#0015ff] rounded-full hover:cursor-pointer hover:bg-[#0015ff] hover:text-white md:px-8 md:py-4 py-3 px-6">
                  {link.name}&nbsp;→
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
                  className={`aspect-square w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-[#0015ff] text-white rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-extrabold`}
                >
                  →
                </div>
              </MatterBody>
            );
          })}
        </Gravity>
      </div>
    </div>
  );
}
