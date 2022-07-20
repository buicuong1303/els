/* eslint-disable @typescript-eslint/no-empty-interface */
import type { ReactElement } from 'react';

import { TopNavigationLayout } from '@els/client/app/shared/layouts';

import { TopicList as TopicListContainer } from '@els/client/app/topic/feature/list';

import { AuthGuard } from '@els/client/shared/components';

// import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';

import { NextPageContext } from 'next';

export interface TopicListProps {
  // topicList: GraphqlTypes.LearningTypes.Topic[];
  // enrollmentList: GraphqlTypes.LearningTypes.Enrollment[];
}

export function TopicList(props: TopicListProps) {
  return <TopicListContainer {...props} />;
}

TopicList.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthGuard>
      {/* <BoxedSidebarLayout>{page}</BoxedSidebarLayout> */}
      <TopNavigationLayout>{page}</TopNavigationLayout>
    </AuthGuard>
  );
};

TopicList.getInitialProps = async (ctx: NextPageContext) => {
  return {};
};

// export async function getServerSideProps(context: any) {
//   // TODO get query from context
//   const { query } = context;

//   const apolloClient = await ApolloClient.initializeApollo();

//   const topicsResponse = await apolloClient.query({
//     context: { serviceName: ApolloClient.ServiceName.Server },
//     query: GraphqlQueries.LearningQueries.Topic.GetTopics,
//     variables: {
//       pageNumber: 1,
//       limit: 100,
//     },
//   });
//   const topics = topicsResponse.data.topics.nodes ?? [];
//   const topicsData = superjson.serialize(topics);

//   const enrollmentResponse = await apolloClient.query({
//     context: { serviceName: ApolloClient.ServiceName.Server },
//     query: GraphqlQueries.LearningQueries.Topic.GetMyTopics,
//   });
//   const enrollments = [enrollmentResponse.data.enrollment] ?? [];
//   const enrollmentsData = superjson.serialize(enrollments);

//   return {
//     props: {
//       topicList: topicsData.json,
//       enrollmentList: enrollmentsData.json,
//     },
//   }
// }

export default TopicList;
