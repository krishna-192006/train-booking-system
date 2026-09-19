export const CLASS_CONFIG = {
  "1A": {
    label: "AC First Class",
    berthsPerCoach: 24,
    prefix: "H",
    description: "2-Berth Coupes & 4-Berth Cabins, Premium AC"
  },
  "2A": {
    label: "AC 2 Tier",
    berthsPerCoach: 48,
    prefix: "A",
    description: "Spacious 2-Tier AC with Curtains"
  },
  "3A": {
    label: "AC 3 Tier",
    berthsPerCoach: 72,
    prefix: "B",
    description: "Comfortable 3-Tier AC Coach"
  },
  "SL": {
    label: "Sleeper",
    berthsPerCoach: 72,
    prefix: "S",
    description: "Non-AC Sleeper Coach"
  },
  "CC": {
    label: "AC Chair Car",
    berthsPerCoach: 72,
    prefix: "C",
    description: "Air-Conditioned Seating"
  },
  "EC": {
    label: "Exec. Chair Car",
    berthsPerCoach: 45,
    prefix: "E",
    description: "Executive Luxury Seating"
  }
};

export const getBerthType = (classCode, seatNumber) => {
  if (!seatNumber) return 'Unassigned';
  const code = (classCode || '').toUpperCase();
  
  if (code === '1A') {
    return seatNumber % 2 === 1 ? 'Lower' : 'Upper';
  } else if (code === '2A') {
    const rem = seatNumber % 6;
    if (rem === 1 || rem === 3) return 'Lower';
    if (rem === 2 || rem === 4) return 'Upper';
    if (rem === 5) return 'Side Lower';
    return 'Side Upper';
  } else {
    const rem = seatNumber % 8;
    if (rem === 1 || rem === 4) return 'Lower';
    if (rem === 2 || rem === 5) return 'Middle';
    if (rem === 3 || rem === 6) return 'Upper';
    if (rem === 7) return 'Side Lower';
    return 'Side Upper';
  }
};
