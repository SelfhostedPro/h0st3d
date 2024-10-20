export default defineNitroPlugin(async () => {
    const config = await useConfig()
    if (config.plugins.installed.length == 0) {
        console.log('No plugins installed')
        return
    } else {
        console.log(`Installed Plugins (${config.plugins.installed.length}):`)
        const providerList = config.plugins.providers.map(provider => {
            const providerPlugins = config.plugins.installed.filter(plugin => plugin.provider == provider.name).map(plugin => plugin.name)
            return { provider: provider.name, plugins: providerPlugins.join(', ') }
        })
        console.table(providerList, ['provider', 'plugins'])
    }
})