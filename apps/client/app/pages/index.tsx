/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';
import {
  TopNavigationLayout,
} from '@els/client/app/shared/layouts';
import { Personal as PersonalContainer } from '@els/client-app-personal-feature';
import { AuthGuard } from '@els/client/shared/components';

import { NextPageContext } from 'next';

export interface PersonalProps {
  // user: GraphqlTypes.LearningTypes.User;
}
export function Personal(props: PersonalProps) {
  return <PersonalContainer {...props} />;
}

Personal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

Personal.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default Personal;
