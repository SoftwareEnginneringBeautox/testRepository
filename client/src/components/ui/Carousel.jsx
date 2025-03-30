import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import LargeChevronLeftIcon from "@/assets/icons/LargeChevronLeftIcon";
import LargeChevronRightIcon from "@/assets/icons/LargeChevronRightIcon";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context)
    throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins
    );

    const [state, setState] = React.useState({
      canScrollPrev: false,
      canScrollNext: false,
      isHovering: false
    });

    const updateScrollState = React.useCallback((api) => {
      if (!api) return;
      setState((prev) => ({
        ...prev,
        canScrollPrev: api.canScrollPrev(),
        canScrollNext: api.canScrollNext()
      }));
    }, []);

    const scrollPrev = () => api?.scrollPrev();
    const scrollNext = () => api?.scrollNext();

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      updateScrollState(api);
      api.on("reInit", updateScrollState);
      api.on("select", updateScrollState);
      return () => api?.off("select", updateScrollState);
    }, [api, updateScrollState]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          ...state,
          setState
        }}
      >
        <div
          ref={ref}
          className={cn("relative py-4", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden min-h-32 pb-4">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full bg-ash-200 hover:shadow-custom transition-all rounded-lg py-2",
        orientation === "horizontal" ? "ml-4" : "mt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
      <button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-16 w-8 transition-all hover:backdrop-blur-md hover:bg-white/10 border border-transparent flex items-center justify-center rounded-lg hover:shadow-md",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          !canScrollPrev && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <LargeChevronLeftIcon className="h-5 w-5 text-white/90" />
        <span className="sr-only">Previous slide</span>
      </button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
      <button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-16 w-8 transition-all hover:backdrop-blur-md hover:bg-white/10 border border-transparent flex items-center justify-center rounded-lg hover:shadow-md",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          !canScrollNext && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <LargeChevronRightIcon className="h-5 w-5 text-white/90" />
        <span className="sr-only">Next slide</span>
      </button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
};
