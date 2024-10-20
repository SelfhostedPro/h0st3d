import type { GetPlugin } from "@h0st3d/types"

export const getPlugins = async (): Promise<GetPlugin[]> => {
    const config = await useConfig()
    return config.plugins.installed as GetPlugin[]
}

export const getPlugin = async (name: string): Promise<GetPlugin | undefined> => {
    const config = await useConfig()
    return config.plugins.installed.find(p => p.name === name)
}




