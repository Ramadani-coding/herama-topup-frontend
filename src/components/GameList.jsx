import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const GameList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Top Up");

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await api.get("/public/categories");
        const rawData = response.data.data; // Sesuai struktur JSON kamu

        if (rawData && Array.isArray(rawData)) {
          setCategories(rawData);
        }
      } catch (error) {
        console.error("Gagal mengambil daftar game:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  /**
   * Logika Pemisahan Kategori Manual
   * Karena API tidak menyediakan field kategori, kita filter berdasarkan nama/slug
   */
  const filteredData = useMemo(() => {
    return categories.filter((item) => {
      const name = item.name.toLowerCase();

      // 1. Keyword khusus Voucher Game
      const voucherKeywords = [
        "voucher",
        "steam",
        "google play",
        "garena",
        "psn",
        "spotify",
        "unipin",
      ];

      // 2. Keyword khusus E-Money (Dompet Digital)
      const emoneyKeywords = ["dana", "ovo", "go pay", "shopeepay", "linkaja"];

      // 3. Keyword khusus Pulsa & Paket Data (Provider)
      const pulsaKeywords = [
        "indosat",
        "telkomsel",
        "im3",
        "xl",
        "axis",
        "tri",
        "smartfren",
        "pulsa",
      ];

      // Logika Filtering berdasarkan Tab aktif
      if (activeTab === "Voucher") {
        return voucherKeywords.some((key) => name.includes(key));
      }

      if (activeTab === "E-Money") {
        return emoneyKeywords.some((key) => name.includes(key));
      }

      if (activeTab === "Pulsa") {
        return pulsaKeywords.some((key) => name.includes(key));
      }

      // Default: Top Up (Game)
      // Mengembalikan produk yang BUKAN merupakan Voucher, E-Money, atau Pulsa
      return (
        !voucherKeywords.some((key) => name.includes(key)) &&
        !emoneyKeywords.some((key) => name.includes(key)) &&
        !pulsaKeywords.some((key) => name.includes(key))
      );
    });
  }, [categories, activeTab]);

  return (
    <section className="pb-20 bg-[#0b0e14]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col space-y-6">
        {/* TAB FILTER - Menambahkan E-Money */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Top Up", "Voucher", "E-Money", "Pulsa"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-bold transition-all outline-none border-none ${
                activeTab === tab
                  ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-800/40 text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID GAME LIST: Mobile 3 Kolom, Desktop 6 Kolom */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-5">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4.2] bg-slate-800/30 rounded-2xl animate-pulse"
                ></div>
              ))
            : filteredData.map((game) => (
                <Link
                  key={game.id}
                  to={`/order/${game.slug}`}
                  className="group relative block rounded-2xl transition-all duration-500 hover:scale-105 hover:ring-2 hover:ring-cyan-500 hover:ring-offset-4 hover:ring-offset-[#0b0e14] no-underline outline-none"
                >
                  <div className="relative aspect-[3/4.2] overflow-hidden rounded-2xl bg-[#161b22] border border-slate-800/40 shadow-lg">
                    {/* GAME POSTER */}
                    {game.image_url ? (
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-500 text-[10px] font-bold text-center p-2 uppercase italic">
                        No Image <br />{" "}
                        <span className="text-[8px] mt-1">{game.name}</span>
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex-col justify-end p-2 sm:p-4 
                      hidden sm:flex
                      lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-6 lg:group-hover:translate-y-0 
                      transition-all duration-500`}
                    >
                      <h3 className="!text-white font-black text-[8px] sm:text-[11px] tracking-tight leading-tight line-clamp-2 drop-shadow-lg group-hover:text-cyan-400 transition-colors">
                        {game.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Empty State jika kategori tidak ditemukan */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-xs italic">
              Belum ada produk untuk kategori {activeTab}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameList;
