import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import Pages
import Home from "./pages/Home";
import OrderDetail from "./pages/OrderDetail";
import TransactionDetail from "./components/TransactionDetail";
import History from "./pages/History";
import PriceList from "./pages/PriceList";
import ChatButton from "./components/ChatButton";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0b0e14]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order/:slug" element={<OrderDetail />} />
            <Route
              path="/transaction/:invoiceId"
              element={<TransactionDetail />}
            />
            <Route path="/history" element={<History />} />
            <Route path="/list-product" element={<PriceList />} />
          </Routes>
        </main>
        <ChatButton />
        {/* Footer akan selalu muncul di bawah */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
