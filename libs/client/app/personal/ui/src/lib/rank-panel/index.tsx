/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import {
  Avatar,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import {
  ButtonCustom,
  Loading,
  LoadingData,
  ReactVirtualizedTable,
} from '@els/client/app/shared/ui';
import { Slide } from 'react-slideshow-image';

const Dot = styled(Box)(
  ({ theme }) => `
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    // color: #ffffff;
    color: ${theme.colors.alpha.black[100]};
    border-radius: 50%;
    background-color: '#ffffff';
    font-size: 12px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(50%, 0%);
  `
);
interface RankQueryPaginationType {
  name: string;
  pageNumber: number;
  limit: number;
}

export interface RankPanelProps {
  rankTypes: GraphqlTypes.LearningTypes.RankType[];
  slideProperties: any;
  currentRanks: GraphqlTypes.LearningTypes.Rank[];
  currentUserRank: GraphqlTypes.LearningTypes.Rank | undefined;
  currentUserRankInView: any;
  getRanksLoading: boolean;
  getRankUserInfoLoading: boolean;
  getMyRankLoading: boolean;
  rankQueryPagination: RankQueryPaginationType;
  currentUser: GraphqlTypes.LearningTypes.User;
  rankTypeSelected: GraphqlTypes.LearningTypes.RankType| undefined;
  currentUserRankIndex: number | undefined;
  handleOpenRankUserInfo: (id: string) => void;
  handleClickRatingRow: (index: number, currentRanks: any[]) => void;
  currentRankUserId: string;
  userSelected: GraphqlTypes.LearningTypes.User | undefined;
  handleRowsRendered: (data: any) => void;
}
const RankPanel: FC<RankPanelProps> = ({
  currentUser,
  handleRowsRendered,
  userSelected,
  currentRankUserId,
  handleClickRatingRow,
  handleOpenRankUserInfo,
  getMyRankLoading,
  currentUserRankIndex,
  currentUserRank,
  getRankUserInfoLoading,
  rankTypeSelected,
  rankQueryPagination,
  getRanksLoading,
  rankTypes,
  slideProperties,
  currentRanks,
  currentUserRankInView,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  let backgroundColor: any;
  switch(currentUserRankIndex) {
    case 0:
      backgroundColor = theme.colors.success.main;
      break;
    case 1:
      backgroundColor = theme.colors.warning.light;
      break;
    case 2:
      backgroundColor = theme.colors.error.light;
      break;
    default:
      backgroundColor = theme.colors.secondary.light;
  }

  let childrenForBox: any;
  switch(rankTypeSelected?.name?.toLowerCase()) {
    case 'word':
      if(!getMyRankLoading) {
        childrenForBox = currentUserRank?.elo?.word;
        break;
      }
      childrenForBox = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
      break;
    case 'topic':
      if(!getMyRankLoading) {
        childrenForBox = currentUserRank?.elo?.topic;
        break;
      }
      childrenForBox = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
      break;
    case 'level':
      if(!getMyRankLoading) {
        childrenForBox = `${currentUserRank?.elo?.level + ' (' + currentUserRank?.elo?.exp + ')' }`;
        break;
      }
      childrenForBox = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
      break;
    default: 
      childrenForBox = '';
      break;
  }

  return (
    <>
      <Typography
        variant="inherit"
        children={t('User rankings')}
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          mb: 1,
        }}
      />
      <Box
        sx={{
          width: '100%',
          height: {
            xs: 600,
            sm: 600,
            md: 500,
            lg: 600,
            xl: 650,
          },
          borderRadius: '6px',
          boxShadow:
            '0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
          display: 'flex',
          flexDirection: 'column',
          // border: 'solid 1px #cccccc',
        }}
      >
        {/* top rank */}
        <Box
          sx={{
            width: '100%',
            backgroundImage: theme.colors.gradients[1],
            // backgroundColor: theme.colors.alpha.white[100],
            p: '12px',
            borderRadius: '6px 6px 0px 0px',
          }}
        >
          {/* select options */}
          {!!rankTypes.length && (
            <Box
              sx={{
                width: 'fit-content',
                maxWidth: '250px',
                minWidth: '200px',
                mx: 'auto',
                mb: 1.5,
              }}
            >
              <Slide {...slideProperties}>
                {rankTypes.map((item) => {
                  return (
                    <Box
                      key={item.id}
                      children={t(item.name)}
                      sx={{ textAlign: 'center', color: '#ffffff' }}
                    />
                  );
                })}
              </Slide>
            </Box>
          )}

          {/* top user */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* top 2 */}
            <Box
              sx={{
                position: 'relative',
                width: 'fit-content',
                height: 'fit-content',
              }}
            >
              <Avatar
                sx={{
                  width: '36px',
                  height: '36px',
                  p: 0,
                }}
                src={currentRanks?.[1]?.user?.identity?.traits?.picture?.toString()}
              ></Avatar>
              <Dot
                sx={{
                  width: '20px',
                  height: '20px',
                  bgcolor: theme.colors.warning.light,
                  color: '#ffffff',
                }}
                children={currentRanks?.[1]?.number}
              />
            </Box>

            {/* top 1 */}
            <Box
              sx={{
                position: 'relative',
                width: 'fit-content',
                height: 'fit-content',
                mx: '20px',
              }}
            >
              <Avatar
                sx={{
                  width: '50px',
                  height: '50px',
                  p: 0,
                }}
                src={currentRanks?.[0]?.user?.identity?.traits?.picture?.toString()}
              ></Avatar>
              <Dot
                sx={{
                  width: '28px',
                  height: '28px',
                  bgcolor: theme.colors.success.main,
                  color: '#ffffff',
                }}
                children={currentRanks?.[0]?.number}
              />
            </Box>

            {/* top 3 */}
            <Box
              sx={{
                position: 'relative',
                width: 'fit-content',
                height: 'fit-content',
              }}
            >
              <Avatar
                sx={{
                  width: '36px',
                  height: '36px',
                  p: 0,
                }}
                src={currentRanks?.[2]?.user?.identity?.traits?.picture?.toString()}
              ></Avatar>
              <Dot
                sx={{
                  width: '20px',
                  height: '20px',
                  bgcolor: theme.colors.error.main,
                  color: '#ffffff',
                }}
                children={currentRanks?.[2]?.number}
              />
            </Box>
          </Box>
        </Box>

        {/* list rank */}
        <Box
          sx={{
            flex: 1,
            height: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            // ...!currentUserRankInView?.inView && currentUserRankInView?.position === 'bottom' && { pb: '52px' },
            ...(!currentUserRankInView?.inView && { pb: '52px' }),
          }}
        >
          {/* ranking table */}
          {getRanksLoading && rankQueryPagination.pageNumber === 1 ? (
            <Loading sx={{ position: 'absolute' }} />
          ) : (
            <ReactVirtualizedTable
              data={currentRanks.map((item, index) => {
                let bgColor: any;
                switch(index) {
                  case 0:
                    bgColor = theme.colors.success.main;
                    break;
                  case 1:
                    bgColor = theme.colors.warning.light;
                    break;
                  case 2:
                    bgColor = theme.colors.error.light;
                    break;
                  default:
                    bgColor = theme.colors.secondary.light;
                    break;
                }

                let boxChildren: any;
                switch(rankTypeSelected?.name?.toLowerCase()) {
                  case 'word':
                    if(!getRanksLoading) {
                      boxChildren = item.elo?.word;
                      break;
                    }
                    boxChildren = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
                    break;
                  case 'topic':
                    if(!getRanksLoading) {
                      boxChildren = item.elo?.topic;
                      break;
                    }
                    boxChildren = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
                    break;
                  case 'level':
                    if(!getRanksLoading) {
                      boxChildren = `${item.elo?.level + ' (' + item.elo?.exp + ')'}`;
                      break;
                    }
                    boxChildren = <LoadingData gifUrl="/images/icon/ellipsis-gray.gif" />;
                    break;
                  default:
                    boxChildren = '';
                }
                return {
                  rating: (
                    <Box
                      sx={{
                        flex: 2,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                      }}
                    >
                      <Box
                        children={item?.number}
                        sx={{
                          width: 'fit-content',
                          minWidth: '24px',
                          height: '24px',
                          px: '6px',
                          backgroundColor: {bgColor},
                          color: '#ffffff',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: 600,
                          mr: 1,
                          lineHeight: 1,
                        }}
                      />
                      {!!item.numberChange && (
                        <Box                       
                          {...item.numberChange > 0 ? {
                            sx: {
                              flex: 3,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: theme.colors.success.dark
                            },
                            children: `+${item.numberChange}`
                          } : {
                            sx: {
                              flex: 3,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: theme.colors.error.dark
                            },
                            children: item.numberChange
                          }}
                        />
                      )}
                    </Box>
                  ),
                  member: (
                    <Box
                      sx={{
                        flex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: '36px',
                          height: '36px',
                          p: 0,
                          mr: 2,
                          ...(currentRanks.findIndex(
                            (itemInput) => itemInput.user.id === currentUser.id
                          ) === index && {
                            backgroundColor: '#ffffff',
                            '.MuiSvgIcon-root': {
                              color: '#c2c2c2 !important',
                            },
                          }),
                        }}
                        src={item?.user?.identity?.traits?.picture?.toString()}
                      />
                      <Box
                        children={`${item?.user?.identity?.traits?.firstName} ${item?.user?.identity?.traits?.lastName}`}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          textAlign: 'left',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                  ),
                  value: (
                    <Box
                      children={boxChildren}
                      sx={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: theme.colors.secondary.dark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  ),
                  action: (
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ButtonCustom
                        startIcon={
                          getRankUserInfoLoading &&
                          currentRankUserId === item.user.id ? (
                              <LoadingData />
                            ) : (
                              <RemoveRedEyeIcon />
                            )
                        }
                        sx={{
                          minWidth: 'unset',
                          p: 1,
                          color: theme.colors.secondary.main,
                        }}
                        onClick={() => handleOpenRankUserInfo(item.user.id)}
                      />
                    </Box>
                  ),
                };
              })}
              columns={[
                {
                  dataKey: 'rating',
                  label: (
                    <Box
                      children={t('Rating')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    />
                  ),
                  width: 2000,
                },
                {
                  dataKey: 'member',
                  label: (
                    <Box
                      children={t('Member')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    />
                  ),
                  width: 3000,
                },
                {
                  dataKey: 'value',
                  label: (
                    <Box
                      children={t(rankTypeSelected?.name ?? undefined)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  ),
                  width: 1000,
                  sx: {
                    justifyContent: 'center',
                  },
                },
                {
                  dataKey: 'action',
                  label: (
                    <Box
                      children={t('Action')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                      }}
                    />
                  ),
                  width: 2000,
                  sx: {
                    justifyContent: 'center',
                  },
                },
              ]}
              specialRows={[
                currentRanks.findIndex(
                  (item) => item.user.id === currentUser.id
                ),
              ]}
              markedRows={[
                currentRanks.findIndex(
                  (item) => item.user.id === userSelected?.id
                ),
              ]}
              columnIgnores={[3]}
              onRowClick={(index) => handleClickRatingRow(index, currentRanks)}
              onRowsRendered={handleRowsRendered}
              headerBackgroundColor={theme.palette.background.default}
            />
          )}

          {/* current user rank */}
          {!currentUserRankInView?.inView &&
            currentUserRank &&
            currentUserRankIndex !== undefined &&
            currentUserRankIndex > -1 && (
            <Box
              key={currentUserRank?.id}
              sx={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                left: 0,
                borderRadius: '0px 0px 6px 6px',
                display: 'flex',
                p: theme.spacing(1, '4px', 1, 0),
                borderBottom: '1px solid rgba(34, 51, 84, 0.1)',
                backgroundColor: theme.colors.primary.light,
                transition: 'top bottom 1s ease',
              }}
            >
              <Box
                sx={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'start',
                  }}
                >
                  <Box
                    children={currentUserRank?.number}
                    sx={{
                      width: 'fit-content',
                      minWidth: '24px',
                      height: '24px',
                      px: '6px',
                      backgroundColor: {backgroundColor},
                      color: '#ffffff',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      mr: 1,
                    }}
                  />
                  {!!currentUserRank?.numberChange && (
                    <Box
                      sx={{
                        flex: 3,
                        fontSize: '14px',
                        fontWeight: 600,
                        // color: currentUserRank?.numberChange > 0 ? theme.colors.success.dark : theme.colors.error.dark,
                        color: '#ffffff',
                      }}
                      children={
                        currentUserRank?.numberChange > 0
                          ? `+${currentUserRank?.numberChange}`
                          : currentUserRank?.numberChange
                      }
                    />
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      width: '36px',
                      height: '36px',
                      p: 0,
                      mr: 2,
                      backgroundColor: '#ffffff70',
                      '.MuiSvgIcon-root': {
                        color: '#c2c2c2 !important',
                      },
                    }}
                    src={currentUserRank?.user?.identity?.traits?.picture?.toString()}
                  />
                  <Box
                    children={`${currentUserRank?.user?.identity?.traits?.firstName} ${currentUserRank?.user?.identity?.traits?.lastName}`}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
              </Box>
              <Box
                children={childrenForBox}
                sx={{
                  flex: 1,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <Box
                sx={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ButtonCustom
                  startIcon={<RemoveRedEyeIcon />}
                  sx={{ minWidth: 'unset', p: 1, color: '#ffffff' }}
                  onClick={() =>
                    handleOpenRankUserInfo(currentUserRank.user.id)
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export { RankPanel };
