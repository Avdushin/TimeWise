import { Image, Accordion, Grid, Container, Title } from '@mantine/core';
import { faqData } from './data';
import image from '@/assets/parts/faq/faq.svg';
import classes from './FAQ.module.scss';

const FAQ = () => {
  return (
    <div className={classes.wrapper} id='faq'>
      <Container size='lg' pt={60}>
        <Grid id='faq-grid' gutter={50}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image src={image} alt='Frequently Asked Questions' />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={2} ta='left' className={classes.title}>
              Часто задаваемые вопросы
            </Title>

            <Accordion
              chevronPosition='right'
              defaultValue='reset-password'
              variant='separated'
            >
              {faqData.map((item) => (
                <Accordion.Item
                  key={item.id}
                  className={classes.item}
                  value={item.id}
                >
                  <Accordion.Control>{item.question}</Accordion.Control>
                  <Accordion.Panel>{item.answer}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default FAQ;
