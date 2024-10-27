import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Markdown({
            wrapperClasses: 'post-content'
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
