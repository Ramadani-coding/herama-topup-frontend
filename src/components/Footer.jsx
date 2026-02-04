import React from "react";
import { Link } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";
import {
  RiInstagramFill,
  RiWhatsappFill,
  RiTelegramFill,
} from "react-icons/ri";

const dataFooter = [
  {
    title: "Peta Situs",
    data: [
      { title: "Beranda", href: "/" },
      { title: "Cek Transaksi", href: "/history" },
      { title: "Daftar Harga", href: "/list-product" },
      {
        title: "Hubungi Kami",
        href: "https://api.whatsapp.com/send?phone=6285750231336",
      },
    ],
  },
  {
    title: "Dukungan",
    data: [
      {
        title: "WhatsApp",
        href: "https://api.whatsapp.com/send?phone=6285750231336",
      },
      { title: "Instagram", href: "https://www.instagram.com/herama.topup" },
      { title: "Telegram", href: "https://t.me/a_ramadani" },
    ],
  },
  {
    title: "Legalitas",
    data: [
      { title: "Kebijakan Pribadi", href: "#" },
      { title: "Syarat & Ketentuan", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0e14] border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col space-y-12">
        {/* TOP SECTION: BRAND & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* BRAND INFO */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <Link to="/" className="flex items-center no-underline group w-fit">
              <img
                src="/herama-logo.png"
                alt="Herama Top-Up Logo"
                // Di Footer kita buat logo lebih besar (h-16) dan gagah
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(255,165,0,0.3)]"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Platform top up game tercepat, termurah. Nikmati layanan otomatis
              24 jam untuk game favoritmu.
            </p>

            {/* SOSIAL MEDIA ICONS */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/herama.topup"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#161b22] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500/50 transition-all shadow-lg group"
              >
                <RiInstagramFill
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>

              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=6285750231336"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#161b22] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-lg group"
              >
                <RiWhatsappFill
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/a_ramadani"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-[#161b22] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all shadow-lg group"
              >
                <RiTelegramFill
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* FOOTER LINKS GRID */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {dataFooter.map((group) => (
              <div key={group.title} className="flex flex-col space-y-5">
                <h4 className="font-black text-cyan-400 text-xs uppercase tracking-widest">
                  {group.title}
                </h4>
                <div className="flex flex-col space-y-3">
                  {group.data.map((link) => (
                    <Link
                      key={link.title}
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm no-underline"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="w-full pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] sm:text-xs text-center">
            © 2026 <span className="text-white font-bold">HERAMA TOP-UP</span>.
            All rights reserved.
          </p>
          <p className="text-slate-500 text-[10px] sm:text-xs">
            Built with 💗 by{" "}
            <a href="https://www.instagram.com/ramma.dhanii" target="_blank">
              <span className="text-cyan-500 font-semibold">@ramma.dhanii</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
