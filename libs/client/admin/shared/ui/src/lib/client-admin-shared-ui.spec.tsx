import { render } from '@testing-library/react';

import ClientAdminSharedUi from './client-admin-shared-ui';

describe('ClientAdminSharedUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientAdminSharedUi />);
    expect(baseElement).toBeTruthy();
  });
});
