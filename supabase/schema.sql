-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (for User Verification)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  verification_code text,
  is_verified boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stores Table
create table stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) not null,
  name text not null,
  slug text unique not null,
  logo_url text,
  primary_color text default '#000000',
  currency text default 'USD', -- USD, LBP, BOTH
  phone text,
  whatsapp text,
  
  -- New fields for Payment & Rates
  lbp_rate numeric default 89500,
  whish_number text,
  omt_name text,
  is_whish_enabled boolean default false,
  is_omt_enabled boolean default false,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  description text,
  
  -- Changed price to price_usd
  price_usd numeric not null,
  
  currency text default 'USD',
  stock_quantity integer default 0,
  active boolean default true,
  
  -- Main image URL
  main_image_url text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Images Table (Multi-image support)
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade not null,
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  payment_method text not null, -- COD, OMT, WHISH
  total_amount numeric not null,
  currency text default 'USD',
  status text default 'pending', -- pending, paid, cod_pending, completed, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null,
  price numeric not null -- Captured price at time of order
);

-- RLS Policies

-- Profiles: Users can view/update their own profile
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Stores: Public read, Owner write
alter table stores enable row level security;
create policy "Public stores are viewable by everyone" on stores for select using (true);
create policy "Users can insert their own store" on stores for insert with check (auth.uid() = owner_id);
create policy "Users can update their own store" on stores for update using (auth.uid() = owner_id);

-- Products: Public read, Owner write
alter table products enable row level security;
create policy "Public products are viewable by everyone" on products for select using (true);
create policy "Owners can insert products" on products for insert with check (exists (select 1 from stores where id = products.store_id and owner_id = auth.uid()));
create policy "Owners can update products" on products for update using (exists (select 1 from stores where id = products.store_id and owner_id = auth.uid()));
create policy "Owners can delete products" on products for delete using (exists (select 1 from stores where id = products.store_id and owner_id = auth.uid()));

-- Product Images: Public read, Owner write
alter table product_images enable row level security;
create policy "Public product images are viewable by everyone" on product_images for select using (true);
create policy "Owners can insert product images" on product_images for insert with check (exists (select 1 from products join stores on products.store_id = stores.id where products.id = product_images.product_id and stores.owner_id = auth.uid()));
create policy "Owners can delete product images" on product_images for delete using (exists (select 1 from products join stores on products.store_id = stores.id where products.id = product_images.product_id and stores.owner_id = auth.uid()));

-- Orders: Owner read/update, Public insert (checkout)
alter table orders enable row level security;
create policy "Owners can view orders for their store" on orders for select using (exists (select 1 from stores where id = orders.store_id and owner_id = auth.uid()));
create policy "Owners can update orders for their store" on orders for update using (exists (select 1 from stores where id = orders.store_id and owner_id = auth.uid()));
create policy "Public can insert orders" on orders for insert with check (true);

-- Order Items: Owner read, Public insert
alter table order_items enable row level security;
create policy "Owners can view order items for their store" on order_items for select using (exists (select 1 from orders join stores on orders.store_id = stores.id where orders.id = order_items.order_id and stores.owner_id = auth.uid()));
create policy "Public can insert order items" on order_items for insert with check (true);
