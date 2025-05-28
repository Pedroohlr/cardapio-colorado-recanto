import { useEffect, useState } from "react";
import { getCategories } from "@/services/categories";
import type { Category } from "@/services/categories";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        getCategories()
        .then(setCategories)
        .finally(() => setLoading(false))
    })
    return { categories, loading }
}