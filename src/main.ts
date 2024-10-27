import './assets/base.css'
import './assets/markdown/markdown.css'

import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './Marvinpedia.vue'

import WikiEntries from "@/components/WikiEntries.vue";
import WikiEntry from "@/components/WikiEntry.vue";
import NotFound from "@/components/NotFound.vue";

const routes = [
    {path: '/', component: WikiEntries},
    {path: '/wiki/:wikiEntryName', component: WikiEntry},
    {path: '/:notFound(.*)', component: NotFound}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

createApp(App)
    .use(router)
    .mount('#app')
