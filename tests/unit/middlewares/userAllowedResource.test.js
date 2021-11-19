const verifyPathIdWithAuthenticatedUser = require('../../../src/middlewares/userAllowedResource');

const USER_ROLE = 'USER_ROLE';
const ADMIN_ROLE = 'ADMIN_ROLE';

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

let mockedReq;
let mockedRes;
let mockedNext;

beforeEach(() => {
  mockedReq = mockRequest();
  mockedRes = mockResponse();
  mockedNext = jest.fn();
});

afterEach(() => {
  mockedReq = null;
  mockedRes = null;
  mockedNext = null;
});

describe('Authorization middleware tests', () => {
  test('Given a request without role When verify Then should return forbidden response', async () => {
    mockedReq.userId = 1;
    mockedReq.params = { id: '1' };
    const expectedResponse = { error: 'You don\'t have permission to access the resource' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedRes.status).toBeCalledWith(403);
    expect(mockedRes.send).toBeCalledWith(expectedResponse);
  });

  test('Given a request with admin role and different id param and logged userId When verify Then should call next', async () => {
    mockedReq.userId = 1;
    mockedReq.role = ADMIN_ROLE;
    mockedReq.params = { id: '2' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).toBeCalledTimes(1);
  });

  test('Given a request with user role and different id param and logged userId When verify Then should return forbidden response', async () => {
    mockedReq.userId = 1;
    mockedReq.role = USER_ROLE;
    mockedReq.params = { id: '2' };
    const expectedResponse = { error: 'You don\'t have permission to access the resource' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedRes.status).toBeCalledWith(403);
    expect(mockedRes.send).toBeCalledWith(expectedResponse);
  });

  test('Given a request with user role and same id param and logged userId When verify Then should call next', async () => {
    mockedReq.userId = 1;
    mockedReq.role = USER_ROLE;
    mockedReq.params = { id: '1' };

    verifyPathIdWithAuthenticatedUser(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).toBeCalledTimes(1);
  });
});
