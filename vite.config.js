import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import Inspect from 'vite-plugin-inspect'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)

export default defineConfig({
    base: '/marvinpedia',
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Markdown({
            wrapperClasses: 'post-content',
            markdownItOptions: {
                highlight: function (str, lang) {
                    let result;

                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            result = hljs.highlight(str, { language: lang, ignoreIllegals: true });
                        } catch (__) {
                            result = hljs.highlightAuto(str);
                        }
                    } else {
                        result = hljs.highlightAuto(str);
                    }

                    const detectedLang = result.language || lang || 'text';

                    return `<pre class="hljs" data-language="${detectedLang}"><code class="hljs language-${detectedLang}">` +
                           result.value +
                           '</code></pre>';
                }
            }
        }),
        Inspect()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
