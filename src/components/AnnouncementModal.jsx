import React, { useState, useEffect } from "react";
import {
  HiX,
  HiSpeakerphone,
  HiShieldCheck,
  HiLightningBolt,
  HiCreditCard,
  HiChatAlt2,
} from "react-icons/hi";

const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const expiryTime = localStorage.getItem("announcement_expiry");
    const currentTime = new Date().getTime();

    if (!expiryTime || currentTime > parseInt(expiryTime)) {
      setIsOpen(true);
      if (expiryTime) localStorage.removeItem("announcement_expiry");
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    if (dontShowAgain) {
      const expiryDate = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("announcement_expiry", expiryDate.toString());
    }
  };

  if (!isOpen) return null;

  return (
    // Penambahan padding px-6 agar modal tidak menempel ke pinggir layar HP
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-6 bg-black/85 backdrop-blur-md">
      {/* max-w-sm untuk mobile agar lebih ramping, max-w-lg untuk desktop */}
      <div className="bg-[#161b22] border border-slate-800 w-full max-w-sm md:max-w-lg rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header Section - Padding diperkecil di mobile */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 md:p-8 flex flex-col items-center text-center relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <HiX size={20} />
          </button>
          <div className="bg-white/10 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-3xl mb-3 shadow-xl border border-white/10">
            <HiSpeakerphone
              className="text-white drop-shadow-md"
              size={28}
              md:size={38}
            />
          </div>
          <h2 className="text-white font-black text-lg md:text-2xl uppercase tracking-[0.15em] italic">
            Informasi Layanan
          </h2>
        </div>

        {/* Content Body - Menggunakan grid yang lebih kompak */}
        <div className="p-5 md:p-8 space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {/* 1. Metode Pembayaran */}
            <div className="flex gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="bg-cyan-500/10 p-2 rounded-lg shrink-0 flex items-center justify-center">
                <HiCreditCard className="text-cyan-400" size={18} />
              </div>
              <div>
                <p className="text-white font-black text-[10px] md:text-xs uppercase tracking-wider">
                  Metode Pembayaran
                </p>
                <p className="text-slate-400 text-[9px] md:text-[11px] leading-snug mt-0.5">
                  Tersedia{" "}
                  <b>
                    GoPay, DANA, <b>QRIS</b> & Virtual Account
                  </b>
                  .
                </p>
              </div>
            </div>

            {/* 2. Proses Otomatis */}
            <div className="flex gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0 flex items-center justify-center">
                <HiLightningBolt className="text-emerald-400" size={18} />
              </div>
              <div>
                <p className="text-white font-black text-[10px] md:text-xs uppercase tracking-wider">
                  Proses Otomatis
                </p>
                <p className="text-slate-400 text-[9px] md:text-[11px] leading-snug mt-0.5">
                  Top up diproses instan <b>1–3 detik</b> setelah pembayaran
                  berhasil.
                </p>
              </div>
            </div>

            {/* 3. Aman & Legal */}
            <div className="flex gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="bg-blue-500/10 p-2 rounded-lg shrink-0 flex items-center justify-center">
                <HiShieldCheck className="text-blue-400" size={18} />
              </div>
              <div>
                <p className="text-white font-black text-[10px] md:text-xs uppercase tracking-wider">
                  Aman & Legal
                </p>
                <p className="text-slate-400 text-[9px] md:text-[11px] leading-snug mt-0.5">
                  Sistem otomatis dan transaksi <b>100% aman & legal</b>.
                </p>
              </div>
            </div>

            {/* 4. Butuh Bantuan? */}
            <div className="flex gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-800/30 border border-slate-800/50">
              <div className="bg-orange-500/10 p-2 rounded-lg shrink-0 flex items-center justify-center">
                <HiChatAlt2 className="text-orange-400" size={18} />
              </div>
              <div>
                <p className="text-white font-black text-[10px] md:text-xs uppercase tracking-wider">
                  Butuh Bantuan?
                </p>
                <p className="text-slate-400 text-[9px] md:text-[11px] leading-snug mt-0.5">
                  Hubungi admin kami jika mengalami kendala.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="pt-2 md:pt-4 space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span className="text-slate-500 text-[9px] md:text-[11px] font-bold group-hover:text-slate-400 transition-colors">
                Jangan tampilkan lagi untuk hari ini
              </span>
            </label>

            <button
              onClick={closeModal}
              className="w-full py-3.5 md:py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-black text-[11px] md:text-sm uppercase tracking-[0.15em] rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
