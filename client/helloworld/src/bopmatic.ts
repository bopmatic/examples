type EnvMapType = {
    [id: string]: string;
}

declare global {
  interface Window {
    bopmatic_config: EnvMapType;
  }
}

export function BopmaticConfig(id: string): string {
  return window.bopmatic_config[id] || '';
}
