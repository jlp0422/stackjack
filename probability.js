const odds = {
  4: {
    2: 'Hit',
    3: 'Hit',
    4: 'Hit',
    5: 'Hit',
    6: 'Hit',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  5: {
    2: 'Hit',
    3: 'Hit',
    4: 'Hit',
    5: 'Hit',
    6: 'Hit',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  6: {
    2: 'Hit',
    3: 'Hit',
    4: 'Hit',
    5: 'Hit',
    6: 'Hit',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  7: {
    2: 'Hit',
    3: 'Hit',
    4: 'Hit',
    5: 'Hit',
    6: 'Hit',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  8: {
    2: 'Hit',
    3: 'Hit',
    4: 'Hit',
    5: 'Hit',
    6: 'Hit',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  9: {
    2: 'Hit',
    3: 'Double Down',
    4: 'Double Down',
    5: 'Double Down',
    6: 'Double Down',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  10: {
    2: 'Double Down',
    3: 'Double Down',
    4: 'Double Down',
    5: 'Double Down',
    6: 'Double Down',
    7: 'Double Down',
    8: 'Double Down',
    9: 'Double Down',
    10: 'Hit',
    11: 'Hit',
  },
  11: {
    2: 'Double Down',
    3: 'Double Down',
    4: 'Double Down',
    5: 'Double Down',
    6: 'Double Down',
    7: 'Double Down',
    8: 'Double Down',
    9: 'Double Down',
    10: 'Double Down',
    11: 'Hit',
  },
  12: {
    2: 'Hit',
    3: 'Hit',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  13: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  14: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  15: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  16: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Hit',
    8: 'Hit',
    9: 'Hit',
    10: 'Hit',
    11: 'Hit',
  },
  17: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Stand',
    8: 'Stand',
    9: 'Stand',
    10: 'Stand',
    11: 'Stand',
  },
  18: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Stand',
    8: 'Stand',
    9: 'Stand',
    10: 'Stand',
    11: 'Stand',
  },
  19: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Stand',
    8: 'Stand',
    9: 'Stand',
    10: 'Stand',
    11: 'Stand',
  },
  20: {
    2: 'Stand',
    3: 'Stand',
    4: 'Stand',
    5: 'Stand',
    6: 'Stand',
    7: 'Stand',
    8: 'Stand',
    9: 'Stand',
    10: 'Stand',
    11: 'Stand',
  },
}

export const getHint = (playerValue, dealerValue ) => {
  return odds[playerValue][dealerValue]
}
