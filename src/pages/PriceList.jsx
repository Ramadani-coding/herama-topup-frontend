import React, { useState, useEffect } from "react";
import api from "../services/api"; // Menggunakan service api.js Anda
import {
  HiTag,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
} from "react-icons/hi";

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      // Sesuaikan endpoint categories jika sudah ada, atau gunakan list manual sementara
      const response = await api.get("/public/categories");
      if (response.data.success) setCategories(response.data.data);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Mengambil data dari endpoint price-list
      const params =
        selectedCategory !== "all" ? { category_id: selectedCategory } : {};
      const response = await api.get("/public/price-list", { params });

      if (response.data.success) {
        const allData = response.data.data;

        // 1. Daftar keyword untuk produk pengecekan (Game & E-Money)
        const checkKeywords = ["cek username", "cek nama pengguna", "cek nama"];

        const isCheckProduct = (p) =>
          checkKeywords.some((key) => p.varian.toLowerCase().includes(key));

        // 2. Deteksi apakah ada produk riil (Top Up/Membership) di dalam data
        const hasRealProducts = allData.some((p) => !isCheckProduct(p));

        // 3. Filter: Sembunyikan produk "Cek" jika ada produk riil
        const filteredData = hasRealProducts
          ? allData.filter((p) => !isCheckProduct(p))
          : allData;

        // 4. Reset Nomor Urut agar tetap berurutan (1, 2, 3...)
        const finalData = filteredData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));

        setProducts(finalData);
        setCurrentPage(1); // Reset ke halaman pertama setiap kali filter berubah
      }
    } catch (err) {
      console.error("Gagal memuat daftar harga:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0b0e14] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER & FILTER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <HiTag className="text-cyan-500" /> Daftar Harga
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Informasi lengkap varian produk dan harga terbaru kami.
            </p>
          </div>

          {/* DROPDOWN FILTER */}
          <div className="w-full md:w-64 space-y-2">
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <HiFilter size={14} /> Filter Produk
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#161b22] border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-xs font-bold appearance-none cursor-pointer"
            >
              <option value="all">Semua Produk</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABEL LIST HARGA - Optimasi Responsif */}
        <div className="bg-[#161b22]/40 rounded-2xl md:rounded-[2rem] border border-slate-800/60 overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c232d]/60 text-slate-500 uppercase text-[8px] md:text-[10px] font-black tracking-widest">
                  {/* Padding diperkecil di mobile (px-4 vs px-8) */}
                  <th className="px-4 md:px-8 py-4 md:py-6">No</th>
                  <th className="px-4 md:px-8 py-4 md:py-6">Produk</th>
                  <th className="px-4 md:px-8 py-4 md:py-6">Varian</th>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-right">
                    Harga
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-6 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-slate-500 text-[10px] animate-pulse"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-cyan-500/5 transition-all group"
                    >
                      <td className="px-4 md:px-8 py-3 md:py-5 text-slate-600 text-[9px] md:text-xs font-medium">
                        {item.no}
                      </td>
                      {/* Font diperkecil ke text-[10px] di mobile agar tidak gampang wrap */}
                      <td className="px-4 md:px-8 py-3 md:py-5 text-slate-300 text-[10px] md:text-xs font-bold leading-tight">
                        {item.produk}
                      </td>
                      <td className="px-4 md:px-8 py-3 md:py-5 text-slate-400 text-[10px] md:text-xs font-medium leading-tight">
                        {item.varian}
                      </td>
                      {/* Harga lebih kompak */}
                      <td className="px-4 md:px-8 py-3 md:py-5 text-cyan-400 text-xs md:text-sm font-black text-right whitespace-nowrap">
                        Rp {item.harga?.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 md:px-8 py-3 md:py-5 text-center">
                        <span
                          className={
                            item.status === "Aktif"
                              ? "px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[7px] md:text-[9px] font-black uppercase rounded-md md:rounded-lg"
                              : "px-2 md:px-3 py-0.5 md:py-1 bg-slate-500/10 border border-slate-500/20 text-white text-[7px] md:text-[9px] font-black uppercase rounded-md md:rounded-lg"
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION CONTROLS */}
        {products.length > itemsPerPage && (
          <div className="mt-8 flex items-center justify-between bg-[#161b22] p-4 rounded-2xl border border-slate-800/50">
            <p className="text-slate-500 text-[10px] md:text-xs">
              Menampilkan{" "}
              <span className="text-white font-bold">
                {indexOfFirstItem + 1}
              </span>{" "}
              -{" "}
              <span className="text-white font-bold">
                {Math.min(indexOfLastItem, products.length)}
              </span>{" "}
              dari{" "}
              <span className="text-white font-bold">{products.length}</span>{" "}
              produk
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 bg-slate-800 rounded-lg text-white disabled:opacity-30 hover:bg-cyan-500 transition-colors"
              >
                <HiChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 bg-slate-800 rounded-lg text-white disabled:opacity-30 hover:bg-cyan-500 transition-colors"
              >
                <HiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceList;
