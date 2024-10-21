//@ts-nocheck
import { Paper, Text, Title, Button } from '@mantine/core';
import classes from './CardsCarousel.module.scss';
import { Link } from 'react-router-dom';

interface CardProps {
    image: string;
    title: string;
    category: string;
    url?: string | undefined;
  }
  
  export const Card = ({ image, title, category, url }: CardProps) => {
    return (
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ backgroundImage: `url(${image})` }}
        className={classes.card}
        h="80%"
      >
        <div>
          <Text className={classes.category} size="xs">
            {category}
          </Text>
          <Title order={3} className={classes.title}>
            {title}
          </Title>
        </div>
        <Link to={url}>
        <Button variant="white" color="dark">
          Подробнее
        </Button>
        </Link>
      </Paper>
    );
  }