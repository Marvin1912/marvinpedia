import fm from "front-matter"

export const markDownBasedComponents = async () => {

    let mdComponents = [];

    for (const file in import.meta.glob('@/assets/markdown/*.md')) {
        let fileName = file.match(/\/([^\/]+)\.md$/)?.[1] ?? 'not-found';
        mdComponents.push({
            path: `/wiki/${fileName}`,
            name: fileName,
            displayName: fileName.replace(/-/g, ' '),
            component: async () => importFile(file),
            metaAttributes: await getMetaAttributes(file)
        })
    }

    return mdComponents;
}

const importFile = async (file) => {
    return await import(/* @vite-ignore */ file);
}

const getMetaAttributes = async (file) => {
    let x = await importFile(`${file}?raw`);
    let {attributes: frontmatter} = (fm(x.default));
    return frontmatter;
}
