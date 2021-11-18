class AddBalanceRequestDto {
  constructor({ amount }) {
    if (amount <= 0) {
      throw new Error('Amount to add must be greater than 0');
    }

    return {
      amount,
    };
  }
}

module.exports = AddBalanceRequestDto;
