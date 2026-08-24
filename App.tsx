import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ShoppingBag,
  ArrowUpRight,
  X,
  Plus,
  Minus,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  creator: string;
  handle: string;
  image: string;
  category: string;
  tag?: string;
  size?: string;
}

interface CartItem extends Product { qty: number }

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Noir Ruffled Statement Piece",
    price: 340,
    creator: "Marcin Sajur",
    handle: "@msajur",
    image: "https://images.unsplash.com/photo-1759401909241-f554229ed260?w=700&h=900&fit=crop&auto=format",
    category: "Apparel",
    tag: "SOLD OUT SOON",
    size: "Limited — 18 left",
  },
  {
    id: 2,
    name: "Harness Archive Vol. 1",
    price: 480,
    creator: "Ali Choubin",
    handle: "@alichoubin",
    image: "https://images.unsplash.com/photo-1783543918700-dee295d5d1ac?w=700&h=900&fit=crop&auto=format",
    category: "Accessories",
    tag: "NEW DROP",
    size: "One size",
  },
  {
    id: 3,
    name: "Dual Silhouette Co-ord",
    price: 295,
    creator: "Ola Szkolda",
    handle: "@olaszkolda",
    image: "https://images.unsplash.com/photo-1779398968962-b3ad149b57b6?w=700&h=900&fit=crop&auto=format",
    category: "Apparel",
    size: "XS – L available",
  },
  {
    id: 4,
    name: "Volume Dusk Jacket",
    price: 620,
    creator: "David Bvnjo",
    handle: "@davidbvnjo",
    image: "https://images.unsplash.com/photo-1779912217680-b7b449e62237?w=700&h=900&fit=crop&auto=format",
    category: "Apparel",
    tag: "EXCLUSIVE",
    size: "S, M, L",
  },
  {
    id: 5,
    name: "Sequin Power Blazer",
    price: 520,
    creator: "Sammy Swae",
    handle: "@sammyswae",
    image: "https://images.unsplash.com/photo-1770062421988-7929b4748e29?w=700&h=900&fit=crop&auto=format",
    category: "Apparel",
    tag: "TRENDING",
    size: "XS – XL",
  },
  {
    id: 6,
    name: "Archive Skincare Ritual",
    price: 128,
    creator: "Ela De Pure",
    handle: "@eladepure",
    image: "https://images.unsplash.com/photo-1767360963892-3353defd6584?w=700&h=900&fit=crop&auto=format",
    category: "Beauty",
    size: "60ml",
  },
];

const CREATORS = [
  {
    name: "Marcin Sajur",
    handle: "@msajur",
    followers: "1.8M",
    drops: 6,
    category: "Dark Fashion",
    image: "https://images.unsplash.com/photo-1759401909241-f554229ed260?w=400&h=500&fit=crop&auto=format",
  },
  {
    name: "Sammy Swae",
    handle: "@sammyswae",
    followers: "3.2M",
    drops: 14,
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1770062422093-ae32c8fed2a3?w=400&h=500&fit=crop&auto=format",
  },
  {
    name: "David Bvnjo",
    handle: "@davidbvnjo",
    followers: "940K",
    drops: 4,
    category: "Avant-garde",
    image: "https://images.unsplash.com/photo-1779912217680-b7b449e62237?w=400&h=500&fit=crop&auto=format",
  },
  {
    name: "Ali Choubin",
    handle: "@alichoubin",
    followers: "2.1M",
    drops: 9,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1783543918700-dee295d5d1ac?w=400&h=500&fit=crop&auto=format",
  },
];

const TICKER = [
  "APPAREL", "★", "BEAUTY", "★", "ACCESSORIES", "★",
  "LIFESTYLE", "★", "STREETWEAR", "★", "CERAMICS", "★",
  "FRAGRANCE", "★", "HOMEWEAR", "★", "DIGITAL GOODS", "★",
  "APPAREL", "★", "BEAUTY", "★", "ACCESSORIES", "★",
  "LIFESTYLE", "★", "STREETWEAR", "★", "CERAMICS", "★",
  "FRAGRANCE", "★", "HOMEWEAR", "★", "DIGITAL GOODS", "★",
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SlideIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <span ref={ref} style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

function Cart({
  items,
  onClose,
  onRemove,
  onQty,
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onQty: (id: number, delta: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px] bg-[#0d0d0d] border-l border-white/8 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-white/8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#888880] uppercase mb-0.5">Your Bag</p>
            <p className="font-display text-lg font-semibold text-[#f0ece3]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#888880] hover:text-[#f0ece3] hover:border-white/30 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-60 gap-4 text-center">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <ShoppingBag size={24} strokeWidth={1} className="text-[#888880]" />
              </div>
              <div>
                <p className="text-sm text-[#f0ece3]">Your bag is empty</p>
                <p className="text-xs text-[#888880] mt-1">Discover creator drops below</p>
              </div>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-[72px] h-[88px] bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#c8f542] tracking-widest uppercase mb-1">{item.handle}</p>
                <p className="text-sm text-[#f0ece3] leading-snug font-medium">{item.name}</p>
                {item.size && <p className="text-[10px] text-[#888880] mt-1">{item.size}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-white/10">
                    <button onClick={() => onQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-[#888880] hover:text-[#f0ece3] transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-xs text-[#f0ece3]">{item.qty}</span>
                    <button onClick={() => onQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-[#888880] hover:text-[#f0ece3] transition-colors">
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="font-display text-sm font-bold text-[#f0ece3]">${item.price * item.qty}</span>
                </div>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-[#888880] hover:text-[#f0ece3] transition-colors self-start mt-0.5 flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-7 border-t border-white/8">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-[#888880] tracking-wide">Subtotal</span>
              <span className="font-display text-2xl font-black text-[#f0ece3]">${total}</span>
            </div>
            <p className="text-[10px] text-[#888880] mb-6">Shipping calculated at checkout</p>
            <button className="w-full bg-[#c8f542] text-[#080808] font-bold text-xs tracking-[0.25em] py-4 hover:bg-white transition-colors duration-300 uppercase mb-3">
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-[#888880] text-center leading-relaxed">
              Order routed directly to creator · Secure checkout
            </p>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const scrolled = useScrolled();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(8,8,8,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-display font-black text-[22px] text-[#f0ece3] tracking-tighter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            DRIP<span className="text-[#c8f542]">.</span>
          </motion.a>

          {/* Center nav */}
          <motion.nav
            className="hidden lg:flex items-center gap-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {["New Drops", "Creators", "Apparel", "Beauty", "Accessories"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] tracking-[0.2em] text-[#888880] hover:text-[#f0ece3] transition-colors duration-200 uppercase"
              >
                {item}
              </a>
            ))}
          </motion.nav>

          {/* Right actions */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#888880] hover:text-[#f0ece3] transition-colors"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={onCartOpen}
              className="relative text-[#f0ece3] hover:text-[#c8f542] transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#c8f542] text-[#080808] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <a
              href="#"
              className="hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-[#080808] bg-[#f0ece3] px-5 py-2.5 hover:bg-[#c8f542] transition-colors duration-250 uppercase font-bold"
            >
              Sell
            </a>
          </motion.div>
        </div>
      </motion.header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-md flex flex-col items-center justify-center px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-white/20 flex items-center gap-4 pb-4">
                <Search size={20} className="text-[#888880] flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search creators, products, categories..."
                  className="flex-1 bg-transparent text-2xl text-[#f0ece3] placeholder-[#444440] outline-none font-display"
                />
                <button onClick={() => setSearchOpen(false)} className="text-[#888880] hover:text-[#f0ece3]">
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-3 mt-6 flex-wrap">
                {["Apparel", "Beauty", "Accessories", "New Drops", "Trending"].map((tag) => (
                  <span key={tag} className="text-[10px] tracking-widest border border-white/15 text-[#888880] px-4 py-2 uppercase hover:border-[#c8f542] hover:text-[#c8f542] cursor-pointer transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onShopClick }: { onShopClick: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.45, 0.75]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* Full-bleed background */}
      <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
        <img
          src="https://images.unsplash.com/photo-1759401909241-f554229ed260?w=1800&h=1100&fit=crop&auto=format"
          alt="Fashion editorial"
          className="w-full h-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-[#080808]"
          style={{ opacity: overlayOpacity }}
        />
        {/* Left vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent" style={{ width: "50%" }} />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#080808] to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: titleY }}
        className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-10 max-w-[1440px] mx-auto"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8f542] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8f542]" />
          </span>
          <span className="text-[10px] tracking-[0.35em] text-[#c8f542] uppercase">32 Creators dropping today</span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display font-black leading-[0.87] tracking-[-0.02em] mb-8">
          <SlideIn delay={0.1}>
            <span className="text-[clamp(60px,11vw,180px)] text-[#f0ece3]">Culture</span>
          </SlideIn>
          <SlideIn delay={0.2}>
            <span className="text-[clamp(60px,11vw,180px)] italic text-[#c8f542]">is the</span>
          </SlideIn>
          <SlideIn delay={0.3}>
            <span className="text-[clamp(60px,11vw,180px)] text-[#f0ece3]">product.</span>
          </SlideIn>
        </h1>

        {/* Sub-row */}
        <Reveal delay={0.6} className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
          <p className="text-sm text-[#888880] leading-relaxed max-w-[280px]">
            Shop drops direct from the creators you follow.
            Every order ships from their hands to yours.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onShopClick}
              className="bg-[#c8f542] text-[#080808] text-[11px] font-bold tracking-[0.25em] px-7 py-3.5 hover:bg-white transition-colors duration-300 uppercase"
            >
              Explore Drops
            </button>
            <button className="border border-white/20 text-[#f0ece3] text-[11px] tracking-[0.2em] px-7 py-3.5 hover:border-white/50 transition-colors uppercase">
              Browse Creators
            </button>
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 right-8 flex flex-col items-center gap-2 text-[#888880]"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase" style={{ writingMode: "vertical-lr" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  return (
    <div className="border-y border-white/8 py-3.5 overflow-hidden bg-[#0a0a0a]">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 32s linear infinite" }}>
        {TICKER.map((item, i) => (
          <span
            key={i}
            className={`mx-6 text-[10px] tracking-[0.3em] uppercase ${item === "★" ? "text-[#c8f542]" : "text-[#555550]"}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Bento Grid ───────────────────────────────────────────────────────────────

function BentoGrid({ onAdd }: { onAdd: (p: Product) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-5 md:px-10 py-16 md:py-24 max-w-[1440px] mx-auto" id="drops">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#c8f542] uppercase mb-3">Current Drops</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-[#f0ece3] leading-none">
            <SlideIn>Fresh off the</SlideIn>
            <SlideIn delay={0.1}>
              <span className="italic">creator's hands.</span>
            </SlideIn>
          </h2>
        </div>
        <Reveal delay={0.3}>
          <a href="#" className="flex items-center gap-2 text-xs tracking-widest text-[#888880] hover:text-[#c8f542] transition-colors uppercase group">
            View all drops <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-12 grid-rows-[auto] gap-3 md:gap-4">

        {/* Cell 1 — large hero card */}
        <motion.div
          className="col-span-2 md:col-span-5 md:row-span-2 relative group cursor-pointer bg-[#111]"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0 }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <motion.img
              src={PRODUCTS[3].image}
              alt={PRODUCTS[3].name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {PRODUCTS[3].tag && (
              <div className="absolute top-4 left-4 bg-[#c8f542] text-[#080808] text-[9px] font-black tracking-[0.25em] px-2.5 py-1.5 uppercase">
                {PRODUCTS[3].tag}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[10px] text-[#c8f542] tracking-widest uppercase mb-1">{PRODUCTS[3].handle}</p>
              <p className="font-display text-xl font-bold text-[#f0ece3] leading-tight mb-1">{PRODUCTS[3].name}</p>
              <p className="text-[10px] text-[#888880] mb-4">{PRODUCTS[3].size}</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-black text-[#f0ece3]">${PRODUCTS[3].price}</span>
                <BentoAddBtn product={PRODUCTS[3]} onAdd={onAdd} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cell 2 — tall narrow */}
        <motion.div
          className="col-span-1 md:col-span-4 md:row-span-1 relative group cursor-pointer bg-[#111]"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <motion.img
              src={PRODUCTS[4].image}
              alt={PRODUCTS[4].name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            {PRODUCTS[4].tag && (
              <div className="absolute top-3 left-3 bg-[#c8f542] text-[#080808] text-[9px] font-black tracking-widest px-2 py-1 uppercase">
                {PRODUCTS[4].tag}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[9px] text-[#c8f542] tracking-widest uppercase mb-0.5">{PRODUCTS[4].handle}</p>
              <div className="flex items-end justify-between gap-2">
                <p className="font-display text-base font-bold text-[#f0ece3] leading-tight">{PRODUCTS[4].name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-display text-lg font-black text-[#f0ece3]">${PRODUCTS[4].price}</span>
                  <BentoAddBtn product={PRODUCTS[4]} onAdd={onAdd} small />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cell 3 — stat card */}
        <motion.div
          className="col-span-1 md:col-span-3 bg-[#c8f542] p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <p className="font-display text-5xl md:text-6xl font-black text-[#080808] leading-none">4.2K<span className="text-3xl">+</span></p>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#080808]/60 uppercase mb-1">Active Creators</p>
            <p className="text-sm font-medium text-[#080808] leading-snug">Selling exclusively through DRIP.</p>
          </div>
        </motion.div>

        {/* Cell 4 — medium card */}
        <motion.div
          className="col-span-1 md:col-span-4 relative group cursor-pointer bg-[#111]"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <motion.img
              src={PRODUCTS[2].image}
              alt={PRODUCTS[2].name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[9px] text-[#c8f542] tracking-widest uppercase mb-0.5">{PRODUCTS[2].handle}</p>
              <div className="flex items-end justify-between gap-2">
                <p className="font-display text-base font-bold text-[#f0ece3] leading-tight">{PRODUCTS[2].name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-display text-lg font-black text-[#f0ece3]">${PRODUCTS[2].price}</span>
                  <BentoAddBtn product={PRODUCTS[2]} onAdd={onAdd} small />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cell 5 — dark text card */}
        <motion.div
          className="col-span-1 md:col-span-3 bg-[#111] border border-white/8 p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <p className="text-[10px] tracking-[0.3em] text-[#888880] uppercase">Avg. Payout</p>
          <div>
            <p className="font-display text-5xl md:text-6xl font-black text-[#f0ece3] leading-none mb-2">82<span className="text-[#c8f542]">%</span></p>
            <p className="text-xs text-[#888880] leading-snug">Creators keep 82% of every sale. No hidden fees.</p>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-[10px] tracking-widest text-[#c8f542] uppercase mt-2 hover:gap-2.5 transition-all">
            Start selling <ArrowUpRight size={11} />
          </a>
        </motion.div>

        {/* Cell 6 — wide short */}
        <motion.div
          className="col-span-2 md:col-span-7 relative group cursor-pointer bg-[#111]"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "21/9" }}>
            <motion.img
              src={PRODUCTS[5].image}
              alt={PRODUCTS[5].name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center p-6 md:p-8">
              <p className="text-[9px] text-[#c8f542] tracking-widest uppercase mb-2">{PRODUCTS[5].handle}</p>
              <p className="font-display text-xl md:text-2xl font-bold text-[#f0ece3] leading-tight max-w-[200px] mb-3">{PRODUCTS[5].name}</p>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl font-black text-[#f0ece3]">${PRODUCTS[5].price}</span>
                <BentoAddBtn product={PRODUCTS[5]} onAdd={onAdd} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BentoAddBtn({ product, onAdd, small }: { product: Product; onAdd: (p: Product) => void; small?: boolean }) {
  const [added, setAdded] = useState(false);
  const handle = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  return (
    <button
      onClick={handle}
      className={`flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${
        small
          ? "w-8 h-8 border-white/20 hover:bg-[#c8f542] hover:border-[#c8f542] hover:text-[#080808] text-[#f0ece3]"
          : "gap-2 px-4 py-2.5 border-white/20 text-[11px] tracking-widest text-[#f0ece3] hover:bg-[#c8f542] hover:text-[#080808] hover:border-[#c8f542] uppercase"
      }`}
    >
      {added ? (
        <Check size={small ? 12 : 11} />
      ) : small ? (
        <Plus size={12} />
      ) : (
        <><Plus size={11} /> Add to Bag</>
      )}
    </button>
  );
}

// ─── Scrollytelling ───────────────────────────────────────────────────────────

function Scrollytell() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  const steps = [
    {
      label: "01 — DISCOVER",
      title: "Find your creator.",
      body: "Browse 4,200+ creators across fashion, beauty, lifestyle, and more. Each drop is curated — no factory flooding.",
      image: "https://images.unsplash.com/photo-1759393852314-59dc00faeed3?w=900&h=1100&fit=crop&auto=format",
      accent: "#c8f542",
    },
    {
      label: "02 — CHECKOUT",
      title: "Buy it. Instantly.",
      body: "Frictionless checkout in under 30 seconds. Your payment is secured and routed automatically to the creator.",
      image: "https://images.unsplash.com/photo-1664277497095-424e085175e8?w=900&h=1100&fit=crop&auto=format",
      accent: "#f0ece3",
    },
    {
      label: "03 — SHIPPED",
      title: "Creator packs. Creator ships.",
      body: "They handle fulfillment directly. No warehouse, no third party. It goes from their studio to your door.",
      image: "https://images.unsplash.com/photo-1785304968077-ec9663d51890?w=900&h=1100&fit=crop&auto=format",
      accent: "#c8f542",
    },
  ];

  const step0 = useTransform(scrollYProgress, [0, 0.33], [1, 0]);
  const step1a = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const step1b = useTransform(scrollYProgress, [0.55, 0.75], [1, 0]);
  const step2 = useTransform(scrollYProgress, [0.68, 0.88], [0, 1]);

  const img0Scale = useTransform(scrollYProgress, [0, 0.33], [1, 0.92]);
  const img1Scale = useTransform(scrollYProgress, [0.25, 0.55], [0.92, 1]);
  const img2Scale = useTransform(scrollYProgress, [0.68, 1], [0.92, 1]);

  return (
    <section ref={container} className="relative" style={{ height: "280vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-stretch">
        {/* Left text panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 relative z-10 bg-[#080808]">
          <p className="text-[10px] tracking-[0.35em] text-[#c8f542] uppercase mb-8">How It Works</p>

          {[step0, step1a, step2].map((opacity, i) => (
            <motion.div
              key={i}
              style={{ opacity, position: i === 0 ? "relative" : "absolute", top: i === 0 ? "auto" : "50%", transform: i === 0 ? "none" : "translateY(-50%)" }}
              className={i !== 0 ? "left-6 right-6 md:left-16 md:right-16" : ""}
            >
              <p className="text-[10px] tracking-[0.35em] text-[#555550] uppercase mb-5">{steps[i].label}</p>
              <h3 className="font-display text-4xl md:text-6xl font-black text-[#f0ece3] leading-none mb-6">
                {steps[i].title}
              </h3>
              <p className="text-sm text-[#888880] leading-relaxed max-w-sm">{steps[i].body}</p>
              <div className="mt-8 w-12 h-0.5 bg-[#c8f542]" />
            </motion.div>
          ))}

          <motion.div
            style={{
              opacity: step1b,
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "24px",
              right: "24px",
            }}
            className="md:left-16 md:right-16"
          >
            <p className="text-[10px] tracking-[0.35em] text-[#555550] uppercase mb-5">{steps[1].label}</p>
            <h3 className="font-display text-4xl md:text-6xl font-black text-[#f0ece3] leading-none mb-6">
              {steps[1].title}
            </h3>
            <p className="text-sm text-[#888880] leading-relaxed max-w-sm">{steps[1].body}</p>
            <div className="mt-8 w-12 h-0.5 bg-[#f0ece3]" />
          </motion.div>
        </div>

        {/* Right image panel */}
        <div className="hidden md:block w-1/2 relative bg-[#0d0d0d]">
          {[
            { opacity: step0, scale: img0Scale, i: 0 },
            { opacity: step1a, scale: img1Scale, i: 1 },
            { opacity: step2, scale: img2Scale, i: 2 },
          ].map(({ opacity, scale, i }) => (
            <motion.div
              key={i}
              style={{ opacity }}
              className="absolute inset-0"
            >
              <motion.img
                src={steps[i].image}
                alt={steps[i].label}
                style={{ scale }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080808]/20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Creators Section ─────────────────────────────────────────────────────────

function CreatorsSection() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-24 border-t border-white/8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-5">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-[#c8f542] uppercase mb-3">The Creators</p>
            <h2 className="font-display text-4xl md:text-6xl font-black text-[#f0ece3] leading-none">
              <SlideIn>People</SlideIn>
              <SlideIn delay={0.1}>
                <span className="italic">making things.</span>
              </SlideIn>
            </h2>
          </div>
          <Reveal>
            <a href="#" className="flex items-center gap-2 text-[11px] tracking-widest text-[#888880] hover:text-[#c8f542] transition-colors uppercase group">
              All Creators <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-end">
          {CREATORS.map((creator, i) => (
            <Reveal key={creator.handle} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div
                  className="relative overflow-hidden bg-[#111] mb-4"
                  style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/5" }}
                >
                  <motion.img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  >
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 bg-[#c8f542] text-[#080808] text-[10px] font-bold tracking-widest py-2.5 uppercase"
                    >
                      View Shop <ArrowUpRight size={11} />
                    </a>
                  </motion.div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-[#f0ece3] leading-snug">{creator.name}</p>
                    <p className="text-[10px] text-[#888880] mt-0.5">{creator.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-[#c8f542]">{creator.followers}</p>
                    <p className="text-[9px] text-[#888880] mt-0.5">{creator.drops} drops</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Strip ────────────────────────────────────────────────────────────

function GalleryStrip() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const row1 = [
    "https://images.unsplash.com/photo-1779912217680-b7b449e62237?w=500&h=650&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1770062421988-7929b4748e29?w=500&h=650&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1759401909241-f554229ed260?w=500&h=650&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1783543918700-dee295d5d1ac?w=500&h=650&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1779398968962-b3ad149b57b6?w=500&h=650&fit=crop&auto=format",
  ];
  const row2 = [
    "https://images.unsplash.com/photo-1770062422093-ae32c8fed2a3?w=500&h=380&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1786096715663-f0ad4f0e9ff0?w=500&h=380&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1767360963892-3353defd6584?w=500&h=380&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1777795530501-61f68a9c08b8?w=500&h=380&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1770062421988-7929b4748e29?w=500&h=380&fit=crop&auto=format",
  ];

  return (
    <section ref={ref} className="py-16 overflow-hidden border-t border-white/8 bg-[#0a0a0a]">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.35em] text-[#c8f542] uppercase text-center mb-8">Explore the aesthetic</p>
      </div>

      <motion.div style={{ x: x1 }} className="flex gap-4 mb-4 w-max">
        {[...row1, ...row1].map((src, i) => (
          <div key={i} className="w-[200px] md:w-[280px] h-[260px] md:h-[340px] flex-shrink-0 overflow-hidden bg-[#111]">
            <img src={src} alt="" className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </motion.div>

      <motion.div style={{ x: x2 }} className="flex gap-4 w-max ml-[-80px]">
        {[...row2, ...row2].map((src, i) => (
          <div key={i} className="w-[280px] md:w-[360px] h-[180px] md:h-[220px] flex-shrink-0 overflow-hidden bg-[#111]">
            <img src={src} alt="" className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Manifesto ────────────────────────────────────────────────────────────────

function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xL = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
  const xR = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  return (
    <section ref={ref} className="px-5 md:px-10 py-20 md:py-32 border-t border-white/8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-0 text-center">
          {[
            { text: "The best products", dir: xL, italic: false },
            { text: "don't come from", dir: xR, italic: false },
            { text: "corporations —", dir: xL, italic: false },
            { text: "they come from", dir: xR, italic: false },
            { text: "people.", dir: xL, italic: true },
          ].map(({ text, dir, italic }) => (
            <motion.p
              key={text}
              style={{ x: dir }}
              className={`font-display font-black leading-[0.88] tracking-tighter text-[clamp(38px,7vw,110px)] ${italic ? "italic text-[#c8f542]" : "text-[#f0ece3]"}`}
            >
              {text}
            </motion.p>
          ))}
        </div>
        <Reveal delay={0.3} className="text-center mt-12">
          <p className="text-sm text-[#888880] max-w-md mx-auto leading-relaxed">
            DRIP. connects you to the minds behind the movement.
            No middlemen. No brand dilution. Just culture, direct.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Sell Banner ──────────────────────────────────────────────────────────────

function SellBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-5 md:px-10 py-16 border-t border-white/8">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-[#c8f542]"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?w=1400&h=600&fit=crop&auto=format')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "multiply",
          }} />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-lg">
              <p className="text-[10px] tracking-[0.35em] text-[#080808]/50 uppercase mb-4">For Creators</p>
              <h2 className="font-display text-4xl md:text-6xl font-black text-[#080808] leading-none">
                Ready to drop<br />
                <span className="italic">your world?</span>
              </h2>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { val: "82%", label: "Revenue share" },
                  { val: "$0", label: "Listing fee" },
                  { val: "24h", label: "Avg. payout" },
                  { val: "4.2K+", label: "Creator community" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-black text-[#080808]">{s.val}</p>
                    <p className="text-[10px] text-[#080808]/60 tracking-widest uppercase mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="flex items-center gap-2 bg-[#080808] text-[#f0ece3] text-[11px] font-bold tracking-[0.25em] px-8 py-4 hover:bg-[#f0ece3] hover:text-[#080808] transition-colors duration-300 uppercase w-fit"
              >
                Apply to sell <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-5 md:px-10 pt-16 pb-10 border-t border-white/8 bg-[#060606]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-2">
            <p className="font-display text-4xl font-black text-[#f0ece3] mb-4">
              DRIP<span className="text-[#c8f542]">.</span>
            </p>
            <p className="text-xs text-[#888880] leading-relaxed max-w-[220px]">
              The creator marketplace where culture is the product and fans are the customers.
            </p>
          </div>

          {[
            { title: "Shop", links: ["New Drops", "Apparel", "Beauty", "Accessories", "Lifestyle", "All Products"] },
            { title: "Creators", links: ["Browse Creators", "Apply to Sell", "Creator Portal", "Payouts", "Guidelines"] },
            { title: "Company", links: ["About DRIP.", "Blog", "Press Kit", "Sustainability", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[9px] tracking-[0.35em] text-[#888880] uppercase mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#f0ece3]/50 hover:text-[#f0ece3] transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[11px] text-[#888880]">© 2026 DRIP. Inc. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap">
            {["Privacy Policy", "Terms of Service", "Cookie Preferences", "Accessibility"].map((l) => (
              <a key={l} href="#" className="text-[11px] text-[#888880] hover:text-[#f0ece3] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const dropsRef = useRef<HTMLDivElement>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const adjustQty = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="bg-[#080808] text-[#f0ece3] min-h-screen" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero onShopClick={() => dropsRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <Ticker />
      <div ref={dropsRef}>
        <BentoGrid onAdd={addToCart} />
      </div>
      <Scrollytell />
      <CreatorsSection />
      <GalleryStrip />
      <Manifesto />
      <SellBanner />
      <Footer />

      <AnimatePresence>
        {cartOpen && (
          <Cart
            items={cart}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onQty={adjustQty}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
