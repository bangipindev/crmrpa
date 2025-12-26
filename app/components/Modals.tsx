import React from 'react';
import {
  X,
  CheckCircle2,
} from 'lucide-react';
import { Product, Customer, Supplier, Transaction } from '../types';

interface ModalsProps {
  activeModal: 'sale' | 'purchase' | 'adjustment' | 'product' | null;
  setActiveModal: (modal: 'sale' | 'purchase' | 'adjustment' | 'product' | null) => void;
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  selectedCustId: string;
  setSelectedCustId: (id: string) => void;
  selectedProdId: string;
  setSelectedProdId: (id: string) => void;
  trxQty: number;
  setTrxQty: (qty: number) => void;
  currentProduct: Product | undefined;
  currentCustomer: Customer | undefined;
  calculatedPrice: number;
  handleAddTransaction: () => void;
}

export function Modals({
  activeModal,
  setActiveModal,
  products,
  customers,
  suppliers,
  selectedCustId,
  setSelectedCustId,
  selectedProdId,
  setSelectedProdId,
  trxQty,
  setTrxQty,
  currentProduct,
  currentCustomer,
  calculatedPrice,
  handleAddTransaction,
}: ModalsProps) {
  return (
    <>
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in" onClick={() => setActiveModal(null)} />
          <div className="bg-[#161b22] border border-[#30363d] w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 overflow-hidden">
             <div className="p-6 border-b border-[#30363d] flex items-center justify-between bg-[#1c2128]">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeModal === 'sale' ? 'Record Sales Outbound' : 
                     activeModal === 'purchase' ? 'Procurement Inbound' : 
                     activeModal === 'adjustment' ? 'Stock Adjustment' : 'Register Product'}
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-1">Updating the live ledger and inventory database.</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-[#30363d] rounded-xl transition-colors">
                  <X size={20} />
                </button>
             </div>
             
             <div className="p-8 space-y-5">
                {/* Entity Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                    {activeModal === 'purchase' ? 'Supplier Source' : 'Customer Account'}
                  </label>
                  <select 
                    value={selectedCustId} 
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7] appearance-none"
                  >
                    {activeModal === 'purchase' ? (
                      suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                    ) : (
                      customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)
                    )}
                  </select>
                </div>

                {/* Product Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Inventory Item</label>
                  <select 
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7] appearance-none"
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.stock} {p.unit} Available</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Quantity / Weight</label>
                    <input 
                      type="number" 
                      value={trxQty}
                      onChange={(e) => setTrxQty(Number(e.target.value))}
                      placeholder="0.00" 
                      className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-white outline-none focus:border-[#2f81f7]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Unit</label>
                    <input disabled value={currentProduct?.unit || 'Kg'} className="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-[#484f58] outline-none" />
                  </div>
                </div>

                {/* Price Preview */}
                <div className="p-4 bg-[#2f81f7]/5 border border-[#2f81f7]/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#2f81f7] uppercase">Calculated Total</p>
                    <p className="text-xl font-black text-white">Rp {(activeModal === 'purchase' ? (currentProduct?.buyPrice || 0) * trxQty : calculatedPrice * trxQty).toLocaleString()}</p>
                  </div>
                  {activeModal === 'sale' && (
                    <span className="px-3 py-1 bg-[#2f81f7] text-white text-[10px] font-bold rounded-lg uppercase">
                      {currentCustomer?.type} PRICING
                    </span>
                  )}
                </div>
             </div>

             <div className="p-6 bg-[#0d1117]/50 border-t border-[#30363d] flex gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3.5 text-[#8b949e] font-bold hover:text-white transition-colors">Discard</button>
                <button 
                  onClick={handleAddTransaction}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-[#2f81f7] to-[#1f6feb] text-white font-black rounded-2xl shadow-xl shadow-[#2f81f7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {activeModal === 'purchase' ? 'Post Purchase' : 'Process Transaction'}
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}

