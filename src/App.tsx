import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Loading } from "./components/Loading";
import { useCategories } from "./hooks/useCategories";
import { useProducts } from "./hooks/useProcuts";
import { useDestaque } from "./hooks/useDestaques";
import type { Product } from "./services/products";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export function App() {
  // Carregamento de categorias, produtos e destaque
  const { categories, loading: loadingCats } = useCategories();
  const { products, loading: loadingProds } = useProducts();
  const { destaque, loading: loadingDest } = useDestaque();
  const loading = loadingCats || loadingProds || loadingDest;

  // Estados para abrir/fechar Drawer e produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Estados para abrir/fechar Dialog (lightbox) e URL da imagem
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");

  // Agrupa produtos por categoria
  const productsByCategory = useMemo(() => {
    const map: Record<number, Product[]> = {};
    categories.forEach((cat) => {
      map[cat.id] = products.filter((p) => p.category_id === cat.id);
    });
    return map;
  }, [categories, products]);

  // Filtra apenas categorias que têm produtos
  const categoriesWithProducts = useMemo(
    () =>
      categories.filter(
        (cat) => (productsByCategory[cat.id]?.length ?? 0) > 0
      ),
    [categories, productsByCategory]
  );

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const scrollToCategory = (id: number) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    const header = document.querySelector(".sticky");
    const headerH = header?.getBoundingClientRect().height || 0;
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Splash screen animada */}
      <AnimatePresence>
        {loading && <Loading key="loading-screen" />}
      </AnimatePresence>

      {/* Conteúdo principal só aparece quando terminar de carregar */}
      {!loading && (
        <>
          <main className="flex flex-col items-center">
            {/* -------------------- HEADER -------------------- */}
            <section className="w-full sm:w-[900px] flex flex-col items-center mt-3">
              <div className="flex justify-between flex-col sm:flex-row w-full mb-4">
                <div />
                <div className="sm:ml-40 flex justify-center">
                  <a href="https://choperiacolorado.com.br">
                    <img
                      src="imgs/logo-colorado.png"
                      alt="logo colorado"
                      className="w-[200px]"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    className="bg-[#ae3537] hover:bg-[#da5f5f] hidden sm:flex"
                    onClick={() =>
                      (window.location.href =
                        "https://choperiacolorado.com.br/")
                    }
                  >
                    <TiArrowBack /> Voltar para o site
                  </Button>
                </div>
              </div>
            </section>

            <img
              src="imgs/banner.jpg"
              alt="banner"
              className="mb-4"
              loading="lazy"
            />

            {/* -------------------- Dicas do Colorado (CARROSSEL) -------------------- */}
            <div className="w-full flex flex-col items-center justify-center py-3 gap-3 bg-[#ae3537]">
              <div className="w-full flex items-center justify-center rounded-2xl sm:w-[65%] p-2 mx-auto bg-[#ae3537]">
                <h3 className="font-semibold text-2xl text-white">
                  Dicas do colorado
                </h3>
              </div>

              <div className="sm:w-[1000px] w-full p-3">
                <Carousel opts={{ align: "start" }} className="w-full mb-5 ">
                  <CarouselContent>
                    {destaque.map((dest) => (
                      <CarouselItem
                        key={dest.id}
                        className="basis-1/2 sm:basis-1/5"
                      >
                        <div className="border rounded-[5px] border-[#ececec] flex flex-col justify-center items-center bg-white">
                          <img
                            src={dest.foto || "imgs/logo-colorado.png"}
                            alt={`foto do produto ${dest.category_name}`}
                            className="w-50 h-50 object-cover rounded-t-[5px] bg-white"
                            loading="lazy"
                          />
                          <p className="flex items-center justify-center bg-[#161616] px-2 text-white w-full">
                            {dest.category_name}
                          </p>
                          <div className="flex w-full m-2 p-1 flex-col bg-white">
                            <p className="flex w-full">{dest.nome}</p>
                            <p className="text-[#ae3537] font-bold">
                              R$ {dest.preco}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-30 top-80 -translate-y-1/2 bg-[#ae3537] hover:bg-red-300 hover:text-red-600 text-white p-2 rounded-full z-10" />
                  <CarouselNext className="absolute right-30 top-80 -translate-y-1/2 bg-[#ae3537] hover:bg-red-300 hover:text-red-600 text-white p-2 rounded-full z-10" />
                </Carousel>
              </div>
            </div>

            {/* -------------------- Categorias (CARROSSEL STICKY) -------------------- */}
            <div className="bg-[#eeeeee] w-full flex justify-center items-center sticky top-0 z-20">
              <div className="w-full sm:w-[1040px] p-2 mx-auto">
                <h3 className="font-semibold text-2xl text-[#ae3537] py-4">
                  Categorias
                </h3>
                <Carousel opts={{ align: "start" }} className="my-1">
                  <CarouselContent>
                    {categoriesWithProducts.map((cat) => {
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
                              loading="lazy"
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
                  <CarouselPrevious className="absolute left-67 top-[-33px] sm:left-200 -translate-y-1/2 bg-[#ae3537] hover:bg-red-300 hover:text-red-600 text-white p-2 rounded-full z-10" />
                  <CarouselNext className="absolute right-4 top-[-33px] -translate-y-1/2 bg-[#ae3537] hover:bg-red-300 hover:text-red-600 text-white p-2 rounded-full z-10" />
                </Carousel>
              </div>
            </div>

            {/* -------------------- Seções de Produtos por Categoria -------------------- */}
            <div className="w-full sm:w-[65%] p-2 space-y-8">
              {categoriesWithProducts.map((cat) => (
                <section
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className="pt-8 scroll-mt-[96px]"
                >
                  <h2 className="text-xl font-semibold mb-4 text-[#ae3537]">
                    {cat.nome}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productsByCategory[cat.id].map((prod) => (
                      <div
                        key={prod.id}
                        className="flex flex-row items-start gap-4 border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setDrawerOpen(true);
                        }}
                      >
                        <div className="flex-1 h-full flex flex-col justify-between text-left">
                          <h3 className="text-lg font-medium flex flex-col">
                            <span className="text-[14px] font-bold">{prod.code} - {prod.nome}</span>
                          </h3>
                          <p className="text-sm text-gray-600 my-2">
                            {prod.descritivo}
                          </p>
                          {prod.preco !== null && (
                            <p className="font-semibold text-[#ae3537]">
                              R$ {prod.preco}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 h-full items-center flex justify-center flex-col ">
                          <img
                            src={prod.foto || "imgs/logo-colorado.png"}
                            alt={prod.nome}
                            loading="lazy"
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

          {/* -------------------- Drawer de detalhes do produto -------------------- */}
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
              <div className="flex flex-col items-center justify-center mb-4">
                <p className="text-[16px] text-gray-200 font-bold">{selectedProduct?.code}</p>
                <img
                  src={selectedProduct?.foto || "imgs/logo-colorado.png"}
                  alt={selectedProduct?.nome}
                  loading="lazy"
                  className="w-40 h-40 object-cover rounded cursor-pointer"
                  onClick={() => {
                    setSelectedImgUrl(selectedProduct?.foto || "");
                    setLightboxOpen(true);
                  }}
                />
                <p className="text-[#dfdfdf] text-sm">*aperte para ampliar</p>
              </div>

              {selectedProduct?.preco !== null && (
                <p className="font-semibold mb-4 text-center text-white">
                  Preço: R$ {selectedProduct?.preco}
                </p>
              )}

              <DrawerFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                  Fechar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* -------------------- Dialog (lightbox) para exibir a imagem ampliada -------------------- */}
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="bg-white p-0 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] overflow-hidden">
              <DialogHeader className="px-4 pt-4">
                <DialogTitle className="text-lg text-black">
                  Visualização
                </DialogTitle>
                <DialogClose className="text-black hover:text-red-500" />
              </DialogHeader>

              <div className="flex justify-center items-center bg-gray-100">
                {selectedImgUrl && (
                  <img
                    src={selectedImgUrl}
                    alt="Imagem ampliada"
                    loading="lazy"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                )}
              </div>

              <div className="p-4 flex justify-end">
                <Button variant="outline" onClick={() => setLightboxOpen(false)}>
                  Fechar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

export default App;
