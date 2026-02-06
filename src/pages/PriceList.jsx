import React, { useState, useEffect } from "react";
import api from "../services/api";
import { HiTag, HiFilter, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/public/categories");
      if (response.data.success) setCategories(response.data.data);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params =
        selectedCategory !== "all" ? { category_id: selectedCategory } : {};
      const response = await api.get("/public/price-list", { params });

      if (response.data.success) {
        const allData = response.data.data;
        const checkKeywords = ["cek username", "cek nama pengguna", "cek nama"];
        const isCheckProduct = (p) =>
          checkKeywords.some((key) => p.varian.toLowerCase().includes(key));
        const hasRealProducts = allData.some((p) => !isCheckProduct(p));
        const filteredData = hasRealProducts
          ? allData.filter((p) => !isCheckProduct(p))
          : allData;

        const finalData = filteredData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));

        setProducts(finalData);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Gagal memuat daftar harga:", err);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3 italic">
              <HiTag className="text-cyan-500" /> Daftar Harga
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Informasi lengkap varian produk dan harga terbaru kami.
            </p>
          </div>

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

        {/* TABEL LIST HARGA - DESIGN RIWAYAT TRANSAKSI */}
        <div className="bg-[#161b22] rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide md:scrollbar-default">
            {/* min-w-max agar bisa digeser di mobile tanpa teks gepeng */}
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                {/* Header background solid seperti riwayat */}
                <tr className="bg-[#1c232d] text-slate-400 uppercase text-[9px] md:text-[10px] font-black tracking-widest">
                  <th className="px-6 py-5">No</th>
                  <th className="px-6 py-5">Produk</th>
                  <th className="px-6 py-5">Varian</th>
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
                      Memuat data harga...
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4 text-slate-500 text-[10px] md:text-xs font-medium">
                        {item.no}
                      </td>
                      {/* Produk Bold seperti Order ID */}
                      <td className="px-6 py-4 text-slate-200 text-[10px] md:text-xs font-bold whitespace-nowrap">
                        {item.produk}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[10px] md:text-xs font-medium whitespace-nowrap">
                        {item.varian}
                      </td>
                      {/* Harga font-black agar menonjol */}
                      <td className="px-6 py-4 text-white text-[10px] md:text-xs font-black text-right whitespace-nowrap">
                        Rp {item.harga?.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            item.status === "Aktif"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              : "bg-slate-500/10 text-slate-500 border-slate-800"
                          }`}
                        >
                          {item.status === "Aktif" ? "Aktif" : "Nonaktif"}
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
