window.KILLTEAM_DATA = [
  {
    id: 'nemclaw',
    name: 'Nemesis Claw',
    tagline: 'We have come for you',
    updated: '14-11-2025',
    weapons: {
      'Individual Operatives': [
        'Fearmonger has blast 2" (limited 1) weapon',
        'Gunner has optional torrent 2" on weapon',
        'Heavy has optional blast 2" or torrent 1" on weapon',
      ],
    },
    impactsYou: {
      'Faction Rules / Equipment / Ploys': [
        'Firefight Ploy: Delay your ops activation if visible and D6> your APL.',
        'Firefight Ploy: Fight first but one resolve 1 success.',
        'Equipment: If within 2" of them you cant reroll a 1.',
        'Equipment: Can prevent you from falling back (on a dice roll).',
        'Equipment: Gives tokens for killing within 2", if 2" near token you get 1 less atk.',
        'Equipment: Stops ou getting APL within 3" of a nemclaw op.',
      ],
      'Individual Operatives': [
        'Screecher stops all attack rerolls within 3".',
        'When Skinthief kills, he selects 1 op within 6" to stop doing mission actions also during melee; dmg 3+ deals 1 less',
        {
          text: 'Ventrilokar, for 1AP targets within 6" get forced to either, Dash, -1AP, change order. Can only do each once per game.',
          important: true,
        },
      ],
    },
    impactsThem: {
      'Faction Rules / Equipment / Ploys': [
        'Rule: Shoot / Fight 2x times',
        'Rule: When shot they are obscured if 8" away and next to heavy or under vantage.',
        { text: 'Rule: Allow your ops in light cover to be valid targets', important: true },
        { text: 'Strategy Ploy: D3 dmg on charge', important: true },
        'Strategy Ploy: Can fall back 4".',
        {
          text: 'Firefight Ploy: If they kill you when fighting they can do a free 3" charge or dash.',
          important: true,
        },
      ],
      'Individual Operatives': [
        'Visionary can use Prescience points on himself to skip activations or just a scratch on normal damage.',
        'Fearmonger may give op a token when it crits, token does D3 dmg on activation.',
        'Fearmonger may give objective a token when, token does 2D3 dmg (like a mine).',
      ],
    },
  },
];
