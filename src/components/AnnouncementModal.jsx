import React, { useState, useEffect } from "react";
import {
  HiX,
  HiSpeakerphone,
  HiDeviceMobile,
  HiDesktopComputer,
  HiChatAlt2,
} from "react-icons/hi";

const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mengecek apakah user sudah menutup pengumuman hari ini
    const hasSeen = localStorage.getItem("hasSeenAnnouncement");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    // Simpan status di localStorage agar tidak muncul lagi saat refresh
    localStorage.setItem("hasSeenAnnouncement", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header Image/Banner */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 flex flex-col items-center text-center relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <HiX size={24} />
          </button>
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <HiSpeakerphone className="text-white" size={40} />
          </div>
          <h2 className="text-white font-black text-xl uppercase tracking-widest">
            Informasi Layanan
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            {/* Payment Info */}
            <div className="flex gap-4 items-start">
              <div className="bg-cyan-500/10 p-2 rounded-xl shrink-0">
                <HiDeviceMobile className="text-cyan-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Pembayaran Mobile
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Saat ini tersedia via <b>Gopay</b> dan <b>Virtual Bank</b>.
                </p>
              </div>
            </div>

            {/* QRIS Info */}
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-500/10 p-2 rounded-xl shrink-0">
                <HiDesktopComputer className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Pengguna PC / Laptop
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Anda dapat melakukan pembayaran menggunakan <b>QRIS</b>{" "}
                  melalui layar monitor Anda.
                </p>
              </div>
            </div>

            {/* Support Info */}
            <div className="flex gap-4 items-start">
              <div className="bg-orange-500/10 p-2 rounded-xl shrink-0">
                <HiChatAlt2 className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Butuh Bantuan?</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Menemukan bug, kendala pembayaran, atau punya saran fitur?
                  Langsung hubungi Admin kami.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={closeModal}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            Saya Sudah Membaca
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
