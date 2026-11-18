import type { SceneFn } from "../engine";
import { liveSite } from "./live-site";
import { title } from "./title";

// Registra aquí cada escena nueva.
export const scenes: Record<string, SceneFn> = { title, liveSite };
