import { Accordion, Card, Flex, Text } from "@mantine/core";
import { backlogData } from "./backlogData";
import classes from "./Backlog.module.scss";
import { APP } from "@/Share/Variables";
import { dev } from "@/Utils";

const Backlog = () => {
  const VERSION = `Версия ${APP.VERSION}`;
  dev.log(VERSION);

  const items = backlogData.map((item) => (
    <Flex direction="column" key={item.value}>
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Control>{item.value}</Accordion.Control>
        <Accordion.Panel>{item.description}</Accordion.Panel>
      </Accordion.Item>
    </Flex>
  ));
  return (
    <>
      <Card
        withBorder
        radius="md"
        className={classes.card}
        mt={20}
        mb={{ sm: 80, base: 160 }}
      >
        <Flex justify="space-between" pb={10}>
          <Text className={classes.title} fw={800} mb={10} tt={"uppercase"}>
            Бэклог
          </Text>
        </Flex>
        <Accordion defaultValue={VERSION} classNames={classes}>
          {items}
        </Accordion>
      </Card>
    </>
  );
};

export default Backlog;
