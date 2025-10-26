import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../navigation/carousel";
import FeaturedProductCard from "./FeaturedProductCard";

interface FeaturedProductsSliderProps {
    products: {
        id: number;
        shop: string;
        title: string;
        price: string;
        discountPrice: string;
        rating: number;
        img: string;
    }[];
}

export default function FeaturedProductsSlider(props: FeaturedProductsSliderProps) {
    return (
        <Carousel className="sm:mx-10">
            <CarouselContent>
                {props.products.map((product) => (
                    <CarouselItem
                        key={product.id}
                        // 🔹 Solo añadimos este responsive breakpoint
                        className="basis-full sm:basis-[50%] flex justify-center items-center pl-0 my-4 sm:my-8"
                    >
                        <FeaturedProductCard
                            id={product.id}
                            shop={product.shop}
                            img={product.img}
                            title={product.title}
                            price={product.price}
                            discountPrice={product.discountPrice}
                            rating={product.rating}
                            edit={false}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="scale-80 sm:scale-100 -translate-x-2 sm:translate-x-0" />
            <CarouselNext className="scale-80 sm:scale-100 translate-x-2 sm:translate-x-0" />
        </Carousel>
    );
}
