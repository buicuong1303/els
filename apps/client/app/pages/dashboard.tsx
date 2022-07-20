/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { AuthGuard, ComingSoon as ComingSoonFeature } from '@els/client/shared/components';

// import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';

import { NextPageContext } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const DASHBOARD_PAGE_RELEASE_DATE = publicRuntimeConfig.DASHBOARD_PAGE_RELEASE_DATE;

export interface DashboardProps {
  // user: GraphqlTypes.LearningTypes.User;
}

export function Dashboard(props: DashboardProps) {
  return <ComingSoonFeature releaseDate={DASHBOARD_PAGE_RELEASE_DATE} />;
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

// export async function getServerSideProps(context: any) {
//   // TODO get query from context
//   const { query } = context;

//   const apolloClient = await ApolloClient.initializeApollo();

//   const userResponse = await apolloClient.query({
//     query: GraphqlQueries.LearningQueries.Topic.GetUser,
//     variables: {
//       userId: '3226d365-eb92-499c-9de4-3f2f5c68a536',
//     },
//   });
//   const user = userResponse.data.user ?? {};
//   const userData = superjson.serialize(user);

//   return ApolloClient.addApolloState(apolloClient, {
//     props: {
//       user: userData.json,
//     },
//   });
// }

export default Dashboard;

