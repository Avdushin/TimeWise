//@ dev.log используется вместо console.log(), для того, чтобы логи были видны, только если в .env установлен редим `dev`
// ?Пример использования
// dev.log('Auth email:', Auth.email, 'Auth password:', Auth.password);
// dev.log(`Auth email: ${Auth.email} Auth password: ${Auth.password}`);

//@ Так же alias на проверку режима приложения
// ?ПриЯмер испльзоавния
// DevMode
// if (DevMode) => make something...

import { APP_MODE } from '@/Share/Variables';

export const DevMode = APP_MODE === 'dev';

/* The DevLogger class logs messages only in development mode. */
class DevLogger {
  log(...args: any[]): void {
    if (DevMode) {
      console.log(...args);
    }
  }
}

//@ Экземпляр класса для использования
const dev = new DevLogger();

export { dev };
