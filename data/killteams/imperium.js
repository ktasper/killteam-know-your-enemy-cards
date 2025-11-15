window.KILLTEAM_DATA = [
  {
    id: 'wolfscouts',
    name: 'Wolf Scouts',
    tagline: 'Furry Fury',
    archetypes: 'Seek & Destroy / Recon',
    updated: '14-11-2025',
    weapons: {
      'Individual Operatives': [
        'Priest Skjald has seek light, torrent 2", stun, saturate',
        'Frosteye has silent on all profiles',
        'Plasma Gunner has punishing if in the storm',
      ],
    },
    impactsYou: {
      'Faction Rules / Equipment / Ploys': [
        'Strategy Ploy: if you are in the storm you lose an atk dice when fighting (min 3).',
        'Strategy Ploy: They can deal D3+1 dmg after a fight/retaliation.',
        'Firefight Ploy: If you fight them, they can fight you back on your turn.',

        { text: 'Firefight Ploy: Seek light and anti obscured within 6"', important: true },
      ],
      'Individual Operatives': [
        'Pack Leader cannot die the first time and is left with 1 wound.',
        'Trapmaster can place a mine that deals 2D3+3 or 3D3+^ if in storm.',
        { text: 'The wolf can charge in the strategic phase.', important: true },
        'Frosteye can guard on any map, if in storm can do on conceal.',
      ],
    },
    impactsThem: {
      'Faction Rules / Equipment / Ploys': [
        'Rule: If in the storm hot does not affect them.',
        { text: 'Rule: If in storm can charge on conceal.', important: true },
        'Equipment: Lethal 5+ for all except Priest Skjald  and Lethal 4+ for Leader on melee attacks.',
        'Equipment: Turn 2 fails to a success when shooting,fighting or retaliating.',
        { text: 'Equipment: Once per TP reduce piercing by 1.', important: true },
        'Equipment: Once per fight they can reduce dmg by 1 on a single hit.',
      ],
      'Individual Operatives': [
        'Priest Skjald can move the storm / give it to someone to make them obscured within 3".',
        'Fangbearer gives all units; Ignore injury, Ignore APL Changes, Ignore Shock & Stun". Even if Fangbearer dies.',
        'Fangbearer can do a D3+3 heal in CR.',
      ],
    },
  },
];
