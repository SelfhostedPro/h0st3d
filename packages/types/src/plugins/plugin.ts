
interface H0st3dPluginOptions {
    name: string,
    init?: (path: string) => void | Promise<void>,
}

export { type H0st3dPluginOptions }