const AddBalanceRequestDto = require('../../../src/dtos/addBalanceRequestDto');
const { NoErrorThrownError, getError } = require('../errors/noErrorThrownError');

describe('userRequestDto tests', () => {
  test('Given less than 0 amount When call constructor Then should throw an error', async () => {
    const error = await getError(async () => new AddBalanceRequestDto({ amount: -0.1 }));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', 'Amount to add must be greater than 0');
  });

  test('Given equals to 0 amount When call constructor Then should throw an error', async () => {
    const error = await getError(async () => new AddBalanceRequestDto({ amount: 0 }));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', 'Amount to add must be greater than 0');
  });

  test('Given greater than 0 amount When call constructor Then should return DTO object', async () => {
    const addBalanceRequestDto = new AddBalanceRequestDto({ amount: 0.01 });

    expect(addBalanceRequestDto.amount).toBe(0.01);
  });
});
