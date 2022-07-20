import { gql } from '@apollo/client';

export const WriteComment = gql`
  mutation Create($createCommentInput: CreateCommentInput!) {
    comment {
      create(CreateCommentInput: $createCommentInput) {
        _id
      }
    }
  }
`;
// {
//   createCommentInput: {
//     entityId: "e579c227-c73e-403a-839e-2283355d41c3",
//     entityName: "topic",
//     category: "comment" | "evaluation",
//     rating: 0,
//     text: "This new comment",
//   }
// }

export const ReplyComment = gql`
  mutation Reply($replyCommentInput: ReplyCommentInput!) {
    comment {
      reply(replyCommentInput: $replyCommentInput) {
        _id
      }
    }
  }
`;
// {
//   replyCommentInput: {
//     entityId: "e579c227-c73e-403a-839e-2283355d41c3",
//     entityName: "topic",
//     parentId: "620f5ebb2c1acf6fef833595",
//     text: "This new comment",
//   }
// }


export const ReactComment = gql`
  mutation React($reactCommentInput: ReactCommentInput!) {
    comment {
      react(reactCommentInput: $reactCommentInput) {
        _id
      }
    }
  }
`;
// {
//   reactCommentInput: {
//     "commentId": "e579c227-c73e-403a-839e-2283355d41c3",
//     "emoji": "like"
//   }
// }