"use client";

import Image from "next/image";
import { useState } from "react";

export function FoodCompare() {
  const [pos, setPos] = useState(58);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#ece7dc]">
        <Image
          src="/images/branding/food-sample.jpg"
          alt="Style sample of a plated noodle dish in natural colour."
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src="/images/branding/food-sample.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover grayscale contrast-75"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-white"
          style={{ left: `${pos}%` }}
        />
      </div>
      <label className="mt-3 block text-sm text-[#2c3128]">
        Drag to compare a flatter version with the colour version
        <input
          type="range"
          min={8}
          max={92}
          value={pos}
          onChange={(event) => setPos(Number(event.target.value))}
          className="mt-2 block h-11 w-full accent-[#3F5214]"
        />
      </label>
      <p className="mt-2 text-sm leading-relaxed text-[#2c3128]">
        Style sample, not a client photo. The flat side is the same picture with the colour pulled down, so you can see the kind of lift a natural edit aims for.
      </p>
    </div>
  );
}
