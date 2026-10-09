export type ApiUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  hover?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  tag: "New" | "Bestseller" | "Collection";
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
};

export type AdminProduct = CatalogProduct & {
  stock: number;
  active: boolean;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  lineTotal: number;
};

export type CartPayload = {
  items: CartItem[];
  count: number;
  subtotal: number;
};

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: { email: string; firstName?: string; lastName?: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  trackingNumber?: string;
  payment: { status: "Pending" | "Paid" | "Refunded" | "Failed" };
  createdAt: string;
};

export type Metrics = {
  totalRevenue: number;
  ordersCount: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  usersCount: number;
  lowStock: { id: string; name: string; slug: string; stock: number; isFeatured: boolean }[];
  recentOrders: Order[];
};

export type ProductFormState = {
  name: string;
  category: string;
  price: string;
  compareAtPrice: string;
  description: string;
  sizes: string;
  colors: string;
  stock: string;
  image: string;
  hover: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  active: boolean;
};