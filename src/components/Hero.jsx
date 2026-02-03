import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const demoBanners = [
  {
    id: 1,
    title: "MOBILE LEGENDS",
    src: "https://zhlrdnzsgvxbvgvujgxn.supabase.co/storage/v1/object/public/game-assets/bener.jpg",
    href: "/order/mobile-legends",
  },
  {
    id: 2,
    title: "Free Fire",
    src: "https://zhlrdnzsgvxbvgvujgxn.supabase.co/storage/v1/object/public/game-assets/bener2.jpg",
    href: "/order/free-firee",
  },
];

const Hero = () => {
  return (
    /* mt-14 digunakan untuk memberikan ruang tepat di bawah fixed navbar h-14 */
    <section className="mt-14 pb-4 bg-[#0b0e14]">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800/40">
          <Carousel
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            emulateTouch={true}
            className="main-carousel"
          >
            {demoBanners.map((banner) => (
              <Link
                key={banner.id}
                to={banner.href}
                className="block outline-none no-underline"
              >
                <div className="relative h-44 sm:h-64 md:h-80 lg:h-[420px] w-full">
                  <img
                    src={banner.src}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                    <h2 className="!text-white font-black text-lg md:text-4xl italic uppercase tracking-tighter">
                      {banner.title}
                    </h2>
                    <p className="!text-cyan-400 text-[10px] md:text-sm font-bold tracking-widest mt-1 uppercase">
                      Top Up Tercepat & Aman 100%
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Hero;
