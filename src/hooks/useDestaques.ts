import { useEffect, useState } from "react";
import { getDestaques } from "@/services/destaques";
import type { Destaque } from "@/services/destaques";

export function useDestaque() {
    const [destaque, setDestaque] = useState<Destaque[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        getDestaques()
        .then(setDestaque)
        .finally(() => setLoading(false));
    });
    return { destaque, loading }
}
