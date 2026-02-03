import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiChatAlt2, HiClock } from "react-icons/hi";
import axios from "axios";
import api from "../services/api";

const History = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch data 10 transaksi terakhir saat halaman dimuat
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await api.get("/public/recent-transactions");
        if (response.data.success) {
          setRecentTransactions(response.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data transaksi terakhir", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (invoiceId.trim()) {
      navigate(`/transaction/${invoiceId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* FORM PENCARIAN (Sama seperti sebelumnya) */}
        <div className="max-w-xl mb-16">
          <div className="space-y-2 mb-8">
            <h1 className="text-white text-xl md:text-2xl font-black tracking-tight uppercase">
              Cari pesanan kamu!
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs">
              Lacak transaksi kamu dengan memasukkan Order ID dibawah ini:
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div className="space-y-2">
              <label className="text-white font-bold text-[10px] md:text-xs block uppercase tracking-widest opacity-70">
                Order ID Kamu
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value.toUpperCase())}
                  placeholder="Contoh: HRMXXXXXXXXXX"
                  className="w-full bg-[#161b22] border border-slate-800 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-all text-xs md:text-sm font-bold"
                  required
                />
                <HiSearch
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={18}
                />
              </div>
              <p className="text-slate-500 text-[9px] md:text-[10px] italic flex items-center gap-2">
                <HiChatAlt2 className="text-orange-500/70 shrink-0" size={14} />
                Jika lupa silahkan hubungi CS untuk bantuan
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl"
            >
              Cari Transaksi
            </button>
          </form>
        </div>

        {/* TABEL TRANSAKSI TERAKHIR */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <HiClock className="text-cyan-500" size={24} />
            <div>
              <h2 className="text-white font-black text-lg md:text-xl uppercase">
                Transaksi Terakhir
              </h2>
              <p className="text-slate-500 text-[10px] md:text-xs">
                Berikut adalah 10 transaksi terbaru di Herama Top-Up
              </p>
            </div>
          </div>

          <div className="bg-[#161b22] rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
            {/* Wrapper Scrollable untuk Mobile */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c232d] text-slate-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest">
                    <th className="px-6 py-5">Tanggal</th>
                    <th className="px-6 py-5">Order ID</th>
                    <th className="px-6 py-5">Produk</th>
                    <th className="px-6 py-5 text-right">Harga</th>
                    <th className="px-6 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-slate-500 text-xs italic"
                      >
                        Memuat transaksi...
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((tx, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4 text-slate-300 text-[10px] md:text-xs whitespace-nowrap">
                          {new Date(tx.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 font-bold text-orange-500 text-[10px] md:text-xs tracking-wider whitespace-nowrap">
                          {tx.order_id}
                        </td>
                        <td className="px-6 py-4 text-slate-200 text-[10px] md:text-xs font-bold whitespace-nowrap">
                          {tx.produk}
                        </td>
                        <td className="px-6 py-4 text-white text-[10px] md:text-xs font-black text-right whitespace-nowrap">
                          Rp {tx.harga.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                              tx.status === "sukses" || tx.status === "Success"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
