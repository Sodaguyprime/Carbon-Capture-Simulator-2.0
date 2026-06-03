// Persists the last-used simulation inputs so the Results page (and the
// Simulation page) can be restored exactly as the user left them — even after
// a refresh or when navigating back without router state.

const STORAGE_KEY = 'ccs:lastInputs'

export function saveInputs(values) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    // localStorage unavailable (private mode / disabled) — fail silently
  }
}

export function loadInputs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupt or unavailable — fall through to null
  }
  return null
}
