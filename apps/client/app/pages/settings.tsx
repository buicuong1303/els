/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { AuthGuard } from '@els/client/shared/components';

import { Setting as SettingContainer } from '@els/client/app/setting/feature';

// import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';

import { NextPageContext } from 'next';
export interface SettingProps {
  // user: GraphqlTypes.LearningTypes.User;
}

export function Setting(props: SettingProps) {
  return <SettingContainer {...props} />;
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

Setting.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

// export async function getServerSideProps(context: any) {
//   // TODO get query from context
//   const { query } = context;

//   const apolloClient = await ApolloClient.initializeApollo();

//   const userResponse = await apolloClient.query({
//     context: { serviceName: ApolloClient.ServiceName.Server },
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

export default Setting;