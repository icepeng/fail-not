import { expressAdapter } from '../express-adapter';
import { AppRoutes } from './app.routes';

function bootstrap() {
    const app = expressAdapter(AppRoutes);

    app.listen(3000);
}

bootstrap();
