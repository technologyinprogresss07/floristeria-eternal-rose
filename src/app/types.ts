export interface Product {
  id: string;
  name: string;
  description: string;
  price_dop: number;
  image_url: string;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price_dop: number;
  image_url: string;
  quantity: number;
}
