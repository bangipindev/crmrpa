type View = 'dashboard' | 'products' | 'customers' | 'suppliers' | 'transactions' | 'reports' | 'adjustments' | 'users' | 'roles';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: 'Kg' | 'Ekor' | 'Pack';
  stock: number;
  minStock: number;
  maxStock: number;
  buyPrice: number;
  sellPrice: number;
  agentPrice: number;
  distributorPrice: number;
}

interface Customer {
  id: string;
  name: string;
  type: 'Retail' | 'Agent' | 'Distributor';
  phone: string;
  address: string;
  totalOrders: number;
  debt: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  location: string;
  reliability: number;
}

interface TransactionItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'Purchase' | 'Sale';
  entityName: string;
  total: number;
  items: TransactionItem[];
  status: 'Completed' | 'Pending';
}

interface Adjustment {
  id: string;
  date: string;
  productId: string;
  productName: string;
  qtyChange: number;
  reason: 'Shrinkage' | 'Damaged' | 'Bonus' | 'Correction';
  user: string;
}

interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type { View, Product, Customer, Supplier, TransactionItem, Transaction, Adjustment , Users};

