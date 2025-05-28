import { useEffect, useState } from 'react';
import { getProducts } from '@/services/products';
import type { Product } from '@/services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
