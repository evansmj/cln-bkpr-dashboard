import type Lnmessage from 'lnmessage'
import { writable } from "svelte/store"

export const LnStore = writable<Lnmessage>()
