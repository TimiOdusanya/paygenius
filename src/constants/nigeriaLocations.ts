import nigeriaLgas from './nigeria-lgas.json';

export type NigeriaStateLgas = Record<string, string[]>;

export const NIGERIA_STATE_LGAS = nigeriaLgas as NigeriaStateLgas;

export const NIGERIA_STATES = Object.keys(NIGERIA_STATE_LGAS).sort((a, b) =>
  a.localeCompare(b)
);

export function getLgasForState(state: string): string[] {
  if (!state) return [];
  return NIGERIA_STATE_LGAS[state] ?? [];
}
