import { CarouselProps, NCarousel } from 'naive-ui'

export type CarouselInstance = InstanceType<typeof NCarousel>

export type UCarouselProps = CarouselProps

const UCarousel = NCarousel

UCarousel.name = 'UCarousel'

export default UCarousel
