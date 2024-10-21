//@ Dotenv variables
export const API_URL = import.meta.env.VITE_APP_API_URL;
export const APP_MODE = import.meta.env.VITE_REACT_APP_MODE;
export const SECRET = import.meta.env.SECRET;

//@ Перемнные с описанием приложения и источниками
export const APP = {
  NAME: 'TW',
  FULLNAME: 'Time Wise',
  VERSION: '0.0.1',
  AUTHOR: 'Audyushin Dobrynya <avdushinbeaver1@gmail.com>',
  DESCRIPTION:
    'TimeWise — универсальный инструмент для ретроспективного анализа и планирования будущих событий с интеграцией тайм-менеджмента',
  //! Стоит попробовать использовать в ссылках на источники метод `dns-prefetching`
  //* пример: <a rel="dns-prefetching" href={APP.GITHUB}></a>
  SOCIAL_MEDIA: {
    TELEGRAM: 'https://t.me/timewiseapp',
    AUTHOR_GITHUB: 'https://github.com/Avdushin',
    GITHUB: 'https://github.com/Avdushin/TimeWise',
  },
};
