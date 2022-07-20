/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { TopicDetail as TopicDetailContainer } from '@els/client/app/topic/feature/detail';

import { AuthGuard } from '@els/client/shared/components';

// import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';

import { NextPageContext } from 'next';

export interface TopicDetailProps {
  // topic: GraphqlTypesLearningTypes.Topic;
}

export function TopicDetail(props: TopicDetailProps) {
  return <TopicDetailContainer {...props} />;
}

TopicDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

TopicDetail.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

// export async function getServerSideProps(context: any) {
//   // TODO get query from context
//   const { query } = context;

//   const apolloClient = await ApolloClient.initializeApollo();

//   const topicResponse = await apolloClient.query({
//     context: { serviceName: ApolloClient.ServiceName.Server },
//     query: GraphqlQueries.LearningQueries.Topic.GetMyTopicDetails,
//     variables: {
//       studentIds: [query.id]
//     }
//   });
//   const topic = topicResponse?.data?.myTopicDetails?.[0];
//   const topicData = superjson.serialize(user);

//   return {
//     props: {
//       topic: topicData.json,
//     }
//   };
// }

export default TopicDetail;
