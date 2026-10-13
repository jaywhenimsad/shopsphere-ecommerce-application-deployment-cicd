import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, UserRound, Heart, Menu, Plus, Minus, Trash2, ArrowRight, PackageCheck, Truck, ShieldCheck, Headphones } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ASSET_BASE = (import.meta.env.VITE_ASSET_BASE_URL || "/assets").replace(/\/$/, "");
const asset = (path) => `${ASSET_BASE}/${path.replace(/^\//, "")}`;
const categories = [
  { name: "All", image: null },
  { name: "Electronics", image: "icons/electronics.svg" },
  { name: "Fashion", image: "icons/fashion.svg" },
  { name: "Home", label: "Home & Living", image: "icons/home.svg" },
  { name: "Beauty", image: "icons/beauty.svg" },
  { name: "Sports", image: "icons/sports.svg" },
  { name: "Toys", image: "icons/toys.svg" },
  { name: "Books", image: "icons/books.svg" }
];
const fallbackProducts = [
  { _id: "p1", name: "Wireless Headphones", category: "Electronics", price: 79.99, stock: 25, image: "products/wireless-headphones.svg", description: "Immersive audio for work and travel." },
  { _id: "p2", name: "Smart Watch", category: "Electronics", price: 149.99, stock: 15, image: "products/smart-watch.svg", description: "A smart companion for every day." },
  { _id: "p3", name: "Running Shoes", category: "Fashion", price: 59.99, stock: 20, image: "products/running-shoes.svg", description: "Lightweight comfort for your daily run." },
  { _id: "p4", name: "Travel Backpack", category: "Accessories", price: 39.99, stock: 30, image: "products/travel-backpack.svg", description: "Carry your essentials in style." },
  { _id: "p5", name: "Smartphone", category: "Electronics", price: 699.99, stock: 12, image: "products/smartphone.svg", description: "A modern phone with a vivid display." }
];
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/products`)
      .then((r) => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .then((data) => { if (active) { setProducts(data.products || []); setApiError(false); } })
      .catch(() => { if (active) { setProducts(fallbackProducts); setApiError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const matchCategory = category === "All" || p.category === category || (category === "Home" && p.category === "Home & Living");
    return matchCategory && p.name.toLowerCase().includes(search.trim().toLowerCase());
  }), [products, category, search]);
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  const total = cart.reduce((n, item) => n + item.price * item.quantity, 0);

  function add(p) {
    if (p.stock <= 0) return;
    setCart((old) => {
      const exists = old.find((x) => x._id === p._id);
      if (!exists) return [...old, { ...p, quantity: 1 }];
      return old.map((x) => x._id === p._id ? { ...x, quantity: Math.min(x.quantity + 1, x.stock) } : x);
    });
    setNotice(`${p.name} added to your cart`);
    window.setTimeout(() => setNotice(""), 2200);
  }
  function quantity(id, delta) {
    setCart((old) => old.map((x) => x._id === id ? { ...x, quantity: Math.min(x.stock, x.quantity + delta) } : x).filter((x) => x.quantity > 0));
  }

  return <div className="site-shell">
    <div className="announcement">A little something for your everyday <span>— free shipping on orders over $50</span></div>
    <header className="header">
      <a className="logo" href="#" aria-label="ShopSphere home"><span className="logo-mark"><ShoppingCart size={23}/></span><span>Shop<span className="logo-blue">Sphere</span><small>EVERYDAY DISCOVERIES</small></span></a>
      <div className="search"><Search size={19}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for products..." aria-label="Search products"/><kbd>⌘ K</kbd></div>
      <nav className="header-actions">
        <button className="icon-action" aria-label="Account" onClick={() => setNotice("Account features are coming in a future version.")}><UserRound/><span>Account</span></button>
        <button className="icon-action" aria-label="Wishlist" onClick={() => setNotice("Wishlist is coming soon.")}><Heart/><span>Wishlist</span></button>
        <button className="icon-action cart-action" onClick={() => setCartOpen(!cartOpen)} aria-label="Toggle shopping cart"><ShoppingCart/><span>Cart</span><b>{count}</b></button>
      </nav>
    </header>
    <nav className="category-nav"><button className="mobile-menu" aria-label="Menu"><Menu size={18}/></button><a href="#home">Home</a><a href="#products">Shop</a><a href="#categories">Categories⌄</a><a href="#story">Our story</a><a href="#footer">Contact</a><span className="nav-spacer"/><span className="nav-note"><Truck size={16}/> Thoughtful finds, delivered</span></nav>

    <main>
      <section className="hero" id="home" style={{ backgroundImage: `url("${asset("banners/hero-banner.svg")}")` }}>
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot"/> THE NEW SEASON EDIT</span><h1>Make room for<br/><em>better things.</em></h1><p>Useful little upgrades, big everyday favorites, and finds worth sharing — all in one place.</p><a href="#products" className="primary-button">Explore the collection <ArrowRight size={17}/></a><div className="hero-trust"><span><ShieldCheck size={16}/> Easy, secure shopping</span><span><PackageCheck size={16}/> Carefully selected finds</span></div></div>
        <div className="hero-badge"><span>THE GOOD<br/>FINDS CLUB</span><strong>01</strong></div>
      </section>

      <section className="benefits"><div><span className="benefit-icon"><Truck/></span><span><strong>Free shipping</strong><small>On orders over $50</small></span></div><div><span className="benefit-icon"><ShieldCheck/></span><span><strong>Secure checkout</strong><small>Your details stay protected</small></span></div><div><span className="benefit-icon"><Headphones/></span><span><strong>Here to help</strong><small>Friendly customer support</small></span></div><div><span className="benefit-icon"><PackageCheck/></span><span><strong>Easy returns</strong><small>Shopping made simple</small></span></div></section>

      <section className="category-section" id="categories"><div className="section-title"><div><span className="eyebrow">A WORLD OF GOOD THINGS</span><h2>What are you in the mood for?</h2></div><span className="subtle">Find your next favorite</span></div><div className="category-grid">{categories.filter(c => c.name !== "All").map((c) => <button className={`category-tile ${category === c.name ? "selected" : ""}`} key={c.name} onClick={() => { setCategory(c.name); document.getElementById("products").scrollIntoView({ behavior: "smooth" }); }}><img src={asset(c.image)} alt=""/><span>{c.label || c.name}</span><ArrowRight size={15}/></button>)}</div></section>

      <section className="products-section" id="products"><div className="section-title"><div><span className="eyebrow">GOOD THINGS, GREAT PICKS</span><h2>Meet your new favorites</h2><p className="section-description">A few things we think you'll love.</p></div><button className="text-link" onClick={() => { setCategory("All"); setSearch(""); }}>View all products <ArrowRight size={16}/></button></div>
        <div className="filters"><div className="filter-tabs">{["All","Electronics","Fashion","Accessories","Home"].map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? "filter active" : "filter"}>{c}</button>)}</div><span className="result-count">{loading ? "Finding good things..." : `${filtered.length} thoughtfully picked items`}</span></div>
        {apiError && <div className="api-notice">Showing demo products because the API is not available yet; start the backend to load products from MongoDB.</div>}
        <div className="product-grid">{filtered.map((p, i) => <article className="product-card" key={p._id}><div className="product-art"><img src={p.image.startsWith("http") ? p.image : asset(p.image)} alt={p.name}/>{i === 0 && <span className="product-tag">CUSTOMER FAVORITE</span>}<button className="wish-button" aria-label={`Save ${p.name}`} onClick={() => setNotice("Wishlist is coming soon.")}><Heart size={17}/></button></div><div className="product-detail"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="rating"><span>★★★★★</span><small>Curated pick</small></div><div className="product-bottom"><strong>{money(p.price)}</strong><button className="add-button" disabled={p.stock <= 0} onClick={() => add(p)}><Plus size={16}/><span>Add to cart</span></button></div></div></article>)}</div>
        {!loading && filtered.length === 0 && <div className="empty-state"><Search size={28}/><h3>No matches just yet</h3><p>Try a different search or browse all products.</p><button className="primary-button" onClick={() => { setSearch(""); setCategory("All"); }}>Show all products</button></div>}
      </section>

      <section className="promo" id="story" style={{ backgroundImage: `url("${asset("banners/promo-banner.svg")}")` }}><div><span className="eyebrow">A SMALL NUDGE TO TREAT YOURSELF</span><h2>Good things are<br/>closer than you think.</h2><p>Explore useful finds for your space, your style, and your everyday.</p><a href="#products" className="primary-button">Find your favorite <ArrowRight size={17}/></a></div></section>
      <section className="newsletter"><div><span className="eyebrow">LETTERS FROM THE GOOD FINDS CLUB</span><h2>A little good in your inbox.</h2><p>New arrivals, thoughtful picks, and occasional treats. No noise.</p></div><form onSubmit={(e) => { e.preventDefault(); setNotice("Thanks for your interest! Newsletter signup will be connected to the backend later."); }}><input type="email" required placeholder="Your email address" aria-label="Email address"/><button className="primary-button">Count me in <ArrowRight size={16}/></button></form></section>
    </main>
    <footer id="footer"><div className="footer-main"><div className="footer-brand"><a className="logo light" href="#"><span className="logo-mark"><ShoppingCart size={22}/></span><span>Shop<span className="logo-blue">Sphere</span><small>EVERYDAY DISCOVERIES</small></span></a><p>Good finds for real life.<br/>A little more joy in the everyday.</p></div><div><h4>Explore</h4><a href="#home">Home</a><a href="#products">Shop all</a><a href="#categories">Categories</a><a href="#story">Our story</a></div><div><h4>Help & support</h4><a href="#footer">Contact us</a><a href="#footer">Shipping information</a><a href="#footer">Returns & refunds</a><a href="#footer">FAQs</a></div><div className="footer-signup"><h4>Stay in the loop</h4><p>Good finds, fresh drops, straight to you.</p><div className="footer-social"><span>ig</span><span>f</span><span>in</span><span>▶</span></div></div></div><div className="footer-bottom"><span>© 2026 ShopSphere. A learning project.</span><div><a href="#footer">Privacy</a><a href="#footer">Terms</a><span>Made for everyday discovery ✦</span></div></div></footer>
    {cartOpen && <div className="cart-drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow">YOUR PICKS</span><h2>Your shopping bag ({count})</h2></div><button className="drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingCart size={35}/><h3>Room for something good.</h3><p>Your bag is empty for now.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Keep exploring</button></div> : <><div className="drawer-items">{cart.map(item => <div className="drawer-item" key={item._id}><img src={item.image.startsWith("http") ? item.image : asset(item.image)} alt=""/><div className="drawer-item-info"><strong>{item.name}</strong><span>{money(item.price)}</span><div className="qty"><button onClick={() => quantity(item._id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.quantity}</span><button disabled={item.quantity >= item.stock} onClick={() => quantity(item._id,1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><button className="remove" onClick={() => setCart(c => c.filter(x => x._id !== item._id))} aria-label="Remove item"><Trash2 size={16}/></button></div>)}</div><div className="drawer-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="checkout-note">Checkout and payments will be added in a later phase.</p><button className="checkout-button" onClick={() => setNotice("Checkout is not enabled in this learning version.")}>Continue to checkout <ArrowRight size={16}/></button></>}</aside></div>}
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
  </div>;
}
