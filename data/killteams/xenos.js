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
  {
    id: 'yaegirs',
    name: 'Hernkyn Yaegirs',
    tagline: 'For rock and stone!',
    updated: '14-11-2025',
    weapons: {
      Equipment: ['Add Blast 1" to Range 6" Shotguns'],
      'Individual Operatives': [
        'Tracker has silent, within 6" gains seek light and cant be obscured.',
        'Riflekyn has silent shot for its first shot',
        'Bladekyn has silent (limit 1) for its weapon',
        'Venomspitter has blast 2"',
      ],
    },
    impactsYou: {
      'Faction Rules / Equipment / Ploys': [
        { text: 'Strategy Ploy: All ops half your first damage.', important: true },
        'Firefight Ploy: When shooting at them, crits do normal damage.',
        { text: 'Strategy Ploy: Super Conceal.', important: true },
      ],
      'Individual Operatives': ['Theyn ignores 1st death and stays alive that with 1w.'],
    },
    impactsThem: {
      'Faction Rules / Equipment / Ploys': [
        'Rule: Resourceful points for ops to gain 1AP or heal D3+1.',
        'Rule: Before TP1 all ops can reposition.',
        'Firefight Ploy: Group activate up to 2 ops within 3".',
        'Firefight Ploy: WHen you charge them, someone else can interrupt within 6" to shoot you.',
      ],
      'Individual Operatives': [
        { text: 'Bladekyn can charge from conceal. Fights on death', important: true },
        'Ironrbraek lays 5 mines, 2 are fake. They do 3-6 dmg and ends your action, he can re-arm them.',
        'Bombast has a strat gambit where it can flip its order and shoot you, he can also reduce your APLT within 2" after killing an op.',
        'Warrior can use resourceful points to heal 4 or gain 1AP.',
      ],
    },
  },
];
