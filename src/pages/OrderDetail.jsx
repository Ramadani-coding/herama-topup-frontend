import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  HiLightningBolt,
  HiCheckCircle,
  HiShoppingCart,
  HiDocumentText,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import { RiWhatsappFill } from "react-icons/ri";
import api from "../services/api";

const OrderDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const idInputRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // State baru untuk Pembayaran
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null); // State untuk pesan gangguan produk

  const triggerConfirm = async () => {
    // 1. Validasi Produk
    if (!selectedProduct)
      return alert("Silakan pilih nominal produk terlebih dahulu!");

    // 2. Validasi Data Akun (ID & Server)
    if (!userId) return alert(`Masukkan ${getIdLabel()} anda!`);

    const needsServer =
      category.input_type === "ID_SERVER" ||
      category.input_type === "ID_SERVER_DROPDOWN";

    if (needsServer && !serverId)
      return alert("Silakan pilih atau masukkan Server anda!");

    // 3. Validasi Metode Pembayaran
    if (!selectedPayment) return alert("Silakan pilih metode pembayaran!");

    // 4. Validasi Informasi Kontak (WhatsApp)
    if (!whatsapp || whatsapp.length < 10) {
      return alert(
        "Silakan masukkan nomor WhatsApp yang valid untuk informasi kontak!",
      );
    }

    // --- JIKA SEMUA VALIDASI LOLOS, LANJUT KE PROSES NICKNAME ---

    const checkSku = category.check_sku; //

    if (!checkSku) {
      setConfirmationData({
        nickname: "N/A (Tidak mendukung cek ID)",
        userId,
        serverId,
        productName: selectedProduct.product_name,
        totalPrice: calculateFinalPrice(
          selectedProduct.price_sell,
          selectedPayment,
        ),
      });
      return setShowConfirm(true);
    }

    setIsChecking(true);
    try {
      const combinedId = serverId ? `${userId}${serverId}` : userId; //
      const response = await api.post("/payment/check-nickname", {
        sku_code: checkSku,
        customer_no: combinedId,
      });

      setConfirmationData({
        nickname: response.data.nickname, //
        userId,
        serverId,
        productName: selectedProduct.product_name,
        totalPrice: calculateFinalPrice(
          selectedProduct.price_sell,
          selectedPayment,
        ),
      });
      setShowConfirm(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memverifikasi ID anda.");
    } finally {
      setIsChecking(false);
    }
  };

  const paymentCategories = useMemo(
    () => [
      {
        name: "E-Wallet & QRIS",
        channels: [
          {
            id: "gopay", // Sesuai GoPay
            name: "Gopay",
            feeType: "percent",
            feeValue: 0.007,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/120px-Gopay_logo.svg.png?20251006142655",
          },
        ],
      },
      {
        name: "Virtual Accounts",
        channels: [
          {
            id: "bni_va", // Aktif di dashboard
            name: "BNI Virtual Account",
            feeType: "flat",
            feeValue: 4000,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg/250px-Bank_Negara_Indonesia_logo_%282004%29.svg.png?20250516061934",
          },
          {
            id: "bri_va", // Aktif di dashboard
            name: "BRI Virtual Account",
            feeType: "flat",
            feeValue: 4000,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/960px-BRI_2020.svg.png?20221123095928",
          },
          {
            id: "echannel", // ID Midtrans untuk Mandiri
            name: "Mandiri Virtual Account",
            feeType: "flat",
            feeValue: 4000,
            icon: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
          },
          {
            id: "cimb_va", // Aktif di dashboard
            name: "CIMB Niaga VA",
            feeType: "flat",
            feeValue: 4000,
            icon: "https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg",
          },
          {
            id: "permata_va", // Aktif di dashboard
            name: "Permata Virtual Account",
            feeType: "flat",
            feeValue: 4000,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/PermataBank_%282024%29_prototype_logo.svg/960px-PermataBank_%282024%29_prototype_logo.svg.png?20250607015706",
          },
        ],
      },
    ],
    [],
  );

  // Fungsi hitung total harga + fee
  const calculateFinalPrice = (basePrice, channelId) => {
    const allChannels = paymentCategories.flatMap((c) => c.channels);
    const channel = allChannels.find((c) => c.id === channelId);

    if (!channel) return basePrice;

    if (channel.feeType === "percent") {
      return Math.ceil(basePrice + basePrice * channel.feeValue);
    } else {
      return basePrice + channel.feeValue;
    }
  };

  const handleCheckout = async () => {
    // --- Validasi input tetap sama ---
    if (!selectedProduct) return alert("Pilih nominal produk terlebih dahulu!");
    if (!userId) return alert(`Masukkan ${getIdLabel()} anda!`);

    if (
      category.input_type !== "ID_ONLY" &&
      category.input_type !== "PHONE_NUMBER" &&
      !serverId
    ) {
      return alert("Silahkan pilih atau masukkan Server ID anda!");
    }

    if (!selectedPayment) return alert("Pilih metode pembayaran!");
    if (!whatsapp || whatsapp.length < 10)
      return alert("Masukkan nomor WhatsApp yang valid!");

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      const finalAmount = calculateFinalPrice(
        selectedProduct.price_sell,
        selectedPayment,
      );

      const combinedCustomerNo = serverId ? `${userId}${serverId}` : userId;

      const payload = {
        sku_code: selectedProduct.sku_code,
        customer_no: combinedCustomerNo,
        phone_number: whatsapp,
        payment_method: selectedPayment,
        amount: finalAmount,
      };

      const response = await api.post("/payment/checkout", payload);

      if (response.data.success) {
        const { snap_token, invoice } = response.data.data; // Pastikan invoice ID diambil dari sini

        window.snap.pay(snap_token, {
          // Callback jika pembayaran berhasil
          onSuccess: (result) => {
            window.location.replace(`/transaction/${invoice}`);
          },
          // Callback jika pembayaran tertunda (misal: sudah dapet kode VA/QRIS tapi belum bayar)
          onPending: (result) => {
            window.location.replace(`/transaction/${invoice}`);
          },
          // Callback jika terjadi error
          onError: (result) => {
            window.location.replace(`/transaction/${invoice}`);
          },
          // SOLUSI MOBILE: Jika user menutup Snap atau kembali dari aplikasi GoPay
          onClose: () => {
            // Menggunakan location.replace agar user tidak bisa 'back' ke halaman checkout yang sudah expired
            window.location.replace(`/transaction/${invoice}`);
          },
        });
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      setCheckoutError(
        err.response?.data?.message || "Gagal memproses pembayaran",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/public/categories/${slug}`);
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail kategori:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  // Logika Pengelompokan Produk dengan Filter Cek ID & E-Money
  const groupedProducts = useMemo(() => {
    if (!data?.products) return { membership: [], topup: [] };

    // 1. Daftar keyword untuk produk pengecekan (Game & E-Money)
    const checkKeywords = ["cek username", "cek nama pengguna", "cek nama"];

    const isCheckProduct = (p) =>
      checkKeywords.some((key) => p.product_name.toLowerCase().includes(key));

    // 2. Periksa apakah kategori ini memiliki produk riil selain pengecekan
    const hasRealProducts = data.products.some((p) => !isCheckProduct(p));

    // 3. Gunakan daftar yang sudah difilter jika ada produk riil
    const filteredList = hasRealProducts
      ? data.products.filter((p) => !isCheckProduct(p))
      : data.products;

    const membershipKeywords = [
      "membership",
      "pass",
      "member",
      "card",
      "starlight",
      "twilight",
      "blessing",
    ];

    // 4. Kelompokkan produk dari daftar yang sudah difilter
    const membership = filteredList.filter((item) =>
      membershipKeywords.some((key) =>
        item.product_name.toLowerCase().includes(key),
      ),
    );

    const topup = filteredList.filter(
      (item) =>
        !membershipKeywords.some((key) =>
          item.product_name.toLowerCase().includes(key),
        ),
    );

    return { membership, topup };
  }, [data]);

  // Premium Smooth Scroll
  const premiumScroll = (targetPosition, duration) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
    requestAnimationFrame(animation);
  };

  const handleProductSelect = (item) => {
    setSelectedProduct(item);
    setTimeout(() => {
      if (idInputRef.current) {
        const offset = 120;
        const elementPosition = idInputRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        premiumScroll(offsetPosition, 1000);
      }
    }, 200);
  };

  /**
   * FUNGSI HELPER: MENDAPATKAN LABEL ID SECARA EFEKTIF
   */
  const getIdLabel = () => {
    const type = category.input_type;
    const gameSlug = category.slug.toLowerCase();

    if (type === "ID_SERVER_DROPDOWN") return "UUID";
    if (type === "PHONE_NUMBER") return "nomor HP";
    if (gameSlug.includes("valorant")) return "Riot ID";
    if (gameSlug.includes("league-of-legends-wild-rift")) return "Riot ID";

    return "ID";
  };

  // Helper untuk input numerik (WhatsApp)
  const handleNumericInput = (value, setter) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setter(numericValue);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-cyan-500 font-bold text-sm">
        Memuat data...
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white text-sm">
        Produk tidak ditemukan.
      </div>
    );

  const { category } = data;

  /**
   * LOGIKA VALIDASI INPUT ID DINAMIS (UPDATED)
   */
  const handleIdChange = (e) => {
    const value = e.target.value;
    const type = category.input_type;
    const slug = category.slug.toLowerCase();

    // Tentukan apakah input ini harus angka saja
    // Angka saja jika: PHONE_NUMBER, ID_SERVER, atau (ID_ONLY dan bukan valorant)
    const isStrictlyNumeric =
      type === "PHONE_NUMBER" ||
      type === "ID_SERVER" ||
      type === "ID_SERVER_DROPDOWN" ||
      (type === "ID_ONLY" && !slug.includes("valorant"));

    if (isStrictlyNumeric) {
      // Hapus karakter non-angka jika harus numerik saja
      setUserId(value.replace(/[^0-9]/g, ""));
    } else {
      // Izinkan huruf untuk Valorant atau tipe ID lainnya
      setUserId(value);
    }
  };

  // Variabel bantuan untuk keyboard mobile (UPDATED)
  const isNumericMode =
    category.input_type === "PHONE_NUMBER" ||
    category.input_type === "ID_SERVER" ||
    category.input_type === "ID_SERVER_DROPDOWN" ||
    (category.input_type === "ID_ONLY" &&
      !category.slug.toLowerCase().includes("valorant"));

  return (
    <>
      <div className="min-h-screen bg-[#0b0e14] pt-20">
        <div className="max-w-7xl mx-auto px-4 pb-10">
          {/* HERO SECTION */}
          <div className="relative w-full h-44 md:h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={category.image_url}
              className="w-full h-full object-cover opacity-40 blur-sm"
              alt="banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <div className="flex items-center gap-5">
                <img
                  src={category.image_url}
                  className="w-20 h-20 md:w-32 md:h-32 rounded-2xl border-2 border-cyan-500/30 shadow-lg"
                  alt={category.name}
                />
                <div>
                  <h1 className="text-xl md:text-4xl font-bold text-white leading-tight mb-2">
                    {category.name}
                  </h1>
                  <span className="bg-slate-800/80 text-[10px] md:text-xs text-slate-300 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                    <HiLightningBolt className="text-cyan-400" /> Proses 1-60
                    detik
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* SIDEBAR: DESKRIPSI & PANDUAN */}
            <div className="lg:col-span-4 block">
              <div className="bg-[#161b22] border border-slate-800 p-6 rounded-3xl lg:sticky lg:top-24 space-y-6">
                <div className="flex flex-col space-y-2">
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <HiDocumentText className="text-cyan-500" /> Deskripsi dan
                    cara pembelian
                  </h2>
                  <div className="h-1 w-12 bg-cyan-500 rounded-full" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Top up {category.name} harga paling murah. Nikmati layanan
                  otomatis yang aktif 24 jam nonstop untuk kemudahan transaksi
                  anda.
                </p>

                <div className="pt-4 border-t border-slate-800/60">
                  <p className="text-white font-bold text-xs mb-3">
                    Langkah-langkah top up {category.name}:
                  </p>
                  <ul className="text-slate-400 text-[11px] space-y-4 leading-relaxed list-none p-0">
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">1.</span>
                      <span>
                        Pilih nominal item {category.name} yang anda inginkan.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">2.</span>
                      <span>
                        Masukkan {getIdLabel()}{" "}
                        {category.input_type !== "ID_ONLY" &&
                        category.input_type !== "PHONE_NUMBER"
                          ? "& server "
                          : ""}{" "}
                        anda dengan benar.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">3.</span>
                      <span>Pilih metode pembayaran yang tersedia.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">4.</span>
                      <span>
                        Masukkan nomor whatsapp{" "}
                        <span className="font-bold">AKTIF</span> dengan benar.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">5.</span>
                      <span>
                        Klik pesan sekarang dan selesaikan pembayaran.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* BAGIAN CATATAN BARU */}
                <div className="pt-5 border-t border-slate-800/60 space-y-4">
                  <div className="space-y-3">
                    <p className="text-white font-bold text-xs">Catatan :</p>
                    <ul className="space-y-3">
                      {/* <li className="flex gap-2 text-slate-400 text-[11px] leading-relaxed">
                      <span className="text-slate-600">•</span>
                      <span>
                        Bisa untuk semua region, baik Indonesia maupun luar
                        Indonesia.
                      </span>
                    </li> */}
                      <li className="flex gap-2 text-slate-400 text-[11px] leading-relaxed">
                        <span className="text-slate-600">•</span>
                        <span>
                          Pastikan{" "}
                          <span className="text-white font-bold">
                            {getIdLabel()}
                          </span>{" "}
                          yang dimasukkan{" "}
                          <span className="text-white font-bold uppercase">
                            benar
                          </span>
                          , karna jika salah dan sudah terproses ke akun orang
                          lain, maka menjadi bukan tanggung jawab kami.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Tautan Admin */}
                  <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-slate-400 text-[10px] leading-relaxed flex items-start gap-2">
                      <span className="text-yellow-500">⚠️</span>
                      <span>
                        Jika terdapat kendala, silahkan hubungi Admin di
                        Whatsapp resmi kami{" "}
                        <a
                          href="https://api.whatsapp.com/send?phone=6285750231336"
                          className="text-cyan-400 font-bold hover:underline decoration-cyan-400/30"
                        >
                          DISINI
                        </a>
                        .<span className="text-yellow-500 ml-1">⚠️</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM AREA */}
            <div className="lg:col-span-8 space-y-6 flex flex-col">
              {/* STEP 1: PILIH NOMINAL (GROUPED) */}
              <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                  <span className="bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    1
                  </span>
                  <h3 className="text-white font-bold text-sm">
                    Pilih nominal produk
                  </h3>
                </div>

                <div className="p-4 md:p-6 space-y-8">
                  {/* Membership Group */}
                  {groupedProducts.membership.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 ml-1">
                        <h4 className="text-white font-bold text-xs md:text-sm">
                          Membership
                        </h4>
                        <div className="flex-grow h-[1px] bg-slate-800/60" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {groupedProducts.membership.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleProductSelect(item)}
                            className={`relative p-3 md:p-4 rounded-2xl border transition-all text-left ${selectedProduct?.id === item.id ? "bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "bg-[#0b0e14] border-slate-800 hover:border-slate-700"}`}
                          >
                            <div className="text-[10px] sm:text-xs font-bold text-white mb-1 leading-snug">
                              {item.product_name}
                            </div>
                            <div className="text-cyan-400 font-bold text-xs">
                              Rp {item.price_sell.toLocaleString()}
                            </div>
                            {selectedProduct?.id === item.id && (
                              <HiCheckCircle
                                className="absolute top-2 right-2 text-cyan-500"
                                size={16}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Up Group */}
                  <div className="space-y-4">
                    {groupedProducts.membership.length > 0 && (
                      <div className="flex items-center gap-3 ml-1">
                        <h4 className="text-white font-bold text-xs md:text-sm">
                          Top up
                        </h4>
                        <div className="flex-grow h-[1px] bg-slate-800/60" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {groupedProducts.topup.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleProductSelect(item)}
                          className={`relative p-3 md:p-4 rounded-2xl border transition-all text-left ${selectedProduct?.id === item.id ? "bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "bg-[#0b0e14] border-slate-800 hover:border-slate-700"}`}
                        >
                          <div className="text-[10px] sm:text-xs font-bold text-white mb-1 leading-snug">
                            {item.product_name}
                          </div>
                          <div className="text-cyan-400 font-bold text-xs">
                            Rp {item.price_sell.toLocaleString()}
                          </div>
                          {selectedProduct?.id === item.id && (
                            <HiCheckCircle
                              className="absolute top-2 right-2 text-cyan-500"
                              size={16}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: DATA AKUN */}
              <div
                ref={idInputRef}
                className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                  <span className="bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    2
                  </span>
                  <h3 className="text-white font-bold text-sm">
                    Masukkan data akun anda
                  </h3>
                </div>

                <div
                  className={`p-6 grid gap-5 ${
                    // Grid 2 kolom HANYA jika membutuhkan server
                    category.input_type === "ID_SERVER" ||
                    category.input_type === "ID_SERVER_DROPDOWN"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase tracking-wider">
                      {getIdLabel()}
                    </label>
                    <input
                      type={isNumericMode ? "tel" : "text"}
                      inputMode={isNumericMode ? "numeric" : "text"}
                      placeholder={`Masukkan ${getIdLabel()}`}
                      className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                      value={userId}
                      onChange={handleIdChange}
                    />
                  </div>

                  {/* KOLOM SERVER: HANYA MUNCUL JIKA TIPENYA ID_SERVER / DROPDOWN */}
                  {(category.input_type === "ID_SERVER" ||
                    category.input_type === "ID_SERVER_DROPDOWN") && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold ml-1 uppercase tracking-wider">
                        Server
                      </label>

                      {category.input_type === "ID_SERVER_DROPDOWN" ? (
                        <div className="relative">
                          <select
                            className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer"
                            value={serverId}
                            onChange={(e) => setServerId(e.target.value)}
                          >
                            <option value="" disabled>
                              Pilih server
                            </option>
                            {category.server_list?.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <HiChevronDown
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                            size={18}
                          />
                        </div>
                      ) : (
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="Server"
                          className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                          value={serverId}
                          onChange={(e) =>
                            setServerId(e.target.value.replace(/[^0-9]/g, ""))
                          }
                        />
                      )}
                    </div>
                  )}

                  <p className="text-[10px] italic text-slate-500 ml-1">
                    {category.placeholder ? category.placeholder : ""}
                  </p>
                </div>
              </div>

              {/* STEP 3: PILIH PEMBAYARAN (BARU) */}
              <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                  <span className="bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    3
                  </span>
                  <h3 className="text-white font-bold text-sm">
                    Pilih metode pembayaran
                  </h3>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                  {paymentCategories.map((cat) => (
                    <div
                      key={cat.name}
                      className="border border-slate-800 rounded-2xl overflow-hidden"
                    >
                      {/* ... (button header category) */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0b0e14]/30">
                        {cat.channels.map((channel) => {
                          const totalForThisChannel = selectedProduct
                            ? calculateFinalPrice(
                                selectedProduct.price_sell,
                                channel.id,
                              )
                            : null;

                          return (
                            <button
                              key={channel.id}
                              onClick={() => setSelectedPayment(channel.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedPayment === channel.id ? "bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500" : "bg-[#161b22] border-slate-800"}`}
                            >
                              <div className="flex flex-col gap-1 items-start">
                                <div className="flex items-center gap-3">
                                  <div className="bg-white p-1 rounded-lg w-10 h-6 flex items-center justify-center">
                                    <img
                                      src={channel.icon}
                                      alt={channel.name}
                                      className="max-h-full"
                                    />
                                  </div>
                                  <span className="text-white font-bold text-[10px]">
                                    {channel.name}
                                  </span>
                                </div>
                                {/* Tampilkan Total Harga di bawah logo */}
                                {totalForThisChannel && (
                                  <span className="text-[9px] text-slate-400 mt-1">
                                    Total: Rp{" "}
                                    {totalForThisChannel.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {selectedPayment === channel.id && (
                                <HiCheckCircle
                                  className="text-cyan-500"
                                  size={16}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: NOMOR WHATSAPP */}
              <div className="bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                  <span className="bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    4
                  </span>
                  <h3 className="text-white font-bold text-sm">
                    Informasi kontak
                  </h3>
                </div>
                <div className="p-6 space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold ml-1">
                    Nomor whatsapp
                  </label>
                  <div className="relative">
                    <RiWhatsappFill
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                      size={20}
                    />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Contoh: 08123456789"
                      className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                      value={whatsapp}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, setWhatsapp)
                      }
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 ml-1">
                    Nomor ini akan dihubungi jika ada masalah.
                  </p>
                </div>
              </div>

              {/* ORDER BAR - STICKY BEHAVIOR */}
              <div
                className={`sticky bottom-4 z-[999] transition-all duration-700 transform mt-6 mb-4 ${
                  // Logika: Tampilkan hanya jika produk dipilih DAN modal konfirmasi sedang TUTUP
                  selectedProduct && !showConfirm
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <div className="bg-[#161b22]/95 border border-slate-700/50 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md mx-2 md:mx-0">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-slate-800 p-1 rounded-xl">
                      <img
                        src={category.image_url}
                        className="w-10 h-10 rounded-lg object-cover"
                        alt="selected"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-xs leading-tight">
                        {selectedProduct?.product_name || "Pilih produk..."}
                      </span>
                      <span className="text-slate-500 italic text-[10px] mt-0.5">
                        {selectedPayment
                          ? `Metode: ${paymentCategories.flatMap((c) => c.channels).find((ch) => ch.id === selectedPayment)?.name}`
                          : "Silahkan pilih metode pembayaran"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-500 text-[9px] font-medium">
                        Total pembayaran
                      </span>
                      <span className="text-cyan-400 font-black text-base">
                        Rp{" "}
                        {selectedProduct
                          ? calculateFinalPrice(
                              selectedProduct.price_sell,
                              selectedPayment,
                            ).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <button
                      onClick={triggerConfirm}
                      disabled={isChecking}
                      className={`${
                        isChecking
                          ? "bg-slate-600 cursor-not-allowed"
                          : "bg-cyan-500 hover:bg-cyan-600 active:scale-95"
                      } text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 border-none outline-none cursor-pointer`}
                    >
                      {isChecking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Mengecek ID...</span>
                        </>
                      ) : (
                        <>
                          <HiShoppingCart size={16} /> Pesan sekarang
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL KONFIRMASI PEMBELIAN */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="bg-[#161b22] border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
                  <HiDocumentText className="text-cyan-500 text-3xl" />
                </div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tight">
                  Detail Pesanan
                </h3>
                <p className="text-slate-500 text-[10px]">
                  Mohon periksa kembali detail pesanan Anda sebelum melanjutkan.
                </p>
              </div>

              {/* Data Detail (Tetap Dipertahankan) */}
              <div className="space-y-4 border-y border-slate-800/50 py-5">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    Nickname
                  </span>
                  {/* Perbaikan break-all untuk teks panjang */}
                  <span className="text-white font-black text-[11px] text-right leading-tight break-all max-w-[65%]">
                    {confirmationData.nickname}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    User ID
                  </span>
                  <span className="text-white font-black text-[11px]">
                    {confirmationData.userId}{" "}
                    {confirmationData.serverId &&
                      `(${confirmationData.serverId})`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    Produk
                  </span>
                  <span className="text-white font-black text-[11px] uppercase">
                    {confirmationData.productName}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-cyan-400 font-black text-lg">
                    Rp {confirmationData.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* PEMBERITAHUAN PENTING (Kuning/Amber) */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                <div className="bg-amber-500/20 p-1.5 rounded-lg shrink-0">
                  <HiLightningBolt className="text-amber-500" size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest italic">
                    Informasi Penting!
                  </p>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Setelah membayar, <b>JANGAN</b> me-refresh atau menutup
                    halaman ini hingga sistem berhasil mengalihkan Anda secara
                    otomatis ke detail transaksi. Jika terlanjur keluar, segera
                    catat/copy <b>Invoice ID</b> Anda sebelum membuka apliaksi
                    gopay untuk melacak status transaksi.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${
                    isProcessing
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-cyan-500 text-white shadow-cyan-500/20 active:scale-95 hover:bg-cyan-400"
                  }`}
                >
                  {isProcessing ? "Memproses..." : "Beli Sekarang!"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isProcessing}
                  className="w-full py-2 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
