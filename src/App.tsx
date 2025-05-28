import { Loading } from "./components/Loading";
import { useCategories } from "./hooks/useCategories"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
  } from "./components/ui/carousel";

function App() {
  const { categories, loading } = useCategories();
  
  if (loading) return <Loading />

  return (
    <main>
      <div>
        <Carousel 
          opts={{
            align: "start"
          }}
        >
          <CarouselContent>
            {categories.map((cat) => (
              <CarouselItem>
                <img 
                  src={cat.foto!}
                  className="rounded-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>  
      </div>    
    </main>
  )
}

export default App
