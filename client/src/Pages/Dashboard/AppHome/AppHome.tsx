import { Footer } from "@/Components/App/Routing";
import TaskList from "@/Components/Features/Tasks/TaskList";
import LifeCalendar from "@/Components/Features/LifeCalendar/LifeCalendar";
import { Grid } from "@mantine/core";
import { FC } from "react";

const AppHome: FC = () => {
  return (
    <div style={{ padding: "40px 0" }}>
      {/* <ActionsGrid />
      <Backlog /> */}
      <Grid>
        <Grid.Col span={8}>
          <LifeCalendar />
        </Grid.Col>
        <Grid.Col span={4}>
          <TaskList />
        </Grid.Col>
      </Grid>
      <Footer />
    </div>
  );
};

export default AppHome;
