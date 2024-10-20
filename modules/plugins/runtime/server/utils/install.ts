import type { GetPlugin } from "@h0st3d/types"
import type { H0st3dPlugin } from "@h0st3d/plugin"
import { createJiti } from "jiti"
import { readJSON } from "fs-extra/esm"
import { existsSync } from 'fs'
import type { PackageJson } from "type-fest"
import { buildPlugin } from "./build"

const dataPath = useRuntimeConfig().hosted.dataPath

export const installPlugin = async (plugin: GetPlugin,) => {
    // const server = useNitroApp()
    const meta = await readJSON(`${plugin.path}/package.json`) as PackageJson
    const entry = meta.module || meta.main

    const buildExists = existsSync(`${plugin.path}/${entry}`)
    if (!buildExists) {
        await buildPlugin(plugin)
    }
    const jiti = createJiti(`${dataPath}/plugins/${plugin.name}/`, { debug: true, })

    const pluginFile = await jiti.import(`${plugin.path}/${entry}`) as H0st3dPlugin

    await pluginFile._init(`${dataPath}/plugins/${plugin.name}`)
    console.log(pluginFile)
}


