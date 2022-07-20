/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { TopicOverview as TopicOverviewContainer } from '@els/client/app/topic/feature/overview';

import { AuthGuard } from '@els/client/shared/components';

// import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { NextPageContext } from 'next';

export interface TopicOverviewProps {
  // topic: GraphqlTypesLearningTypes.Topic;
}

export function TopicOverview(props: TopicOverviewProps) {
  return <TopicOverviewContainer {...props} />;
}

TopicOverview.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

TopicOverview.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

export default TopicOverview;
