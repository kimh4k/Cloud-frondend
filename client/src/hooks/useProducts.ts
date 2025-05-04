import { useQuery } from '@tanstack/react-query';
import { ApiResponse, Product } from '../types/product';
import { API_BASE_URL } from '../lib/utils';

export const useFetchProducts = () => {
  return useQuery<ApiResponse>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/products?populate=*`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    },
  });
};

export const useCategories = (products: Product[] | undefined) => {
  if (!products || products.length === 0) return [];
  
  const allCategories = products.flatMap(product => 
    product.categories.map(cat => cat.title)
  );
  
  return Array.from(new Set(allCategories));
};

export const useFeaturedProducts = (products: Product[] | undefined) => {
  if (!products) return [];
  return products.filter(product => product.type === 'featured');
};

export const useTrendingProducts = (products: Product[] | undefined) => {
  if (!products) return [];
  return products.filter(product => product.type === 'trending');
};

export const useFilteredProducts = (products: Product[] | undefined, selectedCategory: string | null) => {
  if (!products) return [];
  if (!selectedCategory) return products;
  
  return products.filter(product => 
    product.categories.some(cat => cat.title === selectedCategory)
  );
};

export const useFetchProduct = (id: string) => {
  return useQuery<ApiResponse>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      return res.json();
    },
    enabled: !!id,
  });
};
