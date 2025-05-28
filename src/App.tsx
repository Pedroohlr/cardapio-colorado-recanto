// src/App.tsx
import { useState, useMemo } from "react";
import { Loading } from "./components/Loading";
import { useCategories } from "./hooks/useCategories";
import type { Product } from "./services/products";
import { useProducts } from "./hooks/useProcuts";
import { Carousel, CarouselContent, CarouselItem } from "./components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./components/ui/button";

export function App() {
  const { categories, loading: loadingCats } = useCategories();
  const { products, loading: loadingProds } = useProducts();
  const loading = loadingCats || loadingProds;

  const productsByCategory = useMemo(() => {
    const map: Record<number, Product[]> = {};
    categories.forEach(cat => {
      map[cat.id] = products.filter(p => p.category_id === cat.id);
    });
    return map;
  }, [categories, products]);

  const scrollToCategory = (id: number) => {
    const el = document.getElementById(`category-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading) return <Loading />;

  return (
    <>
      <main className="flex flex-col items-center">
        {/* Carousel de Categorias */}
        <div className="h-20"></div>
        <div className="sticky bg-white z-20 top-0  w-full sm:w-[65%] p-2">
          <h3 className="font-semibold text-2xl">Categorias</h3>
            <Carousel opts={{ align: "start" }} className="my-3">
              <CarouselContent>
                {categories.map(cat => (
                  <CarouselItem
                    key={cat.id}
                    className="basis-1/3 sm:basis-1/7 cursor-pointer"
                    onClick={() => scrollToCategory(cat.id)}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={cat.foto || ""}
                        alt={cat.nome}
                        className="rounded-full h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] object-cover"
                      />
                      <h2 className="mt-2 text-center">{cat.nome}</h2>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

        {/* Seções de Produtos por Categoria */}
        <div className="w-full sm:w-[65%] p-2 space-y-8">
          {categories.map(cat => (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              className="pt-8 scroll-mt-20"
            >
              <h2 className="text-xl font-semibold mb-4">{cat.nome}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productsByCategory[cat.id]?.length ? (
                  productsByCategory[cat.id].map(prod => (
                    <div
                      key={prod.id}
                      className="
                      flex flex-row items-start gap-4
                      border p-4 rounded shadow hover:shadow-md
                      transition cursor-pointer
                    "
                      onClick={() => {
                        setSelectedProduct(prod);
                        setDrawerOpen(true);
                      }}
                    >
                      {/* Texto à esquerda */}
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-medium">{prod.nome}</h3>
                        <p className="text-sm text-gray-600 my-2">{prod.descritivo}</p>
                        <p className="font-semibold">R$ {prod.preco}</p>
                      </div>

                      {/* Imagem à direita */}
                      <div className="flex-shrink-0">
                        <img
                          src={prod.foto || ""}
                          alt={prod.nome}
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum produto nesta categoria.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Drawer de detalhes do produto */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="border-none bg-[#d10000]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">{selectedProduct?.nome}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="mb-4 text-center text-gray-300">
            {selectedProduct?.descritivo}
          </DrawerDescription>
          {selectedProduct?.foto && (
            <div className="flex justify-center mb-4">
              <img
                src={selectedProduct.foto}
                alt={selectedProduct.nome}
                className="w-40 h-40 object-cover rounded"
              />
            </div>
          )}
          <p className="font-semibold mb-4 text-center text-white">
            Preço: R$ {selectedProduct?.preco}
          </p>
          <DrawerFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Fechar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default App;
