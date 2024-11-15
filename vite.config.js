import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import Inspect from 'vite-plugin-inspect'
import fm from 'front-matter'
import fs from 'fs';
import path from 'path';

export default defineConfig({
    base: '/marvinpedia',
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Markdown({
            wrapperClasses: 'post-content'
        }),
        Inspect(),
        {
            name: 'vite:markdown-meta',
            async transform(src, id) {
                if (/\.meta$/.test(id)) {
                    let markdownMetaData = fs.readdirSync(path.dirname(id))
                        .filter(file => file.endsWith('.md'))
                        .map(file => {
                            let fileContent = fs.readFileSync(`${path.dirname(id)}/${file}`, 'utf8');
                            const {attributes: metaData} = fm(fileContent);
                            return metaData;
                        });
                    return {
                        code: `export default ${JSON.stringify(markdownMetaData)}`
                    }
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
