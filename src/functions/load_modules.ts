const modules = import.meta.glob('@/components/markdown/*.md', {eager: true})

export function getMetaData(): {} {
    return Object.values(modules)
        .map(value => {
            return {
                id: value.id,
                name: value.name,
                topic: value.topic,
                fileName: value.fileName
            }
        });
}

export function getComponent(fileName): any {
    return Object.values(modules)
        .find(component => fileName === component.fileName)
        .default;
}
