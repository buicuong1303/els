import { render } from '@testing-library/react';

import ClientAppSettingDataAccess from './client-app-setting-data-access';

describe('ClientAppSettingDataAccess', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientAppSettingDataAccess />);
    expect(baseElement).toBeTruthy();
  });
});
