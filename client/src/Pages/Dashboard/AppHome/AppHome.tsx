import {
  ActionsGrid,
  Backlog,
  Footer,
} from "@/Components/App/Routing";
import { FC } from "react";

const AppHome: FC = () => {
  return (
    <div style={{ padding: "40px 0" }}>
      <ActionsGrid />
      <Backlog />
      <Footer />
    </div>
  );
};

export default AppHome;
