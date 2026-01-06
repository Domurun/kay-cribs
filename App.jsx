import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, Heart, Share2, MapPin, 
  Phone, Mail, Facebook, Twitter, Instagram,
  User, Loader, ArrowRight, ShieldCheck, 
  FileCheck, Gavel, SearchCheck, Users,
  MessageCircle, Shield, PlusCircle, ImagePlus,
  Home
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const api = {
  // Fetch listings
  getListings: async () => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      if (!res.ok) throw new Error("Failed to fetch");
      return await res.json();
    } catch (error) {
      console.error("API Error:", error);
      return []; 
    }
  },

  // Login
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }
    return await res.json();
  },

  // Register
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    return await res.json();
  },

  // Create Listing
  createListing: async (formData) => {
    const res = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (!res.ok) throw new Error('Failed to create listing');
    return await res.json();
  }
};

// --- COMPONENTS ---

const Navbar = ({ navigate, currentPage, user, onLogout, onOpenAuth }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'legal', label: 'Legal Services' },
    { id: 'agents', label: 'Agents' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div onClick={() => navigate('home')} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold font-heading">K</div>
          <span className="text-xl font-bold text-gray-900 font-heading tracking-tight">KayCribs</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => navigate(link.id)}
              className={`text-sm font-medium transition-colors ${
                currentPage === link.id ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('dashboard')} className="text-sm font-medium text-gray-700 hover:text-green-600">Dashboard</button>
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <button onClick={onLogout} className="text-sm font-medium text-gray-500 hover:text-red-600">Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => onOpenAuth('login')} className="text-sm font-medium text-gray-600 hover:text-green-600">Login</button>
              <button onClick={() => onOpenAuth('signup')} className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-shadow shadow-md shadow-green-600/20">Get Started</button>
            </>
          )}
        </div>

        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-gray-600">
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => { navigate(link.id); setIsMobileOpen(false); }} className="text-left text-gray-700 font-medium hover:text-green-600">
                {link.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
               {user ? (
                 <>
                  <button onClick={() => { navigate('dashboard'); setIsMobileOpen(false); }} className="text-left font-medium text-gray-900">Dashboard</button>
                  <button onClick={() => { onLogout(); setIsMobileOpen(false); }} className="text-left font-medium text-red-600">Logout</button>
                 </>
               ) : (
                 <>
                  <button onClick={() => { onOpenAuth('login'); setIsMobileOpen(false); }} className="text-left font-medium text-gray-600">Login</button>
                  <button onClick={() => { onOpenAuth('signup'); setIsMobileOpen(false); }} className="text-left font-medium text-green-600">Create Account</button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ navigate, onOpenAuth }) => (
  <header className="relative pt-32 pb-32 overflow-hidden min-h-[600px] flex items-center">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1600596542815-e32c0ee3253f?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Modern House" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-md mb-6">
          <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs font-semibold text-green-100 uppercase tracking-wide">Verified Listings Only</span>
        </div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Find Your Perfect <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Sanctuary</span> in Rivers.
        </h1>
        <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed">
          The safest way to buy, sell, and rent properties. We combine premium real estate listings with integrated legal protection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('marketplace')} className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 flex justify-center items-center gap-2">
            Browse Properties <ArrowRight size={18} />
          </button>
          <button onClick={() => onOpenAuth('signup')} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold rounded-xl hover:bg-white hover:text-green-900 transition-all flex justify-center items-center gap-2">
            Create Account
          </button>
        </div>
      </div>
    </div>
  </header>
);

const ListingCard = ({ item, onOpenDetails, onSave }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative">
    <div className="relative h-64 overflow-hidden">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wide">
        {item.type}
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-700 transition-colors shadow-sm">
          <Share2 size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onSave(item); }} className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-700 transition-colors shadow-sm">
          <Heart size={16} className={item.saved ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-heading font-bold text-xl text-gray-900 line-clamp-1 mb-2">{item.title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
        <MapPin size={14} /> {item.location}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="text-green-600 font-bold text-lg">₦{item.price.toLocaleString()}</span>
        <button onClick={() => onOpenDetails(item)} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">Details</button>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const [activeModal, setActiveModal] = useState(null); 
  const [modalData, setModalData] = useState(null); 
  
  const [authMode, setAuthMode] = useState('login'); 
  const [authRole, setAuthRole] = useState('buyer');

  // Load initial data
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      const data = await api.getListings();
      setListings(data);
      setLoading(false);
    };
    loadListings();
    
    // Check local storage
    const savedUser = localStorage.getItem('kaycribs_user');
    const savedToken = localStorage.getItem('kaycribs_token');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Common fields
    const email = form.email.value;
    const password = form.password.value;

    try {
      let res;
      if (authMode === 'login') {
        res = await api.login(email, password);
      } else {
        // Registration fields
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const idNumber = form.idNumber ? form.idNumber.value : undefined;

        res = await api.register({
          firstName,
          lastName,
          email,
          password,
          role: authRole,
          idNumber
        });
      }

      // Success for both login and register
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('kaycribs_user', JSON.stringify(res.user));
      localStorage.setItem('kaycribs_token', res.token);
      
      setActiveModal(null);
      setCurrentPage('dashboard');
      alert(authMode === 'login' ? "Welcome back!" : "Account created successfully!");

    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const title = form.querySelector('input[name="title"]').value;
    const price = form.querySelector('input[name="price"]').value;
    const location = form.querySelector('input[name="location"]').value || "Port Harcourt";
    
    const listingData = {
      title,
      price: Number(price),
      location,
      type: "For Sale",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop", 
      advertiser: user ? user.name : "KayCribs User",
      description: "A beautiful property listed via KayCribs."
    };

    try {
      await api.createListing(listingData, token);
      alert("Success! Property added.");
      setActiveModal(null);
      const data = await api.getListings();
      setListings(data);
    } catch (err) {
      alert("Error creating listing: " + err.message);
    }
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500">
            <Hero navigate={setCurrentPage} onOpenAuth={() => { setAuthMode('signup'); setActiveModal('auth'); }} />
            <section className="py-16 bg-white">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Latest Properties</h2>
                  <p className="text-gray-600">Exclusive and verified listings available right now.</p>
                </div>
                {loading ? (
                  <div className="flex justify-center p-12"><Loader className="animate-spin text-green-600" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {listings.slice(0, 3).map(item => (
                      <ListingCard 
                        key={item._id} 
                        item={item} 
                        onOpenDetails={(item) => { setModalData(item); setActiveModal('details'); }}
                        onSave={() => {}}
                      />
                    ))}
                  </div>
                )}
                <div className="text-center mt-12">
                  <button onClick={() => setCurrentPage('marketplace')} className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700">
                    View All Listings <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      
      case 'marketplace':
        return (
          <div className="pt-24 min-h-screen bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-900 py-12 mb-8">
              <div className="container mx-auto px-6">
                <h1 className="font-heading text-4xl font-bold text-white mb-4">Marketplace</h1>
                <p className="text-gray-400">Explore verified properties for rent, lease, or sale.</p>
              </div>
            </div>
            <div className="container mx-auto px-6 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map(item => (
                   <ListingCard 
                     key={item._id} 
                     item={item} 
                     onOpenDetails={(item) => { setModalData(item); setActiveModal('details'); }}
                     onSave={() => {}}
                   />
                ))}
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        if (!user) { setCurrentPage('home'); return null; }
        return (
          <div className="pt-20 min-h-screen bg-gray-50">
            <div className="bg-gray-900 py-8 border-b border-gray-800">
               <div className="container mx-auto px-6 flex justify-between items-center">
                 <div>
                   <h1 className="font-heading text-2xl font-bold text-white mb-1">My Dashboard</h1>
                   <p className="text-gray-400 text-sm">Welcome back, <span className="text-green-400 font-semibold">{user.name}</span></p>
                 </div>
                 <button onClick={() => setActiveModal('upload')} className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium">
                   <PlusCircle size={16} /> Post Property
                 </button>
               </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
      <Navbar 
        navigate={setCurrentPage} 
        currentPage={currentPage} 
        user={user} 
        onLogout={() => { setUser(null); setToken(null); localStorage.removeItem('kaycribs_user'); localStorage.removeItem('kaycribs_token'); setCurrentPage('home'); }}
        onOpenAuth={(mode) => { setAuthMode(mode); setActiveModal('auth'); }}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Auth Modal */}
      {activeModal === 'auth' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setAuthRole('buyer')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authRole === 'buyer' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>Buyer</button>
              <button onClick={() => setAuthRole('seller')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authRole === 'seller' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>Seller</button>
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" type="text" placeholder="First Name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                    <input name="lastName" type="text" placeholder="Last Name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                  </div>
                  {authRole === 'seller' && (
                    <input name="idNumber" type="text" placeholder="NIN / ID Number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                  )}
                </>
              )}
              <input name="email" type="email" required placeholder="Email Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
              <input name="password" type="password" required placeholder="Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
              <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm">
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-green-600 font-semibold hover:underline">
                {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {activeModal === 'upload' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-heading text-xl font-bold text-gray-900">List Your Property</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                    <input name="title" type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
                    <input name="price" type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input name="location" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">Publish Listing</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {activeModal === 'details' && modalData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full text-gray-600 hover:text-black hover:bg-white"><X size={20} /></button>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
              <img src={modalData.image} className="w-full h-full object-cover" alt={modalData.title} />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">{modalData.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4"><MapPin size={16} className="text-green-600" /> {modalData.location}</div>
              <div className="text-3xl font-bold text-green-600 mb-6">₦{modalData.price.toLocaleString()}</div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{modalData.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">{modalData.advertiser.charAt(0)}</div>
                   <div>
                     <p className="text-sm font-bold text-gray-900">{modalData.advertiser}</p>
                     <p className="text-xs text-green-600 font-semibold">Verified Advertiser</p>
                   </div>
                 </div>
                 <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                   <MessageCircle size={20} /> Chat with Advertiser
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}