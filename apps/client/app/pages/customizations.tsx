/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { AuthGuard, ComingSoon as ComingSoonFeature } from '@els/client/shared/components';
import { NextPageContext } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const CUSTOMIZATIONS_PAGE_RELEASE_DATE = publicRuntimeConfig.CUSTOMIZATIONS_PAGE_RELEASE_DATE;

export interface CustomizationsProps {}

export function Customizations(props: CustomizationsProps) {
  return <ComingSoonFeature releaseDate={CUSTOMIZATIONS_PAGE_RELEASE_DATE} />;
}

Customizations.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

Customizations.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Customizations;
