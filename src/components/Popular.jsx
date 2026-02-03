import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Popular = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await api.get("/public/categories");
        const rawData = response.data.data; // Sesuai struktur JSON API

        if (rawData && Array.isArray(rawData)) {
          const filtered = rawData
            .filter((game) => {
              const name = game.name ? game.name.toLowerCase() : "";
              return (
                name.includes("mobile legends") ||
                name.includes("free fire") ||
                name.includes("genshin") ||
                name.includes("pubg mobile")
              );
            })
            .slice(0, 4); // Diambil 3 item agar pas dengan 3 kolom di desktop

          setCategories(filtered);
        }
      } catch (error) {
        console.error("Gagal mengambil data populer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <section className="pb-8 bg-[#0b0e14]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col space-y-4">
        {/* HEADER: Aksen Border Cyan */}
        <div className="flex flex-col border-l-4 border-cyan-500 pl-3">
          <h1 className="uppercase font-black !text-white text-base leading-tight tracking-wider">
            🔥 Populer Sekarang!
          </h1>
          <p className="text-slate-500 text-[10px] font-medium">
            Produk paling laris hari ini.
          </p>
        </div>

        {/* GRID: Mobile 2 Kolom, Desktop 3 Kolom */}
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-800/40 rounded-xl animate-pulse"
                ></div>
              ))
            : categories.map((game) => (
                <li key={game.id}>
                  <Link
                    to={`/order/${game.slug}`}
                    className="group flex items-center p-2 bg-[#161b22] border border-slate-800/60 rounded-xl transition-all duration-300 hover:border-cyan-500/40 no-underline outline-none"
                  >
                    {/* ICON: Kecil & Ramping */}
                    <div className="flex-shrink-0">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg ring-1 ring-slate-800 group-hover:ring-cyan-500/20 transition-all shadow-md"
                      />
                    </div>

                    {/* INFO: Teks Ringkas */}
                    <div className="ml-2 sm:ml-3 flex flex-col justify-center overflow-hidden">
                      <h2 className="!text-white font-bold text-[10px] sm:text-xs group-hover:text-cyan-400 transition-colors no-underline truncate">
                        {game.name}
                      </h2>
                      <p className="text-slate-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-tight mt-0.5 truncate">
                        Proses Otomatis
                      </p>
                    </div>

                    {/* MINI ARROW ACCENT */}
                    <div className="ml-auto hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/5 flex items-center justify-center">
                        <div className="w-1 h-1 border-t border-r border-cyan-500 rotate-45"></div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
};

export default Popular;
