"use client";

import { FeaturedSectionMobile } from "./featured-section-mobile";
import { FeaturedSectionDesktop } from "./featured-section-desktop";

export function FeaturedSection() {
  return (
    <>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <FeaturedSectionMobile />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <FeaturedSectionDesktop />
      </div>
    </>
  );
}
