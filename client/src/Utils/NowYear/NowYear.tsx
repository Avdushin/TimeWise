import type { FC } from 'react';

const NowYear: FC = () => {
  const currentYear = new Date().getFullYear();

  return <>{currentYear}</>;
};

export default NowYear;
