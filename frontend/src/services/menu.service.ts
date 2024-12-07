import { api } from './api';
import { Menu, Category, Item } from '@/types';

interface UpdateItemsOrder {
  menuId: string;
  items: Item[];
}

interface UpdateCategoriesOrder {
  menuId: string;
  categories: Category[];
}

export const MenuService = {
  getMenu: async (menuId: string): Promise<Menu> => {
    const response = await api.get(`/menus/${menuId}`);
    return response.data;
  },

  createMenu: async (restaurantId: string, data: Partial<Menu>): Promise<Menu> => {
    const response = await api.post(`/restaurants/${restaurantId}/menus`, data);
    return response.data;
  },

  updateMenu: async (menuId: string, data: Partial<Menu>): Promise<Menu> => {
    const response = await api.patch(`/menus/${menuId}`, data);
    return response.data;
  },

  deleteMenu: async (menuId: string): Promise<void> => {
    await api.delete(`/menus/${menuId}`);
  },

  // Category operations
  createCategory: async (menuId: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.post(`/menus/${menuId}/categories`, data);
    return response.data;
  },

  updateCategory: async (categoryId: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.patch(`/categories/${categoryId}`, data);
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await api.delete(`/categories/${categoryId}`);
  },

  updateCategoriesOrder: async ({ menuId, categories }: UpdateCategoriesOrder): Promise<Category[]> => {
    const response = await api.patch(`/menus/${menuId}/categories/order`, { categories });
    return response.data;
  },

  // Item operations
  createItem: async (categoryId: string, data: Partial<Item>): Promise<Item> => {
    const response = await api.post(`/categories/${categoryId}/items`, data);
    return response.data;
  },

  updateItem: async (itemId: string, data: Partial<Item>): Promise<Item> => {
    const response = await api.patch(`/items/${itemId}`, data);
    return response.data;
  },

  deleteItem: async (itemId: string): Promise<void> => {
    await api.delete(`/items/${itemId}`);
  },

  updateItemsOrder: async ({ menuId, items }: UpdateItemsOrder): Promise<Item[]> => {
    const response = await api.patch(`/menus/${menuId}/items/order`, { items });
    return response.data;
  },
};
