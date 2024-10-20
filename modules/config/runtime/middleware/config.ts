import { useClientConfig } from "../composables/client-config";

export default defineNuxtRouteMiddleware(async (_to, _from) => {
    if (import.meta.client) return
    const clientConfig = useClientConfig()
    try {
        const data = await $fetch<BaseConfig>("/api/config");
        if (data) {
            clientConfig.value = data;
        }
    } catch (e) {
        console.error(e)
        // useToast({ title: 'Configuration Error', message: 'not able to configuration information. Please check logs.', level: 'error', dedupe: false })
        return await navigateTo({ path: '/' }, { replace: true })
    }
})
