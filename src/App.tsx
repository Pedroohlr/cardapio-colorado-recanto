import { useState, useMemo } from "react";
import { Loading } from "./components/Loading";
import { useCategories } from "./hooks/useCategories";
import type { Product } from "./services/products";
import { useProducts } from "./hooks/useProcuts";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./components/ui/button";
import { TiArrowBack } from "react-icons/ti";
import { useDestaque } from "./hooks/useDestaques";

export function App() {
  const { categories, loading: loadingCats } = useCategories();
  const { products, loading: loadingProds } = useProducts();
  const { destaque, loading: loadingDest } = useDestaque();

  const loading = loadingCats || loadingProds || loadingDest;

  // agrupa produtos por categoria
  const productsByCategory = useMemo(() => {
    const map: Record<number, Product[]> = {};
    categories.forEach(cat => {
      map[cat.id] = products.filter(p => p.category_id === cat.id);
    });
    return map;
  }, [categories, products]);

  // filtra apenas categorias com ao menos um produto
  const categoriesWithProducts = useMemo(
    () => categories.filter(cat => (productsByCategory[cat.id]?.length ?? 0) > 0),
    [categories, productsByCategory]
  );

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollToCategory = (id: number) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    const header = document.querySelector(".sticky");
    const headerH = header?.getBoundingClientRect().height || 0;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <main className="flex flex-col items-center">
        {/* Header */}
        <section className="w-full sm:w-[900px] flex flex-col items-center mt-3">
          <div className="flex justify-between flex-col sm:flex-row w-full mb-4">
            <div />
            <div className="sm:ml-40 flex justify-center">
              <a href="https://choperiacolorado.com.br">
                <img
                  src="imgs/logo-colorado.png"
                  alt="logo colorado"
                  className="w-[200px]"
                />
              </a>
            </div>
            <div className="flex justify-center items-center">
              <Button
                className="bg-[#ae3537] hover:bg-[#da5f5f] hidden sm:flex"
                onClick={() => window.location.href = "https://choperiacolorado.com.br/"}
              >
                <TiArrowBack />
                Voltar para o site
              </Button>
            </div>
          </div>
          <img src="imgs/banner.jpg" alt="banner" className="mb-4" />
        </section>

        {/* Título estático */}
        <div className="w-full sm:w-[65%] p-2 mx-auto">
          <h3 className="font-semibold text-2xl text-[#ae3537]">Categorias</h3>
        </div>

        {/* Carrossel sticky */}
        <div className="sticky top-0 bg-white z-20 w-full sm:w-[65%] p-2 mx-auto">
          <Carousel opts={{ align: "start" }} className="my-2">
            <CarouselContent>
              {categoriesWithProducts.map(cat => {
                const isActive = cat.id === activeCategory;
                return (
                  <CarouselItem
                    key={cat.id}
                    className="basis-1/3 sm:basis-1/7 cursor-pointer"
                    onClick={() => scrollToCategory(cat.id)}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={cat.foto || ""}
                        alt={cat.nome}
                        className={
                          `rounded-full h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] object-cover ` +
                          (isActive ? "border-2 border-black" : "")
                        }
                      />
                      <h2
                        className={
                          `mt-2 text-center ` +
                          (isActive ? "text-black" : "text-gray-500")
                        }
                      >
                        {cat.nome}
                      </h2>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Título estático */}
        <div className="w-full sm:w-[65%] p-2 mx-auto">
          <h3 className="font-semibold text-2xl text-[#ae3537]">Destaques</h3>
        </div>

        <div className="sm:w-[900px] w-full">
          <Carousel 
            opts={{
              align: "center"
            }}
            className="w-full"
          >
            <CarouselContent>
              {destaque.map((dest) => (
                <CarouselItem key={dest.id} className="basis-1/3 sm:basis-1/5">
                  <div className="border-2 rounded-[5px] border-[#cacaca] flex flex-col justify-center items-center">
                    <img 
                      src={dest.foto || "imgs/logo-colorado.png"} 
                      alt={`foto do produto ${dest.category_name}`} 
                      className="w-50 h-50 object-cover rounded-t-[5px]"
                    />
                    <p 
                      className="flex items-center justify-center bg-[#161616] px-2 text-white w-full"
                    >
                      {dest.category_name}
                    </p>
                    <div className="flex w-full m-2 p-1 flex-col">
                      <p className="flex w-full">{dest.nome}</p>
                      <p className="text-[#ae3537] font-bold">R$ {dest.preco}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
               <CarouselPrevious 
                  className="
                    absolute left-80 top-90 
                    -translate-y-1/2 
                    bg-[#ae3537] hover:bg-red-300 hover:text-red-600 
                    text-white p-2 rounded-full
                    z-10
                  " 
                />

                <CarouselNext 
                  className="
                    absolute right-80 top-90 
                    -translate-y-1/2 
                    bg-[#ae3537] hover:bg-red-300 hover:text-red-600 
                    text-white p-2 rounded-full
                    z-10
                  " 
                />
          </Carousel>
        </div>
        

        {/* Seções de Produtos por Categoria */}
        <div className="w-full sm:w-[65%] p-2 space-y-8">
          {categoriesWithProducts.map(cat => (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              className="pt-8 scroll-mt-[96px]"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#ae3537]">
                {cat.nome}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productsByCategory[cat.id].map(prod => (
                  <div
                    key={prod.id}
                    className="flex flex-row items-start gap-4 border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setDrawerOpen(true);
                    }}
                  >
                    {/* Texto à esquerda */}
                    <div className="flex-1 h-full flex flex-col justify-between text-left">
                      <h3 className="text-lg font-medium">{prod.nome}</h3>
                      <p className="text-sm text-gray-600 my-2">{prod.descritivo}</p>
                      {prod.preco !== null && (
                        <p className="font-semibold text-[#ae3537]">
                          R$ {prod.preco}
                        </p>
                      )}
                    </div>
                    {/* Imagem à direita */}
                    <div className="flex-shrink-0">
                      <img
                        src={prod.foto || "imgs/logo-colorado.png"}
                        alt={prod.nome}
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Drawer de detalhes do produto */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="border-none bg-[#ae3537]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">
              {selectedProduct?.nome}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="mb-4 text-center text-gray-300">
            {selectedProduct?.descritivo}
          </DrawerDescription>
          <div className="flex justify-center mb-4">
            <img
              src={selectedProduct?.foto || "imgs/logo-colorado.png"}
              alt={selectedProduct?.nome}
              className="w-40 h-40 object-cover rounded"
            />
          </div>
         {selectedProduct?.preco !== null && (
           <p className="font-semibold mb-4 text-center text-white">
            Preço: R$ {selectedProduct?.preco}
          </p>)}
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
