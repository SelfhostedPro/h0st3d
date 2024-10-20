import type { BaseConfig } from "../../types/config"

export const useClientConfig = () => {
    const clientConfig = useState<Pick<BaseConfig, 'plugins' | "auth" | "name" | "sessionTimeout"> | null>("client-config", () => null)
    return clientConfig
}