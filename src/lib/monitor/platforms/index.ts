/**
 * Platform Registry — central place to register and access all platform adapters
 * P0: MiniMax (主力真实 API) + DeepSeek + Kimi + 文心一言
 */

import { PlatformAdapter } from "./base";
import { MinimaxAdapter } from "./minimax";
import { DoubaoAdapter } from "./doubao";
import { DeepSeekAdapter } from "./deepseek";
import { KimiAdapter } from "./kimi";
import { WenxinAdapter } from "./wenxin";

export type { PlatformAdapter, MonitorQuery, MonitorResult } from "./base";

// All registered platform adapters
const adapters: Record<string, PlatformAdapter> = {
  minimax: new MinimaxAdapter(),
  doubao: new DoubaoAdapter(),
  deepseek: new DeepSeekAdapter(),
  kimi: new KimiAdapter(),
  wenxin: new WenxinAdapter(),
};

export function getAdapter(platformKey: string): PlatformAdapter | null {
  return adapters[platformKey] ?? null;
}

export function getAllAdapters(): PlatformAdapter[] {
  return Object.values(adapters);
}

/**
 * P0 platforms: MiniMax (真实 API, 主力) + DeepSeek + Kimi + 文心一言 + 豆包
 */
export function getP0Adapters(): PlatformAdapter[] {
  return [
    adapters.minimax,
    adapters.deepseek,
    adapters.kimi,
    adapters.wenxin,
    adapters.doubao,
  ].filter(Boolean);
}
