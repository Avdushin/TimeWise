import { PathsDashboard } from "@/Components/App/Routing";
import { Card, Text, Button, Center } from "@mantine/core";
import { Link } from "react-router-dom";

const DevPage = () => {
  return (
    <Center style={{ height: "100vh" }}>
      <Card shadow="lg" style={{ maxWidth: 400, padding: 20 }}>
        <Text ta="center" size="lg" fw={700} mb={10}>
          Данная страница находится в разработке
        </Text>
        <Text ta="center" mb={20}>
          Следите за новостями проекта
        </Text>
        <Button fullWidth component={Link} to={PathsDashboard.Main}>
          На главную
        </Button>
      </Card>
    </Center>
  );
};

export default DevPage;
