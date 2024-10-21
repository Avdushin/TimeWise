import { Carousel } from '@mantine/carousel';
import Reviews from './Reviews';
import { Box, Title } from '@mantine/core';

const ReviewsCarousel = () => {
  return (
    <Box>
      <Title style={{textAlign: 'center', paddingTop: '50px',  paddingBottom: '20px'}}>Отзывы</Title>
      <Carousel height={200} slideSize='3000' slideGap='md' loop align='center'>
        <Carousel.Slide>
          <Reviews />
        </Carousel.Slide>
        <Carousel.Slide>
          <Reviews />
        </Carousel.Slide>
        <Carousel.Slide>
          <Reviews />
        </Carousel.Slide>
      </Carousel>
    </Box>
  );
};

export default ReviewsCarousel;
