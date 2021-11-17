const verifyPathIdWithAuthenticatedUser = require('../../../src/middlewares/userAllowedResource');

describe('Authorization middleware tests', () => {
  const mockRequest = () => {
    const req = {};
    return req;
  };

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockedReq = mockRequest();
  const mockedRes = mockResponse();
  const mockedNext = jest.fn();

  test('Given a request with different id param and logged userId When verify Then should return forbidden response', async () => {
    mockedReq.userId = 1;
    mockedReq.params = { id: '2' };
    const expectedResponse = { error: 'You don\'t have permission to access the resource' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedRes.status).toBeCalledWith(403);
    expect(mockedRes.send).toBeCalledWith(expectedResponse);
  });

  test('Given a request with same id param and logged userId When verify Then should call next', async () => {
    mockedReq.userId = 1;
    mockedReq.params = { id: '1' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).toBeCalledTimes(1);
  });
});
