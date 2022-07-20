import { SxProps } from '@mui/system';
import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
  Box, Dialog, DialogActions,
  DialogContent,
  DialogTitle, Tooltip, Typography,
  useTheme
} from '@mui/material';

import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { GraphqlMutations, GraphqlQueries, GraphqlTypes, HandleLearningType, HandleTestType } from '@els/client/app/shared/data-access';

import { useLazyQuery, useMutation } from '@apollo/client';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import {
  ButtonCustom,
  LearningIcon,
  LoadingData,
  ReactVirtualizedTable,
  TestIcon
} from '@els/client/app/shared/ui';
import { ApolloClient } from '@els/client/shared/data-access';
import { orderBy } from 'lodash';
import { ViewWordItem } from './view-word-item';

export interface HandleIgnoreWordType {
  key: string;
  markStatus: boolean;
  ignoreType: GraphqlTypes.LearningTypes.UnTrackingMode;
  checked?: boolean;
  isNewVocabulary?: boolean;
}

export interface ViewWordListProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  titleLearning?: ReactNode;
  subtitleLearning?: ReactNode;
  titleTest?: ReactNode;
  subtitleTest?: ReactNode;
  myTopic?: GraphqlTypes.LearningTypes.Topic;
  vocabularies: string[];
  studentId?: string;
  memoryAnalyses?: GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>;
  ignoredWords?: string[];
  memoryStatus?: GraphqlTypes.LearningTypes.MemoryStatus;
  handleLearning?: (data: HandleLearningType) => void;
  handleTest?: (data: HandleTestType) => void;
  sx?: SxProps;
  currentLessonId?: string;
}

const ViewWordList = (props: ViewWordListProps) => {
  const { myTopic, currentLessonId, vocabularies: originalVocabularies, studentId, memoryAnalyses, ignoredWords, memoryStatus, sx, open, setOpen, title, subtitle, titleLearning, subtitleLearning, titleTest, subtitleTest, handleTest, handleLearning } = props;
  const { t }: { t: any } = useTranslation();
  const { toastify } = useContext(ToastifyContext);

  const theme = useTheme();

  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [vocabularies, setVocabularies] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [currentMemoryAnalyses, setCurrentMemoryAnalyses] = useState<GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>>([]);
  const handleClose = () => setOpen(false);

  const [GetVocabularies, { loading: getVocabulariesLoading }] = useLazyQuery(GraphqlQueries.LearningQueries.Vocabulary.GetVocabularies, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      const newVocabularies = orderBy(data.vocabularies ?? [], (item) => item.vocabulary.toLowerCase(), 'asc');

      setVocabularies(newVocabularies);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const [GetCurrentUser] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.user) setCurrentUser(data?.user);
      },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    },
  );

  const [MarkMemorizedVocabulary] = useMutation(GraphqlMutations.LearningMutations.Enrollment.MarkMemorizedVocabulary, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (currentLessonId && currentMemoryAnalyses) {
        const indexMemoryAnalysis = currentMemoryAnalyses.findIndex((memoryAnalysis) => memoryAnalysis.vocabulary.id === data.enrollment.unTrackVocabulary.vocabulary.id);
        if (indexMemoryAnalysis > -1) {
          const updateMemoryAnalysis = {
            ...currentMemoryAnalyses[indexMemoryAnalysis],
            memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
          };
          setCurrentMemoryAnalyses([...currentMemoryAnalyses.slice(0, indexMemoryAnalysis ), updateMemoryAnalysis, ...currentMemoryAnalyses.slice(indexMemoryAnalysis +1)  ]);
        } else {
          setCurrentMemoryAnalyses([...currentMemoryAnalyses, data.enrollment.unTrackVocabulary]);  
        }
      } else {
        if (currentMemoryAnalyses) {
          const indexMemoryAnalysis = currentMemoryAnalyses.findIndex((memoryAnalysis) => memoryAnalysis.vocabulary.id === data.enrollment.unTrackVocabulary.vocabulary.id);
          if (currentMemoryAnalyses[indexMemoryAnalysis] && currentMemoryAnalyses[indexMemoryAnalysis].memoryStatus !==  GraphqlTypes.LearningTypes.MemoryStatus.Memorized) {
            const vocabularyId = data.enrollment.unTrackVocabulary.vocabulary.id;
            const newVocabularies = [...vocabularies].filter((v) => v.id !== vocabularyId);
            setVocabularies(newVocabularies);
          }
        }
      }
     
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  const [UnmarkMemorizedVocabulary] = useMutation(GraphqlMutations.LearningMutations.Enrollment.UnmarkMemorizedVocabulary, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  const timeoutCanMarkRef = useRef<any>(null);
  const [canMark, setCanMark] = useState<boolean>(true);
  const handleCheckMark = useCallback((): boolean => {
    if (!canMark) {
      toastify({
        type: 'warning',
        message: t('Your actions are too fast'),
      });
      return false;
    };

    if (timeoutCanMarkRef.current) clearTimeout(timeoutCanMarkRef.current);
    timeoutCanMarkRef.current = setTimeout(() => {
      setCanMark(true);
    }, 500);
    setCanMark(false);

    return true;
  }, [canMark]);

  const [wordsChecked, setWorksChecked] = useState<{ [key: string]: boolean }>({});
  const handleIgnoreWord = (data: HandleIgnoreWordType) => {
    const { checked, markStatus, key, ignoreType, isNewVocabulary } = data;
    const vocabularyIndex = vocabularies.findIndex(item => item.id === key);
    const vocabulary = vocabularies[vocabularyIndex];

    if (vocabulary) {
      const memoryAnalyseIndex = (currentMemoryAnalyses ?? myTopic?.students?.[0]?.memoryAnalyses ?? []).findIndex(item => item.vocabulary.id === vocabulary.id);
      const memoryAnalyse = (currentMemoryAnalyses ?? myTopic?.students?.[0]?.memoryAnalyses ?? [])[memoryAnalyseIndex];

      if (markStatus) {
        MarkMemorizedVocabulary({
          variables: {
            unTrackVocabularyInput: {
              topicId: vocabulary.topic.id,
              unTrackingMode: ignoreType,
              vocabularyId: vocabulary.id,
            },
            isNewVocabulary: !!isNewVocabulary,
          },
          update(cache, { data }) { // ? note: To fix the delay when mark or ignore, you have to use the logic here to update the relevant data in the apollo cache and delete the refetchQueries in the MarkMemorizedVocabulary mutation
            if (!currentUser) return;

            try {
              // update cache data on home page
              cache.modify({
                id: cache.identify(currentUser),
                fields: {
                  ignoredWords(currentIgnoredWords) {
                    if (ignoreType === 'system') {
                      return [...(currentIgnoredWords ?? []), vocabulary.vocabulary];
                    }
  
                    return [...(currentIgnoredWords ?? [])];
                  },
                  memoryAnalyses(
                    currentMemoryAnalyses: GraphqlTypes.LearningTypes.MemoryAnalysis[],
                    { readField },
                  ) {
                    if (isNewVocabulary) return currentMemoryAnalyses;

                    const memoryAnalysisIndex = (currentMemoryAnalyses ?? []).findIndex(item => readField('id', readField('vocabulary', item)) === vocabulary.id);
  
                    const newMemoryAnalyses = [...(currentMemoryAnalyses ?? [])];
  
                    if (memoryAnalysisIndex >= 0) {
                      newMemoryAnalyses[memoryAnalysisIndex] = {
                        ...newMemoryAnalyses[memoryAnalysisIndex],
                        memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
                      };
                    }
                    // else {
                    //   const newMemoryAnalysis: GraphqlTypes.LearningTypes.MemoryAnalysis = {
                    //     __typename: 'MemoryAnalysis',
                    //     actualSkills: [],
                    //     createdAt: new Date(),
                    //     createdBy: currentUser.id,
                    //     id: uuidv4(),
                    //     isFirstTime: true,
                    //     lastChangedMemoryStatusAt: new Date(),
                    //     lastStudiedAt: new Date(),
                    //     lesson: vocabulary.lesson,
                    //     memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
                    //     unTrackingMode: ignoreType,
                    //     vocabulary: vocabulary,
                    //     student: myTopic?.students?.[0],
                    //   };
  
                    //   newMemoryAnalyses = [
                    //     ...newMemoryAnalyses,
                    //     newMemoryAnalysis,
                    //   ];
                    // }
  
                    return newMemoryAnalyses;
                  },
                  summaryMemoryStatus(
                    currentSummaryMemoryStatus: {
                      memorizedVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      vagueVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      forgotVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      newVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                    },
                    { readField },
                  ) {
                    if (isNewVocabulary) return currentSummaryMemoryStatus;

                    const memoryAnalysisIndex = currentMemoryAnalyses?.findIndex(item => item.vocabulary.id === vocabulary.id);
  
                    const newSummaryMemoryStatus = { ...currentSummaryMemoryStatus };
  
                    const memoryStatusItem = currentMemoryAnalyses?.[memoryAnalysisIndex ?? -1]?.memoryStatus;
                    const currentSummaryMemoryStatusType =
                      memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                        ? 'memorizedVocabularies'
                        : memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Vague
                          ? 'vagueVocabularies'
                          : memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Forgot
                            ? 'forgotVocabularies'
                            : 'newVocabularies';

                    const vocabularyNeedMoveIndex = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? []).findIndex(item => readField('id', item) === vocabulary.id);
  
                    const vocabularyNeedMove = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? [])[vocabularyNeedMoveIndex];
                    
                    newSummaryMemoryStatus['memorizedVocabularies'] = [
                      ...newSummaryMemoryStatus['memorizedVocabularies'],
                      vocabularyNeedMove,
                    ];
  
                    newSummaryMemoryStatus[currentSummaryMemoryStatusType] = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? []).filter((item, index: number) => {
                      return index !== vocabularyNeedMoveIndex;
                    });
  
                    return newSummaryMemoryStatus;
                  },
                },
              });
  
              // update cache data on topic list page
              cache.modify({
                id: cache.identify({
                  __typename: 'Enrollment',
                  id: memoryAnalyse?.student?.id ?? studentId,
                }),
                fields: {
                  user: (currentUser: GraphqlTypes.LearningTypes.User, { readField }) => {
                    if (ignoreType === 'system') {
                      return {
                        ...currentUser,
                        ignoredWords: [...(currentUser.ignoredWords ?? []), vocabulary.vocabulary],
                      };
                    }
  
                    return currentUser;
                  },
                  memoryAnalyses(
                    currentMemoryAnalyses: GraphqlTypes.LearningTypes.MemoryAnalysis[],
                    { readField },
                  ) {
                    if (isNewVocabulary) return currentMemoryAnalyses;

                    const memoryAnalysisIndex = (currentMemoryAnalyses ?? []).findIndex(item => readField('id', readField('vocabulary', item)) === vocabulary.id);
  
                    const newMemoryAnalyses = [...(currentMemoryAnalyses ?? [])];
  
                    if (memoryAnalysisIndex >= 0) {
                      newMemoryAnalyses[memoryAnalysisIndex] = {
                        ...newMemoryAnalyses[memoryAnalysisIndex],
                        memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
                      };
                    }
                    // else {
                    //   const newMemoryAnalysis: GraphqlTypes.LearningTypes.MemoryAnalysis = {
                    //     __typename: 'MemoryAnalysis',
                    //     actualSkills: [],
                    //     createdAt: new Date(),
                    //     createdBy: currentUser.id,
                    //     id: uuidv4(),
                    //     isFirstTime: true,
                    //     lastChangedMemoryStatusAt: new Date(),
                    //     lastStudiedAt: new Date(),
                    //     lesson: vocabulary.lesson,
                    //     memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
                    //     unTrackingMode: ignoreType,
                    //     vocabulary: vocabulary,
                    //     student: myTopic?.students?.[0],
                    //   }
  
                    //   newMemoryAnalyses = [
                    //     ...newMemoryAnalyses,
                    //     newMemoryAnalysis,
                    //   ];
                    // }
  
                    return newMemoryAnalyses;
                  },
                  summaryMemoryStatus(
                    currentSummaryMemoryStatus: {
                      memorizedVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      vagueVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      forgotVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                      newVocabularies: GraphqlTypes.LearningTypes.Vocabulary[],
                    },
                    { readField },
                  ) {
                    if (isNewVocabulary) return currentSummaryMemoryStatus;

                    const memoryAnalysisIndex = currentMemoryAnalyses?.findIndex(item => item.vocabulary.id === vocabulary.id);
  
                    const newSummaryMemoryStatus = { ...currentSummaryMemoryStatus };
  
                    const memoryStatusItem = currentMemoryAnalyses?.[memoryAnalysisIndex ?? -1]?.memoryStatus;
                    const currentSummaryMemoryStatusType =
                      memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                        ? 'memorizedVocabularies'
                        : memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Vague
                          ? 'vagueVocabularies'
                          : memoryStatusItem === GraphqlTypes.LearningTypes.MemoryStatus.Forgot
                            ? 'forgotVocabularies'
                            : 'newVocabularies';
  
                    const vocabularyNeedMoveIndex = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? []).findIndex(item => readField('id', item) === vocabulary.id);
  
                    const vocabularyNeedMove = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? [])[vocabularyNeedMoveIndex];
                    
                    newSummaryMemoryStatus['memorizedVocabularies'] = [
                      ...newSummaryMemoryStatus['memorizedVocabularies'],
                      vocabularyNeedMove,
                    ];
  
                    newSummaryMemoryStatus[currentSummaryMemoryStatusType] = (newSummaryMemoryStatus[currentSummaryMemoryStatusType] ?? []).filter((item, index: number) => {
                      return index !== vocabularyNeedMoveIndex;
                    });
  
                    return newSummaryMemoryStatus;
                  },
                }
              });
            } catch (error) {
              console.log(error);
            }
          },
        });
      } else {
        if (memoryAnalyse)
          UnmarkMemorizedVocabulary({
            variables: {
              memoryAnalysisId: memoryAnalyse.id,
            },
            update(cache, { data }) {  // ? note: To fix the delay when mark or ignore, you have to use the logic here to update the relevant data in the apollo cache and delete the refetchQueries in the UnmarkMemorizedVocabulary mutation
              if (!currentUser) return;
                          
              try {
                // update cache data on home page
                cache.modify({
                  id: cache.identify(currentUser),
                  fields: {
                    ignoredWords(currentIgnoredWords: string[]) {
                      const newIgnoredWords = (currentIgnoredWords ?? []).filter(item => item !== vocabulary.vocabulary);
                      return [...newIgnoredWords];
                    },
                  },
                });

                // update cache data on topic list page
                cache.modify({
                  id: cache.identify({
                    __typename: 'Enrollment',
                    id: memoryAnalyse?.student?.id ?? studentId,
                  }),
                  fields: {
                    user: (currentUser: GraphqlTypes.LearningTypes.User) => {
                      return {
                        ...currentUser,
                        ignoredWords: (currentUser.ignoredWords ?? []).filter(item => item !== vocabulary.vocabulary),
                      };
                    },
                  },
                });
              } catch (error) {
                console.log(error);
              }
            },
          });
      }
    }

    if (checked !== undefined) setWorksChecked({ ...wordsChecked, [key]: checked });
  };

  const [wordsRating, setWorksRating] = useState<{ [key: string]: boolean }>({});
  const handleChangeWordRating = (event: any, key: string) =>
    setWorksRating({ ...wordsRating, [key]: event.target.checked });

  useEffect(() => {
    GetVocabularies({
      variables: {
        getVocabulariesInput: {
          vocabularyIds: originalVocabularies
        },
      }
    });
  }, [originalVocabularies]);

  useEffect(() => {
    const newWordsChecked: { [key: string]: boolean } = {};
    if (vocabularies)
      cloneDeep(vocabularies).forEach((item) => {
        newWordsChecked[item.id] = (ignoredWords ?? myTopic?.students?.[0]?.user?.ignoredWords ?? []).findIndex(word => word.toLowerCase() === item.vocabulary.toLowerCase()) !== -1;
      });
    setWorksChecked(newWordsChecked);

    const newWordsRating: { [key: string]: boolean } = {};
    if (vocabularies)
      cloneDeep(vocabularies).forEach((item) => {
        newWordsRating[item.id] = false;
      });
    setWorksRating(newWordsRating);
  }, [vocabularies, myTopic, ignoredWords]);

  useEffect(() => {
    GetCurrentUser();

    return () => {
      clearTimeout(timeoutCanMarkRef.current);
    };
  }, []);

  useEffect(() => {
    setCurrentMemoryAnalyses(memoryAnalyses ?? []);
    console.log(memoryAnalyses);
  }, [memoryAnalyses]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
      sx={{
        maxHeight: '700px',
        m: 'auto',
        '.MuiDialog-paper': {
          minWidth: '310px',
          height: {
            xs: '500px',
            md: '700px',
          },
          boxShadow: `0px 0px 10px 2px ${theme.colors.alpha.black[50]}`,
        },
        ...sx,
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: theme.spacing(2),
        }}
      >
        <Typography
          variant="h3"
          children={(
            <Box>
              {title}
              {subtitle}  
            </Box>
          )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!!handleTest && (
            <Tooltip key={Math.random()} arrow placement="top" title={t('Test')}>
              <Box sx={{ width: 'fit-content' }}>
                <ButtonCustom
                  variant="contained" color="primary"
                  startIcon={<TestIcon sx={{ width: '17px', height: '17px' }} />}
                  sx={{ minWidth: 'unset', width: '30px', height: '30px', p: 0, mr: theme.spacing(1) }}
                  onClick={() => handleTest ? handleTest({ title: titleTest ?? title, subtitle: subtitleTest ?? subtitle, vocabularies, studentId, myTopic }) : null}
                />
              </Box>
            </Tooltip>
          )}
          {!!handleLearning && (
            <Tooltip key={Math.random()} arrow placement="top" title={t('Learn')}>
              <Box sx={{ width: 'fit-content' }}>
                <ButtonCustom
                  variant="contained" color="primary"
                  startIcon={<LearningIcon sx={{ width: '17px', height: '17px' }} />}
                  sx={{ minWidth: 'unset', width: '30px', height: '30px', p: 0 }}
                  onClick={() => handleLearning ? handleLearning({ title: titleLearning ?? title, subtitle: subtitleLearning ?? subtitle, myTopic, vocabularies, memoryAnalyses: currentMemoryAnalyses, studentId }) : null}
                />
              </Box>
            </Tooltip>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        {getVocabulariesLoading && (
          <LoadingData sx={{ width: '100%', height: '100%' }} />
        )}
        {!getVocabulariesLoading && (
          <ReactVirtualizedTable
            data={
              vocabularies.map((item, index) => {
                const newMemoryStatus =
                  memoryStatus
                    ? memoryStatus
                    : !currentMemoryAnalyses
                      ? undefined
                      : currentMemoryAnalyses[currentMemoryAnalyses?.findIndex(memoryAnalyse => memoryAnalyse.vocabulary.id === item.id) ?? -1]?.memoryStatus;
                
                return {
                  anyKey: (
                    <ViewWordItem
                      key={item.id}
                      no={index}
                      vocabulary={item}
                      memoryStatus={newMemoryStatus}
                      wordsChecked={wordsChecked}
                      handleIgnoreWord={handleIgnoreWord}
                      wordsRating={wordsRating}
                      handleChangeWordRating={handleChangeWordRating}
                      handleCheckMark={handleCheckMark}
                      sx={{}}
                    />
                  )
                };
              })
            }
            columns={[
              {
                dataKey: 'anyKey',
                label: '',
                width: 1000,
              }
            ]}
            onRowClick={undefined}
            // onRowsRendered={() => console.log('onRowsRendered')}
            headerHeight={0}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{ display: 'flex', justifyContent: 'end', px: theme.spacing(2) }}
      >
        <ButtonCustom
          children={t('Close')}
          onClick={handleClose}
          sx={{
            fontSize: '13px',
            color: theme.colors.secondary.main,
            fontWeight: 100
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export { ViewWordList };
