import { useEffect, useRef, useState } from 'react';
import { SxProps } from '@mui/system';
import { Box, Typography, useTheme, Avatar, TextField, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTranslation } from 'react-i18next';
import { useDetectClickOutside } from 'react-detect-click-outside';
import jsCookies from 'js-cookie';
import { fromNow } from '@els/client/shared/utils';
import { ButtonCustom } from '@els/client/app/shared/ui';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { HandleViewReactionListType, ReactCommentDataType, ReplyCommentDataType } from '../learning-page';


export interface CommentItemProps {
  comment: GraphqlTypes.LearningTypes.Comment;
  handleReplyComment: (data: ReplyCommentDataType) => void;
  handleReactComment: (data: ReactCommentDataType) => void;
  handleViewReactionList: (data: HandleViewReactionListType) => void;
  currentUser: GraphqlTypes.LearningTypes.User;
  sx?: SxProps;
}

const CommentItem = (props: CommentItemProps) => {
  const {
    comment,
    handleReplyComment,
    handleReactComment,
    currentUser,
    handleViewReactionList,
    sx,
  } = props;

  const { t }: { t: any } = useTranslation();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const theme = useTheme();

  const writeCommentingRef = useRef<any>();

  const [commentData, setCommentData] = useState<GraphqlTypes.LearningTypes.Comment>(comment);
  const [showSubComments, setShowSubComments] = useState(false);
  const [showWriteCommenting, setShowWriteCommenting] = useState(false);

  const refClickOutside = useDetectClickOutside({ onTriggered: () => setShowWriteCommenting(false) });

  const formStateInit = {
    message: '',
  };
  const [formState, setFormState] = useState(formStateInit);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setFormState(formStateInit);
    setShowWriteCommenting(false);
  };

  const handleReply = (commentId: string) => {
    if (!formState?.message?.trim()) return;

    handleReplyComment({
      parentId: commentId,
      text: formState.message,
    });

    if (!formState.message) return;

    setShowSubComments(true);

    setFormState(formStateInit);
  };

  const handleLike = (commentId: string) => {
    handleReactComment({
      commentId: commentId,
      emoji: 'like',
    });
  };

  useEffect(() => {
    setCommentData(comment);
  }, [comment]);

  // useEffect(() => {
  //   console.log(commentData);
  // }, [commentData]);

  // useEffect(() => {
  //   console.log(currentUser);
  // }, [currentUser]);

  return (
    <Box
      key={commentData._id}
      sx={{
        display: 'flex',
        ...sx,
      }}
    >
      {/* avatar */}
      <Avatar
        sx={{
          width: {
            xs: 40,
            md: 60,
          },
          height: {
            xs: 40,
            md: 60,
          },
          mr: {
            xs: 1,
            md: 1.5
          }
        }}
        src={commentData.user.identity?.traits.picture?.toString()}
      />
      {/* comment content */}
      <Box
        sx={{ width: '100%' }}
      >
        <Box
          ref={refClickOutside}
        >
          {/* content */}
          <Box
            sx={{
              width: 'fit-content',
              minWidth: '290px',
              position: 'relative',
              p: 1,
              borderRadius: '6px',
              backgroundColor: theme.colors.secondary.lighter,
            }}
          >
            {/* name + time */}
            <Box sx={{ display: 'flex', alignItems: 'end' }}>
              {/* name */}
              <Typography
                variant="inherit" children={`${commentData.user.identity?.traits.firstName} ${commentData.user.identity?.traits.lastName}`}
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: 1,
                  mr: 1,
                }}
              />
              {/* time */}
              {/* <Tooltip arrow placement="top" title={exactDateTime(new Date(commentData.createdAt), language)}> */}
              <Typography
                variant="inherit" children={fromNow({ time: new Date(commentData.createdAt), language: language})}
                sx={{
                  fontSize: '16 px',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: theme.colors.secondary.main,
                }}
              />
              {/* </Tooltip> */}
            </Box>
            {/* message */}
            <Typography
              variant="inherit" children={commentData.text}
              sx={{
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1,
                mt: 1,
                color: theme.colors.secondary.dark,
                pr: 3,
              }}
            />
            {/* likes */}
            { !!commentData.reactions.length && (<Box
              sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 0,
                right: 0,
                transform: 'translate(0%, 70%)',
                height: '24px',
                p: '4px 8px',
                borderRadius: '18px',
                boxShadow: theme.colors.shadows.card,
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
              onClick={() => {
                handleViewReactionList({
                  title: t('All'),
                  reactions: commentData.reactions,
                });
              }}
            >
              <ButtonCustom
                startIcon={
                  <ThumbUpIcon
                    sx={{
                      fontSize: '10px !important',
                      fill: '#8896ff',
                      stroke: '#ffffff',
                      strokeWidth: '2px',
                    }}
                  />
                }
                variant="contained"
                sx={{
                  p: 0,
                  width: '18px',
                  height: '18px',
                  minWidth: 'unset',
                  borderRadius: '50%',
                  mr: 0.5,
                }}
              />
              <Typography
                variant="inherit"
                sx={{
                  fontSize: '14px',
                  fontWeight: 300
                }}
                children={commentData.reactions.length}
              />
            </Box>
            )}
          </Box>
          {/* actions */}
          <Box
            sx={{
              mt: 1.5,
            }}
          >
            <ButtonCustom
              children={t('Like')} variant="text"
              sx={{
                fontSize: '16px',
                // fontWeight: commentData.reactions.findIndex(item => item.user.id === currentUser.account.current.user?.id) >= 0 ? 700 : 100,
                fontWeight: 700,
                lineHeight: 1,
                p: 0,
                minWidth: 'unset',
                backgroundColor: 'unset !important',
                mr: 1,
                color: commentData.reactions.findIndex(item => item.user.id === currentUser.id) >= 0 ? theme.colors.primary.main : theme.colors.secondary.main,
                '&:hover': {
                  color: theme.colors.primary.main,
                }
              }}
              onClick={() => handleLike(commentData._id)}
            />
            <ButtonCustom
              children={t('Reply')} variant="text"
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1,
                p: 0,
                minWidth: 'unset',
                backgroundColor: 'unset !important',
                color: theme.colors.secondary.main,
                '&:hover': {
                  color: theme.colors.primary.main,
                }
              }}
              onClick={() => {
                setShowWriteCommenting(!showWriteCommenting);
                setTimeout(() => {
                  writeCommentingRef.current.focus();
                }, 100);
              }}
            />
          </Box>
          {/* comment field */}
          <Collapse in={showWriteCommenting}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '800px',
                mt: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: {
                      xs: 40,
                      md: 60,
                    },
                    height: {
                      xs: 40,
                      md: 60,
                    },
                    mr: {
                      xs: 1,
                      md: 1.5
                    },
                  }}
                  alt={currentUser?.identity?.traits.firstName}
                  src={currentUser?.identity?.traits.picture?.toString()}
                />
                <TextField
                  multiline
                  maxRows={4}
                  value={formState.message}
                  onChange={handleChange}
                  variant="standard"
                  name="message"
                  fullWidth
                  inputRef={writeCommentingRef}
                  sx={{
                    '.MuiInputBase-root::before': {
                      borderBottom: `2px solid ${theme.palette.common.black}`,
                      opacity: 0.1,
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'end', mt: 0.5 }}>
                <ButtonCustom
                  variant="outlined"
                  color="inherit"
                  children={t('Cancel')}
                  onClick={handleCancel}
                  sx={{
                    mr: 1,
                    color: theme.colors.secondary.main,
                  }}
                />
                <ButtonCustom
                  variant="contained"
                  children={t('Reply')}
                  onClick={() => handleReply(commentData._id)}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>
        {/* sub comment */}
        { !!commentData.children?.length && (
          <Box
            sx={{
              mt: 1.5,
            }}
          >
            {/* toggle sub comment */}
            <ButtonCustom
              variant="text"
              color="inherit"
              children={`${t(showSubComments ? 'Hide' : 'See')} ${commentData.children?.length} ${t('answers')}`}
              onClick={() => setShowSubComments(!showSubComments)}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: '12px',
                    transform: showSubComments ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 500ms'
                  }}
                />
              }
              sx={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1,
                p: 0,
                minWidth: 'unset',
                backgroundColor: 'unset !important',
                mb: 1.5,
                '&:hover': {
                  color: theme.colors.primary.main,
                }
              }}
            />
            {/* sub comment */}
            <Collapse in={showSubComments}>
              <Box
                sx={{
                  borderLeft: `solid 2px ${theme.colors.primary.main}`,
                  pl: {
                    xs: 1,
                    md: 1.5,
                  },
                }}
              >
                {commentData.children.map((item, index) => {
                  return (
                    <CommentItem
                      key={item._id}
                      comment={item}
                      handleReplyComment={handleReplyComment}
                      handleReactComment={handleReactComment}
                      handleViewReactionList={handleViewReactionList}
                      currentUser={currentUser}
                      sx={{ mt: !index ? 0 : 1.5 }}
                    />
                  );
                })}
              </Box>
            </Collapse>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { CommentItem };
