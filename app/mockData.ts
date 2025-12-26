import { Product, Customer, Supplier, Transaction } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: 'AYM-001', name: 'Ayam Broiler Hidup', category: 'Live', unit: 'Kg', stock: 450, minStock: 100, maxStock: 1000, buyPrice: 22000, sellPrice: 25000, agentPrice: 24000, distributorPrice: 23500 },
  { id: '2', code: 'KKS-001', name: 'Karkas Whole 0.8kg', category: 'Carcass', unit: 'Ekor', stock: 120, minStock: 50, maxStock: 500, buyPrice: 28000, sellPrice: 32000, agentPrice: 31000, distributorPrice: 30000 },
  { id: '3', code: 'PRT-001', name: 'Sayap Ayam', category: 'Parting', unit: 'Kg', stock: 25, minStock: 30, maxStock: 200, buyPrice: 15000, sellPrice: 18000, agentPrice: 17500, distributorPrice: 17000 },
  { id: '4', code: 'PRT-002', name: 'Paha Bawah', category: 'Parting', unit: 'Kg', stock: 1050, minStock: 20, maxStock: 1000, buyPrice: 32000, sellPrice: 38000, agentPrice: 37000, distributorPrice: 36000 },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Warung Bu Siti', type: 'Retail', phone: '0812345678', address: 'Pasar Baru', totalOrders: 45, debt: 0 },
  { id: 'c2', name: 'PT Food Nusantara', type: 'Distributor', phone: '0812333444', address: 'Kawasan Industri', totalOrders: 120, debt: 15000000 },
  { id: 'c3', name: 'Resto Ayam Penyet', type: 'Agent', phone: '0819998887', address: 'Pusat Kota', totalOrders: 88, debt: 250000 },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Farm Fresh Jaya', contact: '08111222333', location: 'Bogor', reliability: 98 },
  { id: 's2', name: 'Kemitraan Mandiri', contact: '08555666777', location: 'Sukabumi', reliability: 85 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-921', date: '2023-10-24 14:20', type: 'Purchase', entityName: 'Farm Fresh Jaya', total: 8500000, items: [], status: 'Completed' },
  { id: 'TRX-922', date: '2023-10-25 09:30', type: 'Sale', entityName: 'Warung Bu Siti', total: 750000, items: [], status: 'Completed' },
  { id: 'TRX-923', date: '2023-10-25 11:15', type: 'Sale', entityName: 'PT Food Nusantara', total: 12500000, items: [], status: 'Completed' },
];

export { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_TRANSACTIONS };

