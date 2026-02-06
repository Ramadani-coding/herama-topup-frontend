import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineHome, HiMenuAlt3, HiX } from "react-icons/hi";
import { LuHistory } from "react-icons/lu";
import { CgSearch } from "react-icons/cg";
import api from "../services/api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop =
        searchRef.current && !searchRef.current.contains(event.target);
      const isOutsideMobile =
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await api.get(`/public/search?q=${searchQuery}`);
          setSearchResults(response.data.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Pencarian gagal:", error);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (slug) => {
    navigate(`/order/${slug}`);
    setShowResults(false);
    setSearchQuery("");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0b0e14] border-b border-slate-800/60 backdrop-blur-md h-16 md:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">
        {/* LOGO SECTION */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0 no-underline group py-2"
        >
          <img
            src="/herama-logo.png"
            alt="Herama Top-Up Logo"
            className="h-14 w-auto md:h-16 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]"
          />
        </Link>

        {/* DESKTOP NAV & SEARCH */}
        <div className="hidden md:flex items-center flex-1 justify-end gap-8">
          <div className="flex items-center h-14 gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 text-[11px] font-medium h-full border-b-2 transition-all no-underline ${
                isActive("/")
                  ? "border-cyan-400 !text-cyan-400"
                  : "border-transparent !text-white/60 hover:!text-white"
              }`}
            >
              <HiOutlineHome size={16} /> Beranda
            </Link>
            <Link
              to="/history"
              className={`flex items-center gap-2 text-[11px] font-medium h-full border-b-2 transition-all no-underline ${
                isActive("/history")
                  ? "border-cyan-400 !text-cyan-400"
                  : "border-transparent !text-white/60 hover:!text-white"
              }`}
            >
              <LuHistory size={16} /> Cek Transaksi
            </Link>
          </div>

          {/* DESKTOP SEARCH BOX */}
          <div className="relative w-full max-w-[250px]" ref={searchRef}>
            <CgSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="w-full bg-[#121720] border border-slate-700/50 py-1.5 pl-11 pr-4 rounded-full text-[11px] !text-white focus:outline-none focus:border-cyan-500/30 transition-all"
            />

            {showResults && (
              <div className="absolute top-full mt-2 w-[320px] right-0 bg-[#1a1f29] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 z-[60]">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleResultClick(game.slug)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-800/50 border-none text-left transition-colors"
                      >
                        {/* FIX GAMBAR DESKTOP: POSTER RATIO 2:3 */}
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-10 aspect-[2/3] rounded-md object-cover ring-1 ring-slate-700/50 flex-shrink-0"
                        />
                        <span className="text-[11px] font-bold !text-white leading-tight">
                          {game.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-8 flex flex-col items-center text-center">
                      <CgSearch className="text-slate-500 mb-2" size={24} />
                      <p className="text-[11px] font-bold !text-white">
                        Game tidak ditemukan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-1 text-cyan-400 bg-transparent border-none outline-none"
        >
          {isMenuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-x-0 top-14 bg-[#0b0e14] border-b border-slate-800 transition-all duration-300 md:hidden overflow-y-auto ${isMenuOpen ? "max-h-[85vh] opacity-100 shadow-2xl" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col p-5 gap-6">
          <div className="w-full space-y-3" ref={mobileSearchRef}>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center pointer-events-none">
                <CgSearch className="text-slate-500" size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari game favoritmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121720] border border-slate-700/50 py-2.5 pl-12 pr-4 rounded-full text-[11px] !text-white focus:outline-none focus:border-cyan-500/30"
              />
            </div>

            {showResults && (
              <div className="w-full bg-[#1a1f29] border border-slate-800 rounded-2xl overflow-hidden p-1">
                <div className="max-h-[300px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleResultClick(game.slug)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-800/50 active:bg-slate-800 border-none text-left"
                      >
                        {/* FIX GAMBAR MOBILE: POSTER RATIO 2:3 */}
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-9 aspect-[2/3] rounded-md object-cover ring-1 ring-slate-700/50 flex-shrink-0"
                        />
                        <span className="text-[11px] font-bold !text-white leading-tight">
                          {game.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[10px] text-slate-500 text-center">
                      Tidak ada hasil ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MENU LINKS MOBILE */}
          <div className="flex flex-col gap-5 pb-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 text-[12px] font-bold no-underline ${isActive("/") ? "!text-cyan-400" : "!text-white"}`}
            >
              <HiOutlineHome size={18} /> Home
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 text-[12px] font-bold no-underline ${isActive("/history") ? "!text-cyan-400" : "!text-white"}`}
            >
              <LuHistory size={18} /> Cek Transaksi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
