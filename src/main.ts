import './assets/base.css'
import './assets/markdown/markdown.css'

import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './Marvinpedia.vue'
import WikiEntry from "@/components/WikiEntry.vue";
import NotFound from "@/components/NotFound.vue";
import WikiListings from "@/components/WikiListings.vue";
import WikiEntries from "@/components/WikiEntries.vue";

const routes = [
    {path: '/', component: WikiListings},
    {path: '/wiki/:wikiTopic', component: WikiEntries},
    {path: '/wiki/:wikiTopic/:wikiEntryName', component: WikiEntry},
    {path: '/:notFound(.*)', component: NotFound}
]

const router = createRouter({
    base: import.meta.env.VITE_BASE_URL,
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: routes
});

createApp(App)
    .use(router)
    .mount('#app')
