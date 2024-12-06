/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Routes } from "~~/utils/Routes";

export default function PlatForm() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  return (
    <div className="flex flex-col justify-center items-center pt-[200px] relative">
      <Image
        src={"/landingpage/header-bg.png"}
        alt="background"
        width={2000}
        height={2000}
        className="max-h-screen w-screen absolute top-0 z-10"
      />
      <div className="relative z-20">
        <div className="text-center">
          <h1 className="text-[72px] font-semibold text-center leading-[70px]">
            All-in-One <br /> Finance Platform
          </h1>
          <p className="text-xl font-semibold mt-3">
            Next-Gen Account Management for Starknet
          </p>
        </div>
        <div className="flex justify-center mt-9 ">
          <button
            className="bg-btn text-xl font-medium text-white border-2 border-[#C4AEFF] px-7 py-3 rounded-xl"
            onClick={() => window.open(Routes.overview)}
          >
            Launch App
          </button>
        </div>
      </div>
      <div className="relative -mt-5 z-20 animate-macbook" ref={sectionRef}>
        <Image
          src={"/landingpage/macbook.png"}
          alt="macbook"
          width={850}
          height={600}
          className="animate-scale"
        />
        <div className="bg-white rounded-xl p-4 w-fit absolute top-[10%] left-[5%] -rotate-12 animate-left-icon">
          <Image
            src={"/landingpage/strk.svg"}
            alt="icon"
            width={40}
            height={40}
          />
        </div>
        <div className="bg-[#17083F] rounded-xl p-2 px-3 w-fit absolute top-1/4 right-[5%] rotate-12 animate-right-icon">
          <Image
            src={"/landingpage/finance-animation.svg"}
            alt="icon"
            width={30}
            height={30}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2.5 p-2 shadow-lg rounded-2xl w-fit mx-auto">
            <button className="bg-[#D56AFF] rounded-lg text-white font-semibold px-4 py-2.5">
              Batch Opration
            </button>
            <button className="font-semibold px-4 py-2.5">Ai Feature</button>
          </div>
          <p className="text-[#5D5D5D] text-lg text-center mt-8">
            What we'll make you surprise!
          </p>
        </div>
      </div>
      <Image
        src={"/landingpage/padding1.svg"}
        alt="icon"
        width={50}
        height={100}
        className="mt-7"
      />
    </div>
  );
}
