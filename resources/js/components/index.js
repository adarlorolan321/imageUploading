/* eslint-disable import/namespace */
import * as globalComponents from './global';

const GlobalComponents = {
    install(app) {
        Object.keys(globalComponents).forEach(key => {
            app.component(key, globalComponents[key]);
        });
    },
}

export default GlobalComponents;