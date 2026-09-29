import type { LabModule, ModuleStatus } from "../types";

/** Client-safe status accessor — treats missing as scaffold (honest default). */
export function moduleStatus(mod: LabModule | null | undefined): ModuleStatus {
  return mod?.status ?? "scaffold";
}

export function isReadyModule(mod: LabModule | null | undefined): boolean {
  return moduleStatus(mod) === "ready";
}

export function statusLabel(status: ModuleStatus): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "deprecated":
      return "Deprecated";
    default:
      return "Scaffold";
  }
}
