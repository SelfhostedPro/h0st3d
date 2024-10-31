import type { GetPlugin } from "@h0st3d/types"
// import type { H0st3dPlugin } from "@h0st3d/plugin"
import { createJiti, type Jiti } from "jiti"
import { copySync, readJSON } from "fs-extra/esm"
import type { PackageJson } from "type-fest"
import type { NuxtModule } from "nuxt/schema"

const dataPath = useRuntimeConfig().hosted.dataPath

export const installPlugin = async (plugin: GetPlugin) => {
    const downloadPath = `${dataPath}/downloads/plugins/${plugin.name}`
    const installPath = `${dataPath}/plugins/${plugin.name}`
    const server = useNitroApp()
    const meta = await readJSON(`${downloadPath}/package.json`) as PackageJson
    const entry = meta.module || meta.main

    const jiti = createJiti(`${downloadPath}/`)
    const { runCommand } = await jiti.import('citty') as typeof import('citty')
    const { build, prepare } = await jiti.import('@nuxt/module-builder') as typeof import('@nuxt/module-builder')
    const { main: nuxiPrepare } = await jiti.import('nuxi') as typeof import('nuxi')

    console.log(`Installing plugin ${plugin.name}\nAT: ${downloadPath}/dist`)
    await runCommand(nuxiPrepare, { rawArgs: [`prepare`, `--cwd`, `${downloadPath}/`] })
    await runCommand(prepare, { rawArgs: ['--cwd', `${downloadPath}/`] })
    await runCommand(build, { rawArgs: ['--cwd', `${downloadPath}/`] })

    copySync(`${downloadPath}/dist/`, installPath, { overwrite: true })
    console.log(`Plugin ${plugin.name} Copied\nFROM: ${downloadPath}\nTo: ${installPath}`)

    // const pluginFile = await jiti.import(`${plugin.path}/${entry}`) as NuxtModule
    // if (pluginFile == undefined) {
    //     throw createError('Plugin Undefined.')
    // }
}


