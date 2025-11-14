window.KILLTEAM_DATA = [
  {
    id: 'aod',
    name: 'Angels of Death',
    tagline: 'Lorus ipsum dolor',
    updated: '2025-06-01',
    // Example showing optional subcategories for `weapons` (new format).
    // Backwards-compatible: consumers may still use an array of strings.
    weapons: {
      'Individual Operatives': [
        'Blast 2" on sniper',
        { text: 'Sniper perma silent', important: true },
      ],
      'Faction Rules / Equipment / Ploys': [
        'Consectetur elit lorus sprayus torrentis.',
        'Adipiscing lorus grenadus et objective clearus.',
      ],
    },
    impactsYou: [
      'Lorus ipsum aegis planus overcommitus.',
      'Vestibulum tacticus mutatio lorus observare.',
      'Suspendisse lorus slowus ad finem turni.',
    ],
    // Example impacts as subcategories. Keys become subsection titles.
    impactsThem: {
      'Board Control': [
        'Curabitur lorus boardus controllus deniare.',
        'Mauris lorus splitus engagement reducere synergiam.',
      ],
      'Mission Pressure': ['Integer lorus actiones missionis difficilior factus.', 'HELLO'],
    },
  },
];
