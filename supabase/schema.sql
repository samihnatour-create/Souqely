-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Stores Table
create table stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users not null,
  name text not null,
  slug text unique not null,
  logo_url text,
  primary_color text default '#000000',
  currency text default 'USD', -- USD, LBP, BOTH
  phone text,
  whatsapp text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  currency text default 'USD',
  stock_quantity integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Images Table
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null
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
  price numeric not null
);

-- RLS Policies

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
