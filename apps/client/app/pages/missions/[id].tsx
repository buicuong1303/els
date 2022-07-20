/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { AuthGuard, ComingSoon as ComingSoonFeature } from '@els/client/shared/components';
import { NextPageContext } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const MISSION_DETAILS_PAGE_RELEASE_DATE = publicRuntimeConfig.MISSION_DETAILS_PAGE_RELEASE_DATE;

export interface MissionDetailsProps {}

export function MissionDetails(props: MissionDetailsProps) {
  return <ComingSoonFeature releaseDate={MISSION_DETAILS_PAGE_RELEASE_DATE} />;
}

MissionDetails.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

MissionDetails.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default MissionDetails;
