import './bootstrap';
import '../css/app.css';
import 'animate.css';


import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
// eslint-disable-next-line import/no-unresolved
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
import '@/@fake-db/db'
import '@/@iconify/icons-bundle'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import '@/plugins/icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { loadFonts } from '@/plugins/webfontloader'
import { abilitiesPlugin } from '@casl/vue'
// eslint-disable-next-line import/no-unresolved
import '@core-scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import TableHeader from "@core/components/TableHeader.vue";
import { can } from '@layouts/plugins/casl'
import router from '@/router'
import GlobalComponents from '@/components';

loadFonts()

const VITE_NOCAPTCHA_SITEKEY =
    import.meta.env.VITE_NOCAPTCHA_SITEKEY;

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';
const fieldHasError = (errors, id) => errors?.some(e => e.id == id) ? 'input' : 'submit';
const clearSelect = (form, name) => {
    form[name] = null;
    form.clearErrors(name);
};

const goBack = $event => {
    if (window.history.length && window.history.length > 1) {
        return window.history.back();
    }

    return InertiaRouter.visit('/');
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`,
        import.meta.glob('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        // eslint-disable-next-line vue/component-api-style
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(vuetify)
            .use(GlobalComponents)
            .use(createPinia())
            .use(layoutsPlugin)
            .use(TableHeader)
            .component('FontAwesomeIcon', FontAwesomeIcon)
            .use(i18n)
            .mixin({ methods: { can, fieldHasError, clearSelect, goBack } })
            .use(abilitiesPlugin, ability, {
                useGlobalProperties: true,
            })

            // .use(VueRecaptcha, {
            //   siteKey: VITE_NOCAPTCHA_SITEKEY,
            //   alterDomain: false, // default: false
            // })
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});