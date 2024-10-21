//? Layout Component - содержит компоненты виджетов по-умолчанию, которые необходимо отображать на каждой странице
import { Outlet } from 'react-router-dom';
import { NavbarMinimal as Sidebar } from '@/Components/Features/Layouts';
import { Container } from '@mantine/core';

//? showSidebar - регулирует нужно ли рендерить компонент <Sidebar />
//? noContainer - регулирует нужно ли рендерить <Container></Container>
// (По умолчанию <Sidebar> и <Container> отрисовываются)
/* Пример использоавния:
   <Layout showSidebar={false} noContainer={true}/>
*/
const Layout = ({ showSidebar = true, noContainer = false }) => {
  return (
    <>
      {showSidebar && <Sidebar />}
      {noContainer ? (
        <Outlet />
      ) : (
        <Container>
          <Outlet />
        </Container>
      )}
    </>
  );
};

export { Layout };
