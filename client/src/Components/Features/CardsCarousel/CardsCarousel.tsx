import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme, rem } from '@mantine/core';
import { Card } from './Card/Card';
import { data } from './Card/cardsdata';

export const CardsCarousel = () => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={{ base: '100%', sm: '50%' }}
      slideGap={{ base: rem(2), sm: 'xl' }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
    >
      {slides}
    </Carousel>
  );
}