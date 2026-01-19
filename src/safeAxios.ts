import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { timeoutContext } from "./context";

/**
 * Axios instance that automatically attaches AbortSignal
 * from the current safe-timeout context (if present).
 */
export function createSafeAxios(
  config?: AxiosRequestConfig
): AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use((req) => {
    const ctx = timeoutContext.getStore();

    // Attach signal only if:
    // 1. we're inside withTimeout
    // 2. user didn't already provide one
    if (ctx?.controller && !req.signal) {
      req.signal = ctx.controller.signal;
    }

    return req;
  });

  return instance;
}
