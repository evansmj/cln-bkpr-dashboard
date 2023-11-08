import { writable } from "svelte/store"

export const PublicKeyStore = writable<string>()
export const RuneStore = writable<string>()