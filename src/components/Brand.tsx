"use client";

import Image from "next/image";
import logo from "@/components/images/logo.jpeg";

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <Image src={logo} alt="" className="brand-logo" />
      </span>
      <span className="brand-text">
        <span className="brand-name">SOS Villages d&apos;Enfants</span>
        <span className="brand-sub">Tunisie · PAP Revolution</span>
      </span>
    </div>
  );
}
