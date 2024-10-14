import { watchConfig, type WatchConfigOptions } from "c12"
import fs from 'fs-extra'
import { stringifyYAML } from 'confbox'
import { resolve } from 'path'
import { join } from 'path'
import { ZodError } from 'zod'
import * as crypto from 'crypto';
import { promises as fsPromises } from 'fs'
import type { ConfigSecrets } from "~~/modules/config/types/secrets"
import { defaultConfig } from "./default"
import { BaseConfigSchema, type BaseConfig } from "~~/modules/config/types/config"

const nuxtConfig = useRuntimeConfig()

fs.ensureDirSync(`${useRuntimeConfig().hosted.configPath}`)
if (!fs.existsSync(`${useRuntimeConfig().hosted.configPath}/config.yaml`)) {
    fs.writeFileSync(`${useRuntimeConfig().hosted.configPath}/config.yaml`, stringifyYAML(defaultConfig, { indent: 2 }))
}
const DefaultWatchOptions: WatchConfigOptions<BaseConfig> = {
    cwd: nuxtConfig.hosted.configPath,
    debounce: 100,
    // configFile: 'config.yaml',
    name: 'config',
    rcFile: false,
    dotenv: false,
    defaultConfig: {
        ...defaultConfig
    }
}

const _config = watchConfig({
    ...DefaultWatchOptions,
    async onWatch({ type, path }) {
        console.log(`config file ${path} - ${type}`)
        await checkConfig()
    },
    async onUpdate({ getDiff }) {
        const diff = getDiff()
        diff.map((change, i) => {
            console.log(`config file change ${i + 1} of ${diff.length}: ${change}`)
        })
        // await checkConfig()
    },
})

export const configPaths = {
    secrets: join(nuxtConfig.hosted.configPath, '.secrets.json'),
    ssh: join(nuxtConfig.hosted.configPath, '.ssh'),
    auth: join(nuxtConfig.hosted.configPath, '.auth/'),
    backups: {
        config: join(nuxtConfig.hosted.configPath, 'backups/config/'),
        instance: join(nuxtConfig.hosted.configPath, 'backups/instance/')
    },
    templates: join(nuxtConfig.hosted.configPath, 'templates/')
}

const useRawConfig = async () => {
    const config = await _config
    if (!config.config) {
        throw createError('No config found, creating a fresh config')
    }
    return config
}

export const useConfig = async (): Promise<BaseConfig> => {
    const { config } = await useRawConfig()
    if (!config) {
        throw createError('No config found, creating a fresh config')
    }
    return config
}

export const backupConfig = async (config: any, path: string) => {
    await fsPromises.writeFile(
        resolve(path, 'config.bak.yaml'),
        stringifyYAML(config, { indent: 2 }),
        'utf8'
    )
}

export const updateConfig = async (config: Omit<BaseConfig, 'secrets'>, path: string) => {
    try {
        BaseConfigSchema.parse(config)
        await fsPromises.writeFile(
            resolve(path, 'config.yaml'),
            stringifyYAML(config, { indent: 2 }),
            'utf8'
        )
        return config
    } catch (e) {
        if (e instanceof ZodError) {
            throw createError({ ...e })
        }
        throw createError('Unknown error writing config.')
    }
}

// Check to make sure the config exists. If it doesn't write a new default one.
export const checkConfig = async () => {
    const config = await useRawConfig()
    if (!config.cwd) throw createError('No directory defined for config')

    const configPath = resolve(config.cwd, 'config.yaml')
    try {
        await fsPromises.access(configPath)
    } catch {
        console.warn(`No config exists at ${config.cwd}, creating default config.`)
        return await updateConfig(defaultConfig, config.cwd)
    }

    try {
        BaseConfigSchema.parse(config.config)
        console.log(`Valid config exists at ${config.cwd}.`)
    } catch (e) {
        if (e instanceof ZodError) {
            await backupConfig(config.config, config.cwd)
            console.error(`Backing up config ${config.cwd}config.bak.yaml`)
            await updateConfig(defaultConfig, config.cwd)
            throw createError({ ...e })
        }
        throw createError('Unknown error validating config.')
    }
}

export const getSecrets = async (): Promise<ConfigSecrets> => {
    try {
        const secrets = await fsPromises.readFile(configPaths.secrets, 'utf8')
        const parsedSecrets = JSON.parse(secrets) as ConfigSecrets
        if (isValidSecrets(parsedSecrets)) {
            return parsedSecrets
        }
    } catch { }
    return generateSecretTokens()
}

const isValidSecrets = (secrets: any): secrets is ConfigSecrets => {
    return (
        secrets &&
        typeof secrets === 'object' &&
        typeof secrets.accessSecret === 'string' &&
        typeof secrets.refreshSecret === 'string' &&
        typeof secrets.authSecret === 'string' &&
        typeof secrets.passphraseSecret === 'object' &&
        typeof secrets.passphraseSecret.key === 'string' &&
        typeof secrets.passphraseSecret.iv === 'string'
    )
}

const generateSecretTokens = async (): Promise<ConfigSecrets> => {
    const secrets: ConfigSecrets = {
        authSecret: crypto.randomBytes(256).toString('base64'),
        accessSecret: crypto.randomBytes(256).toString('base64'),
        refreshSecret: crypto.randomBytes(256).toString('base64'),
        passphraseSecret: {
            key: crypto.randomBytes(32).toString('base64'),
            iv: crypto.randomBytes(16).toString('base64'),
        },
    }

    await fsPromises.writeFile(configPaths.secrets, JSON.stringify(secrets, null, 2))
    return secrets
}
