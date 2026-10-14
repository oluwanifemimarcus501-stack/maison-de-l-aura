/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, Sparkles, ArrowRight, X, Check, 
  Menu, ChevronRight, SlidersHorizontal, Star, ShieldCheck, 
  RotateCcw, Truck, Award, User, ExternalLink 
} from 'lucide-react';

// Product Data
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aurelia Cashmere Wrap Coat',
    category: 'Outerwear',
    price: 1850,
    image: '/src/assets/images/hero_fashion_runway_1792000342066.jpg',
    description: 'Crafted from double-faced Biella cashmere with an effortless self-tie belt and artisanal hand-stitching.',
    details: ['100% Mongolian Cashmere', 'Unlined clean-finish construction', 'Relaxed tailored silhouette', 'Dry clean only'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Noir', hex: '#1A1A1A' }, { name: 'Ecru', hex: '#F3EFEA' }],
    isNew: true,
    isBestSeller: true
  },
  {
    id: 'p2',
    name: 'Symphony Emerald Silk Gown',
    category: 'Evening',
    price: 2400,
    originalPrice: 2800,
    image: '/src/assets/images/product_silk_gown_1792000342671.jpg',
    description: 'Flowing bias-cut mulberry silk charmeuse gown featuring a draped cowl neckline and low open back.',
    details: ['100% Mulberry Silk (19 momme)', 'Bias cut for fluid drape', 'Concealed side zip', 'Made in Milan'],
    sizes: ['FR 34', 'FR 36', 'FR 38', 'FR 40', 'FR 42'],
    colors: [{ name: 'Emerald', hex: '#0B6623' }, { name: 'Midnight', hex: '#0C1B33' }, { name: 'Burgundy', hex: '#6b1d2f' }],
    isNew: true
  },
  {
    id: 'p3',
    name: 'Sovereign Double-Breasted Blazer',
    category: 'Outerwear',
    price: 1250,
    image: '/src/assets/images/product_cashmere_coat_1792000342892.jpg',
    description: 'Structured wool-twill blazer with horn buttons and structured padded shoulders for an commanding silhouette.',
    details: ['98% Virgin Wool, 2% Elastane', 'Cupro twill lining', 'Structured shoulders', 'Made in Paris'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Charcoal', hex: '#333333' }],
    isBestSeller: true
  },
  {
    id: 'p4',
    name: 'Milano Structured Leather Tote',
    category: 'Accessories',
    price: 980,
    image: '/src/assets/images/product_leather_bag_1792000342724.jpg',
    description: 'Architectural structured tote in full-grain Tuscan calfskin with brushed gold hardware and microsuede interior.',
    details: ['100% Tuscan Calfskin', 'Brushed palladium hardware', 'Internal zipped compartment', 'Dimensions: 38cm x 28cm x 14cm'],
    sizes: ['One Size'],
    colors: [{ name: 'Cognac', hex: '#9A6324' }, { name: 'Black', hex: '#111111' }, { name: 'Cream', hex: '#EBE5D8' }],
    isNew: true
  },
  {
    id: 'p5',
    name: 'Lumière Pleated Silk Midi Skirt',
    category: 'Ready-to-Wear',
    price: 720,
    image: '/src/assets/images/lookbook_atelier_1792000342702.jpg',
    description: 'Sunburst pleated silk georgette skirt that moves with exquisite lightness and sculptural grace.',
    details: ['100% Silk Georgette', 'Elasticated velvet waistband', 'Fully lined', 'Dry clean only'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Bronze', hex: '#CD7F32' }]
  }
];

interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'collection' | 'ai-stylist' | 'lookbook' | 'atelier'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  
  // AI Stylist State
  const [aiOccasion, setAiOccasion] = useState('Red Carpet Gala');
  const [aiPreferences, setAiPreferences] = useState('Minimalist elegance, earthy tones');
  const [aiGarment, setAiGarment] = useState('Aurelia Cashmere Wrap Coat');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    concept: string;
    accessories: string[];
    colorPalette: string[];
    directorTip: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    showToast(`Added ${product.name} (${size}) to your shopping bag`);
    setIsCartOpen(true);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
    const prod = PRODUCTS.find(p => p.id === productId);
    if (wishlist.includes(productId)) {
      showToast(`Removed from wishlist`);
    } else {
      showToast(`Added ${prod?.name} to wishlist`);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'MAISON10') {
      setDiscount(0.10);
      showToast('10% Privilege Discount Applied');
    } else if (promoCode.toUpperCase() === 'LAVURA20') {
      setDiscount(0.20);
      showToast('20% VIP Season Discount Applied');
    } else {
      showToast('Invalid Privilege Code');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const finalTotal = subtotal * (1 - discount);

  const handleRunAiStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: aiOccasion,
          preferences: aiPreferences,
          garmentName: aiGarment
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
      } else {
        showToast(data.error || 'Failed to generate styling advice');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error connecting to AI Stylist');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-[#FAF8F5] px-6 py-3 rounded-none shadow-2xl border-l-2 border-[#D4AF37] text-sm animate-fade-in flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4DC] px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={() => setActiveTab('home')} 
          className="text-xl lg:text-2xl font-serif tracking-wider font-semibold text-[#1A1A1A] whitespace-nowrap shrink-0 text-left hover:opacity-80 transition-opacity"
        >
          Maison de L'Aura
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line items) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-[#4A453F]">
          <button 
            onClick={() => setActiveTab('home')}
            className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 ${activeTab === 'home' ? 'text-[#1A1A1A] underline underline-offset-4 decoration-[#D4AF37]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('collection')}
            className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 ${activeTab === 'collection' ? 'text-[#1A1A1A] underline underline-offset-4 decoration-[#D4AF37]' : ''}`}
          >
            Collections
          </button>
          <button 
            onClick={() => setActiveTab('ai-stylist')}
            className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'ai-stylist' ? 'text-[#1A1A1A] underline underline-offset-4 decoration-[#D4AF37]' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI Stylist</span>
          </button>
          <button 
            onClick={() => setActiveTab('lookbook')}
            className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 ${activeTab === 'lookbook' ? 'text-[#1A1A1A] underline underline-offset-4 decoration-[#D4AF37]' : ''}`}
          >
            Lookbook
          </button>
          <button 
            onClick={() => setActiveTab('atelier')}
            className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 ${activeTab === 'atelier' ? 'text-[#1A1A1A] underline underline-offset-4 decoration-[#D4AF37]' : ''}`}
          >
            Atelier
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Wishlist & Cart) */}
        <div className="flex items-center gap-5 shrink-0">
          <button 
            onClick={() => showToast(`Wishlist contains ${wishlist.length} saved pieces`)}
            className="relative p-2 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-none hover:bg-[#333] transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A] text-[#FAF8F5]">
              <div className="absolute inset-0 z-0 opacity-60">
                <img 
                  src="/src/assets/images/hero_fashion_runway_1792000342066.jpg" 
                  alt="Maison de L'Aura Runway" 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full flex flex-col items-start">
                <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-4">
                  Autumn / Winter 2026 Collection
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif max-w-2xl leading-[1.1] mb-6 text-balance">
                  Quiet Elegance & Sculptural Silhouettes
                </h1>
                <p className="text-lg md:text-xl text-[#EAE4DC] max-w-xl font-light mb-10 leading-relaxed">
                  Handcrafted in Paris and Milan using uncompromising Tuscan hides, Mongolian cashmere, and fluid mulberry silk.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => setActiveTab('collection')}
                    className="px-8 py-4 bg-[#FAF8F5] text-[#1A1A1A] font-semibold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all"
                  >
                    Explore Collection
                  </button>
                  <button 
                    onClick={() => setActiveTab('ai-stylist')}
                    className="px-8 py-4 border border-[#FAF8F5]/40 text-[#FAF8F5] font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>AI Style Concierge</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Brand Values Strip */}
            <section className="border-b border-[#EAE4DC] bg-white py-10 px-6 lg:px-12">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Complimentary White-Glove Delivery</h3>
                  <p className="text-xs text-[#666]">Insured global shipping in bespoke packaging</p>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Certified Ethical Provenance</h3>
                  <p className="text-xs text-[#666]">Traceable organic fibers & artisan ateliers</p>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Complimentary Tailoring & Returns</h3>
                  <p className="text-xs text-[#666]">30-day trial with bespoke fitting adjustments</p>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <h3 className="text-sm font-semibold mb-1">Dedicated Style Concierge</h3>
                  <p className="text-xs text-[#666]">24/7 personal fashion advisor access</p>
                </div>
              </div>
            </section>

            {/* Featured Masterpieces Section */}
            <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#888] font-semibold block mb-2">
                    Curated Masterpieces
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif">Featured Arrivals</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('collection')}
                  className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 hover:text-[#D4AF37] transition-colors group"
                >
                  <span>View All Pieces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PRODUCTS.slice(0, 3).map(product => (
                  <div key={product.id} className="group flex flex-col bg-white border border-[#EAE4DC] hover:border-[#D4AF37] transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F1EA]">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {product.isNew && (
                        <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest px-2.5 py-1">
                          New
                        </span>
                      )}
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-sm text-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Quick View
                      </button>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Unboxed metadata: category · price */}
                        <div className="text-xs text-[#777] mb-2 flex items-center gap-2">
                          <span>{product.category}</span>
                          <span>·</span>
                          <span>In Stock</span>
                        </div>
                        <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-[#D4AF37] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#555] line-clamp-2 mb-4 font-light">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F0ECE4]">
                        <span className="font-serif text-lg font-semibold">${product.price.toLocaleString()}</span>
                        <button 
                          onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
                          className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                        >
                          <span>Add to Bag</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Style Concierge Teaser Banner */}
            <section className="bg-[#1A1A1A] text-[#FAF8F5] py-20 px-6 lg:px-12 my-12">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Intelligent Styling Suite</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                    Meet Your Personal AI Style Concierge
                  </h2>
                  <p className="text-[#CCC] font-light mb-8 leading-relaxed">
                    Planning for a gala, state dinner, or Milan fashion week? Let our neural style engine curate bespoke outfit pairings, accessory matches, and color palettes tailored to your distinct silhouette.
                  </p>
                  <button 
                    onClick={() => setActiveTab('ai-stylist')}
                    className="px-8 py-4 bg-[#D4AF37] text-[#1A1A1A] font-semibold text-xs uppercase tracking-widest hover:bg-white transition-all"
                  >
                    Consult AI Stylist Now
                  </button>
                </div>
                <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden bg-[#2A2A2A] border border-white/10 relative">
                  <img 
                    src="/src/assets/images/lookbook_atelier_1792000342702.jpg" 
                    alt="Atelier & AI Styling" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-md border border-white/10">
                    <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-1">AI Recommendation Insight</p>
                    <p className="text-sm font-serif italic text-white">"Pair the Aurelia Cashmere Coat with structural bronze earrings and the Milano Tote for understated Parisian authority."</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            {/* Header & Filters */}
            <div className="mb-10">
              <h1 className="text-4xl lg:text-5xl font-serif mb-3">The Collections</h1>
              <p className="text-sm text-[#666] font-light">Explore our complete repertoire of timeless contemporary tailoring and evening wear.</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#EAE4DC] mb-12">
              {['All', 'Outerwear', 'Evening', 'Ready-to-Wear', 'Accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ${selectedCategory === cat ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#666] hover:bg-[#F0ECE4] border border-[#EAE4DC]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {PRODUCTS
                .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                .map(product => (
                  <div key={product.id} className="group flex flex-col bg-white border border-[#EAE4DC] hover:border-[#D4AF37] transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F1EA]">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-sm text-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Quick View
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-xs text-[#777] mb-1.5 flex items-center gap-2">
                          <span>{product.category}</span>
                          <span>·</span>
                          <span>In Stock</span>
                        </div>
                        <h3 className="font-serif text-lg font-medium mb-1.5 group-hover:text-[#D4AF37] transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F0ECE4]">
                        <span className="font-serif text-base font-semibold">${product.price.toLocaleString()}</span>
                        <button 
                          onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
                          className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#D4AF37] transition-colors"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'ai-stylist' && (
          <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>AI Style Concierge Suite</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Curate Your Bespoke Look</h1>
              <p className="text-[#666] font-light text-sm">
                Describe your upcoming occasion and preferences. Our intelligent neural stylist will formulate complete architectural outfit directions and accessory recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Form */}
              <form onSubmit={handleRunAiStylist} className="lg:col-span-5 bg-white p-8 border border-[#EAE4DC] flex flex-col gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-2">
                    Occasion or Event
                  </label>
                  <input 
                    type="text" 
                    value={aiOccasion}
                    onChange={e => setAiOccasion(e.target.value)}
                    placeholder="e.g. Milan Fashion Week Gala, Autumn Business Brunch"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE4DC] text-sm focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-2">
                    Primary Garment Anchor
                  </label>
                  <select 
                    value={aiGarment}
                    onChange={e => setAiGarment(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE4DC] text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-2">
                    Aesthetic Preferences
                  </label>
                  <textarea 
                    value={aiPreferences}
                    onChange={e => setAiPreferences(e.target.value)}
                    rows={3}
                    placeholder="e.g. Minimalist luxury, earthy tones, understated gold jewelry"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EAE4DC] text-sm focus:outline-none focus:border-[#D4AF37]"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={aiLoading}
                  className="w-full py-4 bg-[#1A1A1A] text-white font-semibold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{aiLoading ? 'Consulting Neural Stylist...' : 'Generate AI Styling Direction'}</span>
                </button>
              </form>

              {/* Results Display */}
              <div className="lg:col-span-7 bg-white p-8 border border-[#EAE4DC] min-h-[480px] flex flex-col justify-between">
                {aiLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-serif text-lg">Formulating bespoke styling direction...</p>
                    <p className="text-xs text-[#888] mt-1">Analyzing silhouette harmonics and seasonal colorways</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">Styling Concept</span>
                      <p className="font-serif text-xl text-[#1A1A1A] leading-relaxed">"{aiResult.concept}"</p>
                    </div>

                    <div className="border-t border-[#EAE4DC] pt-6">
                      <span className="text-xs uppercase tracking-widest text-[#888] font-semibold block mb-3">Recommended Accessories</span>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiResult.accessories?.map((acc, idx) => (
                          <li key={idx} className="text-sm bg-[#FAF8F5] p-3 border border-[#EAE4DC] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-[#EAE4DC] pt-6">
                      <span className="text-xs uppercase tracking-widest text-[#888] font-semibold block mb-3">Harmonic Color Palette</span>
                      <div className="flex items-center gap-3">
                        {aiResult.colorPalette?.map((color, idx) => (
                          <span key={idx} className="text-xs px-3 py-1 bg-[#FAF8F5] border border-[#EAE4DC] font-mono">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#EAE4DC] pt-6 bg-[#FAF8F5] p-4 border-l-2 border-l-[#D4AF37]">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">Creative Director Note</span>
                      <p className="text-xs italic text-[#444]">{aiResult.directorTip}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-[#888]">
                    <Sparkles className="w-10 h-10 text-[#D4AF37] mb-3 opacity-60" />
                    <p className="font-serif text-lg mb-1">Your styling advice will appear here</p>
                    <p className="text-xs">Fill out the occasion form and click generate to consult our AI stylist.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lookbook' && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-3">Visual Narrative</span>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Autumn / Winter 2026 Lookbook</h1>
              <p className="text-[#666] font-light text-sm">Cinematic moments captured on location in Milan and Paris.</p>
            </div>

            <div className="space-y-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 aspect-[16/9] overflow-hidden bg-[#EAE4DC]">
                  <img 
                    src="/src/assets/images/hero_fashion_runway_1792000342066.jpg" 
                    alt="Look 1" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-widest text-[#888] mb-2">Look 01 · The Urban Monolith</span>
                  <h3 className="font-serif text-3xl mb-4">Cashmere & Travertine</h3>
                  <p className="text-sm text-[#555] font-light mb-6 leading-relaxed">
                    Featuring the Aurelia Cashmere Wrap Coat layered over lightweight silk twill separates. Designed for the uncompromising urban aesthete.
                  </p>
                  <button 
                    onClick={() => {
                      const coat = PRODUCTS[0];
                      addToCart(coat, 'M', 'Camel');
                    }}
                    className="self-start px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors"
                  >
                    Shop This Look ($1,850)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 lg:order-1 flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-widest text-[#888] mb-2">Look 02 · Evening Reverie</span>
                  <h3 className="font-serif text-3xl mb-4">Emerald Bias Silk</h3>
                  <p className="text-sm text-[#555] font-light mb-6 leading-relaxed">
                    The Symphony Emerald Silk Gown cascades with effortless sculptural fluidity, catching twilight illumination with every step.
                  </p>
                  <button 
                    onClick={() => {
                      const gown = PRODUCTS[1];
                      addToCart(gown, 'FR 38', 'Emerald');
                    }}
                    className="self-start px-6 py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors"
                  >
                    Shop This Look ($2,400)
                  </button>
                </div>
                <div className="lg:col-span-7 lg:order-2 aspect-[16/9] overflow-hidden bg-[#EAE4DC]">
                  <img 
                    src="/src/assets/images/product_silk_gown_1792000342671.jpg" 
                    alt="Look 2" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'atelier' && (
          <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-3">Uncompromising Heritage</span>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Inside The Maison Atelier</h1>
              <p className="text-[#666] font-light text-sm">Where master artisans unite centuries-old tailoring traditions with modern sustainable innovation.</p>
            </div>

            <div className="aspect-[16/9] overflow-hidden mb-12 bg-[#EAE4DC]">
              <img 
                src="/src/assets/images/lookbook_atelier_1792000342702.jpg" 
                alt="Atelier" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 border border-[#EAE4DC]">
                <h3 className="font-serif text-2xl mb-3">01. Ethical Sourcing</h3>
                <p className="text-sm text-[#666] font-light leading-relaxed">
                  We partner directly with family-run cashmere herds in Inner Mongolia and silk mills in Como, ensuring zero compromise on fiber purity or animal welfare.
                </p>
              </div>
              <div className="bg-white p-8 border border-[#EAE4DC]">
                <h3 className="font-serif text-2xl mb-3">02. Handcrafted Precision</h3>
                <p className="text-sm text-[#666] font-light leading-relaxed">
                  Each garment undergoes up to 40 hours of meticulous hand-finishing by master tailors in Paris and Milan, guaranteeing impeccable structural longevity.
                </p>
              </div>
              <div className="bg-white p-8 border border-[#EAE4DC]">
                <h3 className="font-serif text-2xl mb-3">03. Circular Lifecycle</h3>
                <p className="text-sm text-[#666] font-light leading-relaxed">
                  Our pieces are designed for generational endurance. We offer complimentary lifetime restoration and recycling programs for all Maison de L'Aura garments.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[3/4] bg-[#F4F1EA]">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#777] mb-2">
                  <span>{selectedProduct.category}</span>
                  <span> · </span>
                  <span>In Stock</span>
                </div>
                <h2 className="font-serif text-3xl mb-3">{selectedProduct.name}</h2>
                <div className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-4">
                  ${selectedProduct.price.toLocaleString()}
                </div>
                <p className="text-sm text-[#666] font-light mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider font-semibold block mb-2">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => {}}
                        className="px-4 py-2 text-xs border border-[#EAE4DC] hover:border-[#1A1A1A] font-medium"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-xs uppercase tracking-wider font-semibold block mb-2">Details & Composition</span>
                  <ul className="space-y-1.5">
                    {selectedProduct.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-[#555] flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#EAE4DC]">
                <button 
                  onClick={() => {
                    addToCart(selectedProduct, selectedProduct.sizes[0], selectedProduct.colors[0].name);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D4AF37] transition-all"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-[#EAE4DC] flex items-center justify-between">
              <h3 className="font-serif text-2xl">Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-[#FAF8F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-[#888]">
                  <ShoppingBag className="w-12 h-12 mx-auto text-[#D4AF37] mb-3 opacity-60" />
                  <p className="font-serif text-lg mb-1">Your bag is empty</p>
                  <p className="text-xs">Explore our collections to add pieces.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-6 border-b border-[#EAE4DC]">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-20 h-24 object-cover bg-[#FAF8F5]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-medium text-base">{item.product.name}</h4>
                        <p className="text-xs text-[#777] mt-1">Size: {item.selectedSize} · Color: {item.selectedColor}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-semibold">${item.product.price.toLocaleString()}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#888]">Qty: {item.quantity}</span>
                          <button 
                            onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#EAE4DC] bg-[#FAF8F5]">
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Privilege Code (MAISON10)"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-[#EAE4DC] text-xs uppercase"
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase font-semibold"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-[#666]">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#D4AF37]">
                      <span>Privilege Discount ({discount * 100}%)</span>
                      <span>-${(subtotal * discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-serif text-xl font-semibold text-[#1A1A1A] pt-2 border-t border-[#EAE4DC]">
                    <span>Total</span>
                    <span>${finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    showToast('Order successfully placed via Secure White-Glove Checkout');
                    setCart([]);
                  }}
                  className="w-full py-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#D4AF37] transition-all"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-[#FAF8F5] pt-16 pb-12 px-6 lg:px-12 mt-auto border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-serif text-2xl tracking-wider mb-4">Maison de L'Aura</h3>
            <p className="text-xs text-[#AAA] font-light leading-relaxed mb-6">
              Contemporary luxury fashion house established in Paris and Milan. Uncompromising craftsmanship, sustainable organic fibers, and sculptural silhouettes.
            </p>
            <div className="text-xs text-[#888]">
              © 2026 Maison de L'Aura. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-4">Client Services</h4>
            <ul className="space-y-2.5 text-xs text-[#CCC]">
              <li><a href="#" className="hover:text-white transition-colors">Bespoke Tailoring & Fittings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">White-Glove Global Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Complimentary Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Generational Garment Care</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-4">The Maison</h4>
            <ul className="space-y-2.5 text-xs text-[#CCC]">
              <li><a href="#" className="hover:text-white transition-colors">Atelier Paris · 24 Place Vendôme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Atelier Milan · Via Montenapoleone</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainable Provenance Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Editorial Archives</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-4">Privilege Newsletter</h4>
            <p className="text-xs text-[#AAA] font-light mb-4">
              Receive private invitations to seasonal runway viewings and editorial lookbooks.
            </p>
            <form onSubmit={e => { e.preventDefault(); showToast('Subscribed to Maison Privilege Newsletter'); }} className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-4 py-3 bg-white/5 border border-white/20 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <button type="submit" className="py-3 bg-[#D4AF37] text-[#1A1A1A] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors">
                Join Privilege
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
