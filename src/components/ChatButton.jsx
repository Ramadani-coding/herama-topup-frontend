import React from "react";
import { RiWhatsappFill } from "react-icons/ri";

const ChatButton = () => {
  // Nomor WhatsApp admin Anda
  const phoneNumber = "6285750231336";
  const message = "Halo Admin Herama Top-Up, saya butuh bantuan.";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-2"
    >
      {/* Label Tooltip (Muncul saat Hover di Desktop) */}
      <span className="hidden md:block bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
        Chat CS
      </span>

      {/* Main Button */}
      <div className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 md:p-4 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-90 flex items-center justify-center">
        <RiWhatsappFill size={28} className="md:w-8 md:h-8" />

        {/* Teks khusus untuk Mobile agar terlihat jelas */}
        <span className="md:hidden ml-2 font-bold text-sm">Chat CS</span>
      </div>

      {/* Efek Ping (Animasi Berdenyut agar Menarik Perhatian) */}
      <span className="absolute inset-0 rounded-2xl bg-emerald-500 animate-ping opacity-20 pointer-events-none"></span>
    </a>
  );
};

export default ChatButton;
