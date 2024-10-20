import type { BaseConfig } from "../../../types/config.js";


export const defaultConfig: BaseConfig = {
    name: 'Hosted',
    auth: true,
    plugins: {
        providers: [],
        installed: [],
    },
    sessionTimeout: 60 * 60 * 24,
}