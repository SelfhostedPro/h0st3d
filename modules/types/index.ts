import { addImportsDir, addServerImportsDir, createResolver, defineNuxtModule } from "nuxt/kit"

export default defineNuxtModule({
    meta: { name: 'config' },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)
        addImportsDir(resolver.resolve('types'))
        addServerImportsDir(resolver.resolve('types'))
    }
})