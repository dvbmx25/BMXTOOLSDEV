// maps-data.js
// Hardcoded "seed" maps. These are read-only in the UI.
// Add/edit entries here — they show up in BMX Maps automatically.

const BMX_SEED_MAPS = [
  {
    id: 'seed-cali-dirt',
    name: 'California Dirt Jumps',
    description: 'The classics.',
    pins: [
      { kind: 'dirt', x: 12.4, y: 41.2, title: 'Shell Road', description: 'Flowy lines, big doubles.' },
      { kind: 'dirt', x: 14.1, y: 44.8, title: 'Pleasanton',  description: 'Progressive sets.' }
    ]
  },
  {
    id: 'seed-ama-nationals',
    name: 'AMA National Tracks',
    description: 'Every track on the national circuit.',
    pins: [
      { kind: 'track', x: 62.1, y: 38.5, title: 'Louisville' },
      { kind: 'track', x: 68.4, y: 41.0, title: 'Desoto' },
      { kind: 'track', x: 74.2, y: 33.1, title: 'Rock Hill' }
    ]
  },
  {
    id: 'seed-pump-tour',
    name: 'Pump Track Tour',
    description: 'Some of the best pump tracks in the country.',
    pins: [
      { kind: 'pump', x: 30.0, y: 55.0, title: 'Springfield' },
      { kind: 'pump', x: 45.5, y: 60.2, title: 'Bentonville' }
    ]
  }
];