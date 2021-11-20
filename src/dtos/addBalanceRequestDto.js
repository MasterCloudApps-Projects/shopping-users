class AddBalanceRequestDto {
  constructor({ amount }) {
    if (typeof amount === 'undefined' || amount === null) {
      throw new Error('Amount field is required');
    }

    if (typeof amount === 'string') {
      throw new Error('Amount must be a number');
    }

    if (amount <= 0) {
      throw new Error('Amount to add must be greater than 0');
    }

    return {
      amount,
    };
  }
}

module.exports = AddBalanceRequestDto;
