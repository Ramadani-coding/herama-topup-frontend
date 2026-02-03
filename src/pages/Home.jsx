import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Popular from "../components/Popular";
import GameList from "../components/GameList";
import AnnouncementModal from "../components/AnnouncementModal";

const Home = () => {
  return (
    <>
      <AnnouncementModal />
      <Hero />
      <Popular />
      <GameList />
    </>
  );
};

export default Home;
