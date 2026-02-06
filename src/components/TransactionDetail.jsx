import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiClipboardCopy,
  HiClock,
  HiCheckCircle,
  HiInformationCircle,
  HiXCircle,
  HiCreditCard,
} from "react-icons/hi";
import api from "../services/api";
import { FaWhatsapp } from "react-icons/fa";

const TransactionDetail = () => {
  const { invoiceId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await api.get(`/public/transaction/${invoiceId}`);
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [invoiceId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Nomor Invoice berhasil disalin!");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b0e14] pt-32 text-center text-cyan-500 font-bold">
        Memuat detail transaksi...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen bg-[#0b0e14] pt-32 text-center text-white font-bold">
        Transaksi tidak ditemukan.
      </div>
    );

  const getDeadlineBanner = () => {
    const pStatus = data?.data?.payment_status; // Status Pembayaran (success, pending, expire)
    const tStatus = data?.data?.status; // Status Transaksi (sukses, pending, gagal)

    // 1. KONDISI SELESAI (PAID & SUKSES)
    if (pStatus === "success" && tStatus === "sukses") {
      return {
        title: "Pesanan Selesai",
        message:
          "Transaksi berhasil! Produk telah berhasil dikirim ke akun Anda. Terima kasih telah belanja.",
        colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        icon: <HiCheckCircle className="text-emerald-500 text-lg" />,
      };
    }

    // 2. KONDISI SEDANG DIPROSES (PAID & PENDING)
    if (pStatus === "success" && tStatus === "pending") {
      return {
        title: "Pembayaran Berhasil",
        message:
          "Terima kasih! Pesanan Anda sedang diproses oleh sistem. Mohon tunggu sebentar.",
        colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        icon: <HiCheckCircle className="text-emerald-500 text-lg" />,
      };
    }

    // 3. KONDISI EXPIRE (EXPIRE & PENDING)
    if (pStatus === "expire" && tStatus === "pending") {
      return {
        title: "Waktu Pembayaran Habis",
        message:
          "Transaksi ini telah kedaluwarsa karena batas waktu pembayaran habis. Silakan lakukan order ulang.",
        colorClass: "bg-slate-800/50 border-slate-700 text-slate-400",
        icon: <HiXCircle className="text-slate-500 text-lg" />,
      };
    }

    // 4. KONDISI MENUNGGU PEMBAYARAN (PENDING & PENDING)
    if (pStatus === "pending" && tStatus === "pending") {
      return {
        title: "Menunggu Pembayaran",
        message:
          "Segera selesaikan pembayaran Anda agar pesanan dapat langsung diproses otomatis oleh sistem.",
        colorClass: "bg-orange-500/10 border-orange-500/20 text-orange-500",
        icon: <HiClock className="text-orange-500 animate-pulse text-lg" />,
      };
    }

    // 5. KONDISI TRANSAKSI GAGAL (SUDAH BAYAR TAPI SISTEM GAGAL)
    if (pStatus === "success" && tStatus === "gagal") {
      return {
        title: "Transaksi Gagal",
        message:
          "Pembayaran terdeteksi namun produk gagal terkirim. Saldo Anda aman, silakan hubungi Admin.",
        colorClass: "bg-red-500/10 border-red-500/20 text-red-500",
        icon: <HiXCircle className="text-red-500 text-lg" />,
      };
    }

    // KONDISI DEFAULT
    return {
      title: "Detail Transaksi",
      message: "Informasi status pesanan Anda akan muncul di sini.",
      colorClass: "bg-slate-800/50 border-slate-700 text-slate-400",
      icon: <HiInformationCircle className="text-slate-500 text-lg" />,
    };
  };

  const banner = getDeadlineBanner();

  const handleRePay = () => {
    if (data?.data?.snap_token) {
      window.snap.pay(data.data.snap_token, {
        onSuccess: () => window.location.reload(),
        onPending: () => window.location.reload(),
        onError: () => window.location.reload(),
        onClose: () => console.log("Snap closed by user"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER ALERT */}
        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-4 rounded-r-xl">
          <p className="text-slate-300 text-xs md:text-sm italic">
            "Saldo akan masuk secara otomatis setelah pembayaran Anda
            terverifikasi berhasil oleh sistem."
          </p>
        </div>

        {/* INVOICE & TIMER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161b22] p-6 rounded-3xl border border-slate-800">
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
              Nomor Invoice
            </p>
            <div className="flex items-center gap-3">
              <h2 className="text-white font-black text-sm md:text-lg">
                {data.data.invoice_id}
              </h2>
              <button
                onClick={() => copyToClipboard(data.data.invoice_id)}
                className="text-cyan-500 hover:text-cyan-400"
              >
                <HiClipboardCopy size={20} />
              </button>
            </div>
          </div>
          {/* BANNER DINAMIS BERDASARKAN STATUS */}
          <div
            className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 transition-all duration-500 ${banner.colorClass}`}
          >
            {/* Icon dibuat lebih kecil */}
            <div className="shrink-0 scale-90">{banner.icon}</div>

            {/* Teks diubah menjadi rata kiri (text-left) dan ukuran lebih kompak */}
            <div className="text-left flex flex-col justify-center">
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-wider mb-0.5 opacity-80">
                {banner.title}
              </p>
              <p className="font-bold text-[9px] md:text-[10px] leading-tight leading-relaxed">
                {banner.message}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: DETAIL PRODUK & PEMBAYARAN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6">
              {/* HEADER: POSTER PRODUK */}
              <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
                <img
                  src={data.data.category_image}
                  // UKURAN BARU: w-20 di mobile, w-32 di desktop. Menggunakan rasio 2:3
                  className="w-20 md:w-32 aspect-[2/3] rounded-2xl object-cover border-2 border-slate-700/50 shadow-2xl flex-shrink-0"
                  alt="game"
                />
                <div>
                  <h3 className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter italic">
                    {data.data.category_name}
                  </h3>
                  <p className="text-cyan-400 text-sm md:text-lg font-black">
                    {data.data.product_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-500 text-[10px] font-bold mb-1">
                    Target Tujuan
                  </p>
                  <p className="text-white font-bold text-sm">
                    {data.data.customer_no}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Pesan
                </span>
                <p className="text-white font-black text-xs md:text-sm leading-relaxed break-all">
                  {data.data.sn || "-"}
                </p>
              </div>

              {/* KETERANGAN GAGAL */}
              {data?.data?.status === "gagal" &&
                data?.data?.payment_status === "success" && (
                  <div className="mb-6 pt-4 border-t border-slate-800/50">
                    <p className="text-slate-500 text-[10px] font-bold mb-1">
                      Keterangan
                    </p>
                    <p className="text-red-500 font-black text-sm">
                      Transaksi Gagal dari Sistem. Saldo Anda aman, silakan
                      hubungi Admin melalui WhatsApp untuk proses manual atau
                      refund.
                    </p>
                  </div>
                )}

              <div className="pt-6 border-t border-slate-800">
                <h4 className="text-white font-bold text-xs mb-4 flex items-center gap-2">
                  <HiInformationCircle className="text-cyan-500" /> Rincian
                  Pembayaran
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Harga Produk</span>
                    <span>Rp {data?.data?.price?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Biaya Layanan</span>
                    <span>Rp {data?.data?.fee?.toLocaleString() || "0"}</span>
                  </div>

                  <div className="flex justify-between text-sm text-white font-bold pt-3 border-t border-slate-800/50">
                    <span className="text-cyan-500 uppercase">Total Bayar</span>
                    <span className="text-xl">
                      Rp {data?.data?.total_price?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STATUS & QR CODE */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 space-y-6 text-center">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Metode Pembayaran
              </p>
              <p className="text-white font-black text-sm uppercase tracking-wider">
                {data.data.payment_method}
              </p>

              <div className="flex justify-center gap-4">
                {/* STATUS TRANSAKSI */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-slate-500 text-[9px] font-bold uppercase">
                    Status Transaksi
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${
                      // 1. PROSES (Sudah Bayar, Produk Antre)
                      data.data.payment_status === "success" &&
                      data.data.status === "pending"
                        ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        : // 2. CANCEL (Waktu Habis)
                          data.data.payment_status === "expire"
                          ? "bg-red-500/20 text-red-500"
                          : // 3. SUKSES (Produk Terkirim)
                            data.data.status === "sukses" ||
                              data.data.status === "success"
                            ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            : // 4. DEFAULT (PENDING)
                              "bg-orange-500/20 text-orange-500"
                    }`}
                  >
                    {data.data.payment_status === "success" &&
                    data.data.status === "pending"
                      ? "Proses"
                      : data.data.payment_status === "expire"
                        ? "Cancel"
                        : data.data.status}
                  </span>
                </div>

                {/* STATUS PEMBAYARAN */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-slate-500 text-[9px] font-bold uppercase">
                    Status Pembayaran
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${
                      // 1. PAID (Pembayaran Diterima)
                      data.data.payment_status === "success"
                        ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : // 2. EXPIRE (Waktu Habis)
                          data.data.payment_status === "expire"
                          ? "bg-red-500/20 text-red-500"
                          : // 3. WAITING PAYMENT (Belum Bayar)
                            "bg-slate-500/20 text-white"
                    }`}
                  >
                    {data.data.payment_status === "success"
                      ? "Paid"
                      : data.data.payment_status === "pending"
                        ? "Waiting Payment"
                        : "Expired"}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/50 flex flex-col w-full">
                <div className="w-full flex flex-col gap-3 mb-6">
                  {data?.data?.payment_status === "pending" && (
                    <button
                      onClick={handleRePay}
                      className="w-full py-3.5 rounded-2xl bg-cyan-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <HiCreditCard size={16} /> Bayar Sekarang
                    </button>
                  )}

                  <Link
                    to="/"
                    className="w-full py-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-slate-400 font-bold text-xs text-center hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>

                <div className="px-5 py-5 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-inner space-y-4">
                  <div className="flex gap-3 items-start">
                    <HiInformationCircle
                      className="text-orange-500/70 mt-1 shrink-0"
                      size={16}
                    />
                    <div className="flex flex-col gap-4 w-full">
                      <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed text-left">
                        <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">
                          Instruksi Pembayaran:
                        </span>
                        Silakan lakukan pembayaran sesuai instruksi pada
                        aplikasi e-wallet atau bank Anda. Jangan lupa untuk{" "}
                        <b>refresh halaman ini secara berkala</b> setelah
                        membayar.
                      </p>

                      <div className="border-t border-slate-800/40 pt-3">
                        <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed text-left mb-4">
                          <span className="text-cyan-500/80 font-bold uppercase text-[9px] block mb-0.5">
                            Butuh Bantuan?
                          </span>
                          Jika transaksi mengalami masalah, silakan{" "}
                          <b>salin nomor invoice</b> Anda dan hubungi layanan
                          pelanggan kami melalui tombol di bawah ini.
                        </p>

                        <div className="flex justify-start">
                          <a
                            href={`https://wa.me/6285750231336?text=Halo%20Admin%2C%20saya%20mengalami%20kendala%20pada%20transaksi%20dengan%20Nomor%20Invoice%3A%20${data?.data?.invoice_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
                          >
                            <FaWhatsapp size={14} /> Hubungi WhatsApp Admin
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
