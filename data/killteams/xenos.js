window.KILLTEAM_DATA = [
  {
    id: 'vespid',
    name: 'Vespid Stingwings',
    tagline: 'Bzzzzz',
    updated: '14-11-2025',
    weapons: {
      'Individual Operatives': [
        'Swarmguard has torrent 2"',
        'Shadestrain and SkyBlast have blast 2"',
      ],
    },
    impactsYou: {
      'Faction Rules / Equipment / Ploys': [
        'Strategy Ploy: When shot at, roll a D6: on a 5+, ignore 1 normal damage.',
        'Strategy Ploy: Reduce all normal dmg of 4+ by 1.',
      ],
      'Individual Operatives': [
        'Shadestrain cannot be targeted if its concealed and more than 6" away.',
        'Drone cannot be targeted if in cover and concealed. Expect from within 2", also ignores piercing.',
      ],
    },
    // Example impacts as subcategories. Keys become subsection titles.
    impactsThem: {
      'Faction Rules / Equipment / Ploys': [
        'Rule: Lets them fly, IE teleport up to 6" as a move action.',
        { text: 'Rule: Piercing after fly.', important: true },
        { text: 'Strategy Ploy: Balanced after fly.', important: true },
        'Firefight Ploy: Gain vantage after fly.',
        'Firefight Ploy: When shooting neutron weapon within 4" a crit does +D3 dmg.',
        'Equipment: +1" to charge or dash all game',
      ],
      'Individual Operatives': [
        'Skyblast places a token whenever it shoots you within your CR. Each friendly activation within 2" takes D3 dmg.',
        'Swarmgaurd for 2AP can do 8" fly and shoot all ops it flew over.',
      ],
    },
  },
];
