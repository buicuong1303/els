import { clientAdminSharedDataAccess } from './client-admin-shared-data-access';

describe('clientAdminSharedDataAccess', () => {
  it('should work', () => {
    expect(clientAdminSharedDataAccess()).toEqual(
      'client-admin-shared-data-access'
    );
  });
});
