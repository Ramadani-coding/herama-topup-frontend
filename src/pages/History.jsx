import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Tambahkan Link jika dibutuhkan
import { HiSearch, HiChatAlt2, HiClock } from "react-icons/hi";
import api from "../services/api";

const History = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // --- FUNGSI PEMETAAN STATUS (FIXED LOGIC) ---
  const renderStatusBadge = (status_pesanan, status_pembayaran) => {
    const s = status_pesanan?.toLowerCase() || "";
    const p = status_pembayaran?.toLowerCase() || "";

    // 1. SUKSES TOTAL (Paid & Success)
    if (p === "success" && (s === "sukses" || s === "success")) {
      return (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          Sukses
        </span>
      );
    }

    // 2. PROSES (Sudah bayar, tapi produk masih pending di sistem)
    if (p === "success" && s === "pending") {
      return (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          Proses
        </span>
      );
    }

    // 3. WAITING PAYMENT (Belum ada pembayaran masuk)
    if (p === "pending" && s === "pending") {
      return (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          Waiting Payment
        </span>
      );
    }

    // 4. CANCEL (Waktu habis & status masih pending)
    if ((p === "expire" || p === "expired") && s === "pending") {
      return (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          Cancel
        </span>
      );
    }

    // 5. GAGAL (Sudah bayar tapi transaksi ditolak/gagal sistem)
    if (p === "success" && s === "gagal") {
      return (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-red-500/10 text-red-500 border-red-500/20">
          Gagal
        </span>
      );
    }

    // Default Fallback
    return (
      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-slate-800 text-slate-500 border-slate-700">
        {s || "Unknown"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <div className="space-y-2 mb-8">
            <h1 className="text-white text-xl md:text-2xl font-black tracking-tight uppercase">
              Cari pesanan kamu!
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs">
              Lacak transaksi kamu dengan memasukkan Nomor Invoice dibawah ini:
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div className="space-y-2">
              <label className="text-white font-bold text-[10px] md:text-xs block uppercase tracking-widest opacity-70">
                Nomor Invoice Kamu
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
              className="px-6 py-2.5 bg-cyan-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Cari Transaksi
            </button>
          </form>
        </div>

        <div className="bg-[#161b22] rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c232d] text-slate-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest">
                  <th className="px-6 py-5">Tanggal</th>
                  <th className="px-6 py-5">Invoice</th>
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
                      className="hover:bg-slate-800/20 transition-colors group"
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
                        {renderStatusBadge(
                          tx.status_pesanan,
                          tx.status_pembayaran,
                        )}
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
  );
};

export default History;
