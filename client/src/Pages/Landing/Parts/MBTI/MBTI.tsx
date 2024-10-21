import cx from 'clsx';
import { Container, Flex, Text, Title } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './MBTI.module.scss';
import { useState } from 'react';

const data = [
  {
    symbol: 'Ne',
    name: 'Extraverted Intuition',
    description:
      'Способность обнаруживать новые возможности и взаимосвязи в окружающем мире.',
  },
  {
    symbol: 'Ni',
    name: 'Introverted Intuition',
    description:
      'Способность видеть глубинные значения и потенциальные развития в будущем.',
  },
  {
    symbol: 'Fe',
    name: 'Extraverted Feeling',
    description:
      'Осознание и реагирование на эмоции и потребности других людей, стремление создать гармонию в обществе.',
  },
  {
    symbol: 'Fi',
    name: 'Introverted Feeling',
    description:
      'Глубокое осознание и выражение собственных эмоций и ценностей.',
  },
  {
    symbol: 'Si',
    name: 'Introverted Sensing',
    description:
      'Ориентированность на опыт и воспоминания, стремление к стабильности и безопасности.',
  },
  {
    symbol: 'Se',
    name: 'Extraverted Sensing',
    description:
      'Осознание и взаимодействие с текущим окружающим миром, активная адаптация к нему.',
  },
  {
    symbol: 'Te',
    name: 'Extraverted Thinking',
    description:
      'Организация и рационализация внешнего мира, принятие решений на основе логики и фактов.',
  },
  {
    symbol: 'Ti',
    name: 'Introverted Thinking',
    description:
      'Глубокий анализ и стремление понять внутреннюю структуру и логику вещей.',
  },
];

const MBTI = () => {
  const [elementsE, setElementsE] = useState(
    data.filter((item) => item.symbol.endsWith('e'))
  );
  const [elementsI, setElementsI] = useState(
    data.filter((item) => item.symbol.endsWith('i'))
  );

  const isOpposite = (symbol1: any, symbol2: any) =>
    (symbol1.endsWith('e') && symbol2.endsWith('i')) ||
    (symbol1.endsWith('i') && symbol2.endsWith('e'));

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (destination && source.index !== destination.index) {
      const sourceList =
        source.droppableId === 'elementsE' ? elementsE : elementsI;
      const movedElement = sourceList.splice(source.index, 1)[0];

      const destinationList =
        destination.droppableId === 'elementsE' ? elementsE : elementsI;
      destinationList.splice(destination.index, 0, movedElement);

      if (
        isOpposite(
          movedElement.symbol,
          destinationList[destination.index].symbol
        )
      ) {
        destinationList.splice(destination.index, 1);
        setElementsI([...elementsI]);
      }

      if (source.droppableId === 'elementsE') {
        setElementsE([...elementsE]);
      } else {
        setElementsI([...elementsI]);
      }
    }
  };

  return (
    <Container className={classes.wrapper} pt={60}>
      <Title order={1} pb={25} style={{ textAlign: 'center' }}>
        Когнитивные функции
      </Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex gap={20} justify={'center'}>
          <Droppable droppableId='elementsE' direction='vertical'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {elementsE.map((item, index) => (
                  <Draggable
                    key={item.symbol}
                    index={index}
                    draggableId={item.symbol}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cx(classes.item, classes.fixedHeight, {
                          [classes.itemDragging]: snapshot.isDragging,
                        })}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Text className={classes.symbol}>{item.symbol}</Text>
                        <div>
                          <Text className={classes.mr}>{item.name}</Text>
                          {/* <Space w={20} /> */}
                          <Text c='dimmed' size='sm' className={classes.mr}>
                            {item.description}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId='elementsI' direction='vertical'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {elementsI.map((item, index) => (
                  <Draggable
                    key={item.symbol}
                    index={index}
                    draggableId={item.symbol}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cx(classes.item, classes.fixedHeight, {
                          [classes.itemDragging]: snapshot.isDragging,
                        })}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Text className={classes.symbol}>{item.symbol}</Text>
                        <div>
                          <Text className={classes.mr}>{item.name}</Text>
                          {/* <Space w={20} /> */}
                          <Text c='dimmed' size='sm' className={classes.mr}>
                            {item.description}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Flex>
      </DragDropContext>
    </Container>
  );
};

export default MBTI;
