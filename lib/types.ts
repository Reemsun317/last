export type BusinessStatus = "pending" | "approved" | "rejected";

export type Business = {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  market: string | null;
  street: string | null;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  latitude: number;
  longitude: number;
  status: BusinessStatus;
  verified: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  currency: "NGN";
  image_url: string | null;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  created_at: string;
  updated_at: string;
};

export type BusinessWithProducts = Business & {
  products: Product[];
};

export type Metric = {
  id: string;
  business_id: string;
  views: number;
  whatsapp_clicks: number;
  call_clicks: number;
  direction_clicks: number;
  updated_at: string;
};
