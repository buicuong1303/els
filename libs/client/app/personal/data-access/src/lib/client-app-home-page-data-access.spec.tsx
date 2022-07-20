import { render } from '@testing-library/react';

import ClientAppHomePageDataAccess from './client-app-home-page-data-access';

describe('ClientAppHomePageDataAccess', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientAppHomePageDataAccess />);
    expect(baseElement).toBeTruthy();
  });
});
