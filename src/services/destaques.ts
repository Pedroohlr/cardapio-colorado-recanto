import { api } from "@/api/api";

export interface Destaque {
    id: number;
    code: string;
    nome: string;
    descritivo: string;
    preco: string | null;
    foto: string | null;
    category_id: number;
    category_name: string;
}

export async function getDestaques(): Promise<Destaque[]> {
    const { data } = await api.get<Destaque[]>('/get_destaques.php');
    return data
}