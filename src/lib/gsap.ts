"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const desktopQuery = "(min-width: 768px)";
export const mobileQuery = "(max-width: 767px)";

export { gsap, ScrollTrigger, useGSAP };
