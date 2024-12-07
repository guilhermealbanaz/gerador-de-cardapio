export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  subscriptionStatus: string;
  menus: Menu[];
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  isActive: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  menuId: string;
  order: number;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  order: number;
  isAvailable: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
}
