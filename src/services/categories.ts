import { api } from "@/api/api";

export interface Category {
    id: number
    nome: string
    descritivo: string
    foto: string | null
}

export async function getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/get_categories.php');
    return data
}