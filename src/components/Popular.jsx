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
    <section className="pb-12 bg-[#0b0e14]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col space-y-6">
        {/* HEADER */}
        <div className="flex flex-col border-l-4 border-cyan-500 pl-3">
          <h1 className="uppercase font-black !text-white text-sm md:text-lg leading-tight tracking-wider">
            🔥 Populer Sekarang!
          </h1>
          <p className="text-slate-500 text-[9px] md:text-xs font-medium">
            Produk paling laris hari ini.
          </p>
        </div>

        {/* GRID: Mobile 2 Kolom, Desktop 3 Kolom */}
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-20 md:h-24 bg-slate-800/40 rounded-xl animate-pulse"
                ></div>
              ))
            : categories.map((game) => (
                <li key={game.id}>
                  <Link
                    to={`/order/${game.slug}`}
                    className="group flex items-center p-2 md:p-3 bg-[#161b22] border border-slate-800/60 rounded-xl md:rounded-2xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#1c232d] no-underline outline-none shadow-xl h-full"
                  >
                    {/* CONTAINER POSTER: Tetap Portrait 2:3 Anti-Gepeng */}
                    <div className="flex-shrink-0 w-12 sm:w-16 md:w-20 aspect-[2/3] overflow-hidden rounded-lg md:rounded-xl border border-slate-700/50 shadow-inner">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        // object-cover kunci utama anti-gepeng
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* INFO GAME: Teks responsif agar muat di grid 3 kolom */}
                    <div className="ml-2 md:ml-4 flex flex-col justify-center overflow-hidden flex-1">
                      <h2 className="!text-white font-black text-[9px] md:text-xs lg:text-sm uppercase tracking-tighter group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {game.name}
                      </h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 md:mt-2">
                        <span className="w-fit px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">
                          Online
                        </span>
                        <span className="text-slate-500 text-[7px] md:text-[8px] font-bold uppercase tracking-tighter hidden sm:block">
                          Otomatis
                        </span>
                      </div>
                    </div>

                    {/* AKSEN PANAH: Muncul di Tablet & Desktop */}
                    <div className="ml-auto hidden sm:flex">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 transition-all">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 border-t-2 border-r-2 border-slate-600 group-hover:border-cyan-500 rotate-45 -ml-0.5"></div>
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
