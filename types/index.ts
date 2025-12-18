export type Store = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  currency: "USD" | "LBP" | "BOTH";
  phone: string | null;
  whatsapp: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  stock_quantity: number;
  active: boolean;
  created_at: string;
  images?: ProductImage[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
};

export type Order = {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  address: string;
  payment_method: "COD" | "OMT" | "WHISH";
  total_amount: number;
  currency: string;
  status: "pending" | "paid" | "cod_pending" | "completed" | "cancelled";
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};
