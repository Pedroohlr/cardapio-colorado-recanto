import { api } from "@/api/api";

export interface Product {
  id: number;
  code: string;
  nome: string;
  descritivo: string;
  preco: number;
  foto: string | null;
  category_id: number;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/get_products.php');
  return data;
}
