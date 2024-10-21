import Footer from '@/Components/Features/Layouts/Footer/Footer';
import Header from '@/Components/Features/Layouts/Header/Header';
import { Container, Space } from '@mantine/core';
import { FC } from 'react';
import { FAQ, Features, GetInTouch, Hero, MBTI } from '@Components/App/Routing';
import ReviewsCarousel from './Parts/Reviews/ReviewsCarousel';
import styles from './Landing.module.scss';
import TopScroll from '@Components/Features/Affix/Affix';

const Landing: FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Container size='xl' className={styles.features_wrapper}>
        <Features />
        <MBTI />
        <FAQ />
      </Container>
      <Container className={styles.reviews_wrapper}>
        <ReviewsCarousel />
        <Space h={70} />
        <GetInTouch />
      </Container>
      <Footer />
      <TopScroll />
    </>
  );
};

export default Landing;


// import Footer from '@/Components/Features/Layouts/Footer/Footer';
// import Header from '@/Components/Features/Layouts/Header/Header';
// import { Container, Space } from '@mantine/core';
// import { FC } from 'react';
// import {
//   FAQ,
//   Features,
//   GetInTouch,
//   Hero,
//   MBTI,
// } from '@Components/App/Routing';
// import ReviewsCarousel from './Parts/Reviews/ReviewsCarousel';
// import styles from './Landing.module.scss';
// import TopScroll from '@Components/Features/Affix/Affix';

// const Landing: FC = () => {
//   return (
//     <>
//       <Header />
//       <Hero />
//       {/* <Space h={70} /> */}
//       <MBTI />
//       {/* <Reviews /> */}
//       <Container size='xl' className={styles.features_wrapper} >
//         <Features />
//         <FAQ />
//       </Container>
//       <Container className={styles.reviews_wrapper}>
//         <ReviewsCarousel />
//         <Space h={70} />
//         <GetInTouch />
//       </Container>
//       <Footer />
//       <TopScroll />
//     </>
//   );
// };

// export default Landing;
