/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { Mission as MissionContainer } from '@els/client/app/mission/feature';

import { AuthGuard } from '@els/client/shared/components';
import { NextPageContext } from 'next';

export interface MissionListProps {}

export function MissionList(props: MissionListProps) {
  return <MissionContainer {...props} />;
}

MissionList.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

MissionList.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default MissionList;
