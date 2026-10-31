# Architecture rules
- Keep legacy lesson components behind a shared lesson registry and stable router paths; this preserves identities while allowing additive curriculum.
- Practice is deterministic synthetic evidence only, with local progress stored under a versioned key; no shell, radio, or model execution is exposed.
- Local progress and theme are device-only preferences, not accounts or shared learner records; this avoids implying server persistence.
- Archived disruptive scripts are displayed only as disabled review artifacts, with original teaching context retained; operational approval requires a separate isolated hardware validation.
- All new learning sources carry a review date and validation boundary; edition naming must not imply future tool releases.
- Use Bun with the committed text bun.lock as the single dependency workflow; avoid competing lock graphs and review Vite upgrades separately for plugin compatibility.
