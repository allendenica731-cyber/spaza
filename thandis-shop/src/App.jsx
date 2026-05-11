import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Plus, 
  Search, 
  X, 
  CheckCircle2,
  Sparkles,
  Lightbulb,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2
} from 'lucide-react';

/**
 * Thandi's Shop
 * Added: Edit product functionality with pre-filled forms and delete option.
 */

const apiKey = ""; // Provided at runtime by environment

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Albany White Bread", category: "Bread & Dairy", buyPrice: 14.50, sellPrice: 18.00, stock: 12, threshold: 5 },
  { id: 2, name: "Clover Full Cream 1L", category: "Bread & Dairy", buyPrice: 16.00, sellPrice: 22.00, stock: 8, threshold: 4 },
  { id: 3, name: "Coca-Cola 500ml", category: "Drinks", buyPrice: 11.50, sellPrice: 15.00, stock: 24, threshold: 10 },
  { id: 4, name: "Simba Fruit Chutney 36g", category: "Snacks", buyPrice: 6.50, sellPrice: 9.00, stock: 30, threshold: 12 },
  { id: 5, name: "Sunlight Liquid 400ml", category: "Cleaning", buyPrice: 24.00, sellPrice: 32.00, stock: 6, threshold: 3 },
  { id: 6, name: "Vodacom R10 Airtime", category: "Airtime", buyPrice: 9.50, sellPrice: 10.00, stock: 50, threshold: 15 },
  { id: 7, name: "MTN R20 Airtime", category: "Airtime", buyPrice: 19.00, sellPrice: 20.00, stock: 40, threshold: 10 },
  { id: 8, name: "Rama Margarine 500g", category: "Bread & Dairy", buyPrice: 28.00, sellPrice: 35.00, stock: 5, threshold: 5 },
  { id: 9, name: "Lucky Star Pilchards", category: "Other", buyPrice: 21.00, sellPrice: 26.00, stock: 15, threshold: 6 },
  { id: 10, name: "NikNaks Large Bag", category: "Snacks", buyPrice: 12.00, sellPrice: 16.50, stock: 3, threshold: 8 },
  { id: 11, name: "Score Energy Drink", category: "Drinks", buyPrice: 8.50, sellPrice: 12.00, stock: 18, threshold: 12 },
  { id: 12, name: "Huletts Sugar 1kg", category: "Other", buyPrice: 19.50, sellPrice: 25.00, stock: 10, threshold: 5 },
  { id: 13, name: "Selati Brown Sugar 1kg", category: "Other", buyPrice: 20.00, sellPrice: 26.00, stock: 0, threshold: 5 },
  { id: 14, name: "Joko Tea 26s", category: "Other", buyPrice: 15.00, sellPrice: 20.00, stock: 7, threshold: 4 },
  { id: 15, name: "Large Eggs 6pk", category: "Bread & Dairy", buyPrice: 18.00, sellPrice: 24.00, stock: 9, threshold: 4 }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [today, setToday] = useState('');
  const [greeting, setGreeting] = useState('');
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Gemini AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Bread & Dairy',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    threshold: '5'
  });

  const categories = ["Bread & Dairy", "Drinks", "Snacks", "Airtime", "Cleaning", "Other"];

  const isActive = (tab) => activeTab === tab;

  // --- GEMINI INTEGRATION HELPERS ---
  const callGemini = async (prompt, systemPrompt) => {
    const maxRetries = 5;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  };

  const getSmartRestockAdvice = async () => {
    setIsAiLoading(true);
    const lowStock = inventory.filter(i => i.stock <= i.threshold).map(i => `${i.name} (Stock: ${i.stock})`).join(', ');
    
    const systemPrompt = "You are a savvy business consultant for a Spaza Shop (small convenience store) in South Africa. Use friendly, encouraging language. Refer to the owner as 'Mama Thandi'. Use **bold** for emphasis.";
    const prompt = `My shop current has these items low or out of stock: ${lowStock}. Based on typical Spaza shop trends, give me a quick prioritized reorder list and one clever tip to increase sales today. Keep it concise.`;

    try {
      const advice = await callGemini(prompt, systemPrompt);
      setAiAdvice({ title: "Smart Restock Advice", content: advice });
      setShowAiModal(true);
    } catch (err) {
      setToast("AI is resting right now. Try again later!");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getProfitStrategy = async () => {
    setIsAiLoading(true);
    const topSellers = [...inventory].sort((a,b) => (b.sellPrice - b.buyPrice) - (a.sellPrice - a.buyPrice)).slice(0, 3);
    const topList = topSellers.map(i => `${i.name} (R${(i.sellPrice-i.buyPrice).toFixed(2)} profit)`).join(', ');
    
    const systemPrompt = "You are an expert retail strategist for South African Spaza shops. You help small shop owners maximize their profit margins. Be professional, vibrant, and practical. Use **bold** for important terms or actions.";
    const prompt = `My top 3 profit items are: ${topList}. Suggest a 'Bundle Deal' or a 'Promotion' I can run to increase my total daily profit. Explain why it works. Keep it under 100 words.`;

    try {
      const advice = await callGemini(prompt, systemPrompt);
      setAiAdvice({ title: "Profit Growth Strategy", content: advice });
      setShowAiModal(true);
    } catch (err) {
      setToast("AI strategy failed to load. Check connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      if (isBullet) {
        return (
          <div key={idx} className="flex gap-2 ml-2 mb-1">
            <span className="text-green-600 font-bold">•</span>
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }
      return (
        <p key={idx} className={line.trim() === '' ? 'h-3' : 'mb-2'}>
          {renderedLine}
        </p>
      );
    });
  };

  // --- LOGIC ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning, Mama Thandi");
    else if (hour < 17) setGreeting("Good afternoon, Mama Thandi");
    else setGreeting("Good evening, Mama Thandi");

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    setToday(new Date().toLocaleDateString('en-GB', options));
    
    const savedInventory = localStorage.getItem('thandi_inventory');
    if (savedInventory && JSON.parse(savedInventory).length > 0) {
      try { setInventory(JSON.parse(savedInventory)); } catch (e) { setInventory(SAMPLE_PRODUCTS); }
    } else {
      setInventory(SAMPLE_PRODUCTS);
    }

    const savedSales = localStorage.getItem('thandi_sales');
    if (savedSales) {
      try { setSales(JSON.parse(savedSales)); } catch (e) { setSales([]); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('thandi_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('thandi_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSale = (product) => {
    if (product.stock <= 0) return;
    const updatedInventory = inventory.map(item => {
      if (item.id === product.id) return { ...item, stock: item.stock - 1 };
      return item;
    });
    setInventory(updatedInventory);
    setSales([{
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      price: product.sellPrice,
      profit: product.sellPrice - product.buyPrice,
      timestamp: new Date().toISOString()
    }, ...sales]);
    setToast(`Sale: ${product.name} recorded!`);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      buyPrice: product.buyPrice.toString(),
      sellPrice: product.sellPrice.toString(),
      stock: product.stock.toString(),
      threshold: product.threshold.toString()
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      category: formData.category,
      buyPrice: parseFloat(formData.buyPrice) || 0,
      sellPrice: parseFloat(formData.sellPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      threshold: parseInt(formData.threshold) || 0
    };

    if (editingProduct) {
      // Update existing
      setInventory(inventory.map(item => 
        item.id === editingProduct.id ? { ...item, ...productData } : item
      ));
      setToast(`${productData.name} updated!`);
    } else {
      // Create new
      const newProduct = { id: Date.now(), ...productData };
      setInventory([newProduct, ...inventory]);
      setToast(`${productData.name} added!`);
    }
    closeModal();
  };

  const handleDeleteProduct = () => {
    if (!editingProduct) return;
    setInventory(inventory.filter(item => item.id !== editingProduct.id));
    setToast(`${editingProduct.name} deleted.`);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Bread & Dairy', buyPrice: '', sellPrice: '', stock: '', threshold: '5' });
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.stock <= item.threshold);
  }, [inventory]);

  const summaryData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysSales = sales.filter(s => s.timestamp.startsWith(todayStr));
    const revenue = todaysSales.reduce((sum, s) => sum + s.price, 0);
    const inStockCount = inventory.filter(i => i.stock > 0).length;
    const outOfStockCount = inventory.filter(i => i.stock <= 0).length;
    return { revenue, inStockCount, outOfStockCount };
  }, [sales, inventory]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans max-w-[360px] mx-auto overflow-hidden relative border-x border-slate-200">
      
      {/* HEADER */}
      <header className="bg-green-600 px-4 py-6 text-white shadow-md">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Thandi's Spaza</h1>
          <p className="text-sm font-medium opacity-95 mt-0.5">{greeting}</p>
          <p className="text-xs opacity-80 mt-0.5">{today}</p>
        </div>
        <div className="flex justify-between items-center bg-green-700/50 p-2 rounded">
          <span className="text-xs uppercase font-bold">Today's Sales:</span>
          <span className="text-lg font-bold">R{summaryData.revenue.toFixed(2)}</span>
        </div>
      </header>

      {/* SEARCH BAR */}
      {isActive('inventory') && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-green-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {isActive('inventory') && (
          <div className="space-y-3">
            {filteredInventory.map(item => {
              const isOutOfStock = item.stock <= 0;
              const isLowStock = !isOutOfStock && item.stock <= item.threshold;

              return (
                <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm relative">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="absolute top-3 right-3 p-2 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>

                  <div className="flex justify-between items-start mb-2 pr-8">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                        Stock: {item.stock}
                      </p>
                      <p className="text-xs text-slate-400">Price: R{item.sellPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <button 
                    disabled={isOutOfStock} 
                    onClick={() => handleSale(item)} 
                    className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-slate-100 text-slate-400' : 'bg-green-600 text-white active:bg-green-700'}`}
                  >
                    RECORD SALE
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* REORDER TAB */}
        {isActive('reorder') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-600">Low Stock</h2>
              <button 
                onClick={getSmartRestockAdvice}
                disabled={isAiLoading || lowStockItems.length === 0}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase shadow active:scale-95 disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Restock Advice
              </button>
            </div>
            
            {lowStockItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400 italic">No low stock items.</div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="bg-white border border-l-4 border-l-orange-500 p-3 rounded shadow-sm flex justify-between">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                  <div className="text-right font-bold">
                    <span className={item.stock === 0 ? 'text-red-600' : 'text-orange-600'}>{item.stock} left</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SUMMARY TAB */}
        {isActive('summary') && (
          <div className="space-y-4">
             <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 font-bold uppercase mb-1">Total Stock Value</p>
                <p className="text-2xl font-bold text-green-800">R {inventory.reduce((a,b)=> a+(b.sellPrice*b.stock), 0).toFixed(2)}</p>
             </div>

             <button 
                onClick={getProfitStrategy}
                disabled={isAiLoading}
                className="w-full bg-indigo-600 text-white p-4 rounded-lg shadow-md flex items-center justify-between active:scale-[0.98] transition-all disabled:opacity-50"
             >
                <div className="flex items-center gap-3 text-left">
                    {isAiLoading ? <Loader2 size={24} className="animate-spin" /> : <Lightbulb size={24} />}
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-80">AI Strategy</p>
                      <p className="font-bold">Grow My Profits</p>
                    </div>
                </div>
                <ChevronRight size={20} />
             </button>

             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-lg border flex flex-col items-center">
                  <span className="text-xl font-bold">{summaryData.inStockCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Items</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border flex flex-col items-center">
                  <span className="text-xl font-bold text-red-600">{summaryData.outOfStockCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Out of Stock</span>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* AI MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full rounded-lg p-6 shadow-xl max-h-[80%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{aiAdvice?.title}</h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 p-1"><X size={24}/></button>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed mb-6">
              {renderFormattedText(aiAdvice?.content)}
            </div>
            <button 
              onClick={() => setShowAiModal(false)} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-md active:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-800 text-white px-4 py-2 rounded shadow-xl flex items-center gap-2 z-50">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* FLOATING ADD BUTTON */}
      {isActive('inventory') && !isModalOpen && (
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="fixed bottom-24 right-4 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 z-20"
        >
          <Plus size={32} />
        </button>
      )}

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full rounded-xl p-6 max-h-[90%] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="text-slate-400"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                <input required type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <select className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buying Price (R)</label>
                  <input required type="number" step="0.01" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.buyPrice} onChange={(e) => setFormData({...formData, buyPrice: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selling Price (R)</label>
                  <input required type="number" step="0.01" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.sellPrice} onChange={(e) => setFormData({...formData, sellPrice: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Quantity</label>
                  <input required type="number" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low-Stock Alert</label>
                  <input required type="number" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.threshold} onChange={(e) => setFormData({...formData, threshold: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-lg font-bold shadow-lg active:bg-green-700">
                  {editingProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}
                </button>
                
                {editingProduct && (
                  <button 
                    type="button"
                    onClick={handleDeleteProduct}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-red-100 active:bg-red-100"
                  >
                    <Trash2 size={18} />
                    DELETE PRODUCT
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full max-w-[360px] bg-slate-50 h-20 grid grid-cols-3 border-t border-slate-200 px-2 z-40">
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center justify-center ${isActive('inventory') ? 'text-green-600' : 'text-slate-400'}`}>
          <Package size={24} />
          <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">Stock</span>
        </button>

        <button onClick={() => setActiveTab('reorder')} className={`flex flex-col items-center justify-center ${isActive('reorder') ? 'text-green-600' : 'text-slate-400'}`}>
          <ShoppingCart size={24} />
          <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">Orders</span>
        </button>

        <button onClick={() => setActiveTab('summary')} className={`flex flex-col items-center justify-center ${isActive('summary') ? 'text-green-600' : 'text-slate-400'}`}>
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">Totals</span>
        </button>
      </nav>
    </div>
  );
};

export default App;