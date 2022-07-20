// next, react
import {
  useContext,
  useState,
  useRef,
  useEffect,
  forwardRef,
  ReactNode,
} from 'react';

// material
import { lighten, SxProps } from '@mui/system';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  DialogContent,
  Dialog,
  Slide,
  SlideProps,
  TextField,
  Avatar,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// other
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { Slide as SlideVocabulary } from 'react-slideshow-image';

// context
import { ToastifyContext } from '@els/client/app/shared/contexts';

// interface
import { GraphqlMutations, GraphqlQueries, GraphqlTypes, HandleTestType } from '@els/client/app/shared/data-access';

// ui
import {
  ButtonCustom,
  LabelCustom,
  StudentIcon,
  PracticeIcon,
  VoiceRecording,
  LoadingData,
} from '@els/client/app/shared/ui';

// apollo client
import { ApolloClient } from '@els/client/shared/data-access';
import { useLazyQuery, useMutation } from '@apollo/client';
import { addAlpha, stringComparison, transferVocabulariesData, WordTypes } from '@els/client/shared/utils';
import { CommentItem } from '../comment-item';
import { cloneDeep } from 'lodash';
import { useAudio } from '@els/client-shared-hooks';
import { ViewReactionList } from '../view-reaction-list';
import { DialogConfirm, DialogConfirmType } from '@els/client/shared/ui';
import { useRouter } from 'next/router';

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
    width: 100%;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
  `
);

const BoxSession = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(2, 2, 0, 2)};
  `
);

const WordListWrapper = styled(Box)(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
  `
);

const ContentAndPracticeWrapper = styled(Box)(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
  `
);

const LessonListWrapper = styled(Box)(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
  `
);

const CommentsWrapper = styled(Box)(
  ({ theme }) => `
    margin-top: ${theme.spacing(4)};
  `
);

const Transition = forwardRef<unknown, SlideProps>((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export interface PracticeItemType {
  id: string;
  text: string;
  write: boolean;
  listen: boolean | undefined;
  speak: boolean | undefined;
  errorLoadingAudio?: boolean;
}

export interface HandleViewReactionListType {
  title: ReactNode;
  reactions: GraphqlTypes.LearningTypes.Reaction[];
}

export interface ReplyCommentDataType {
  parentId: string;
  text: string;
}

export interface ReactCommentDataType {
  commentId: string;
  emoji: string;
}

export interface LearningPageProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  myTopic?: GraphqlTypes.LearningTypes.Topic;
  currentLessonId?: string;
  showLessonList?: boolean;
  vocabularies?: GraphqlTypes.LearningTypes.Vocabulary[];
  memoryAnalyses?: GraphqlTypes.LearningTypes.MemoryAnalysis[] | GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>;
  handleTest: (data: HandleTestType) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  sx?: SxProps;
}

const pronounceTime = 3;
const limitVocabularyInSlide = 10;

const LearningPage = (props: LearningPageProps) => {
  const {
    title,
    subtitle,
    myTopic,
    currentLessonId,
    showLessonList,
    vocabularies: vocabularyList,
    memoryAnalyses,
    sx,
    open,
    setOpen,
    handleTest,
  } = props;
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const { toastify } = useContext(ToastifyContext);
  // const [vocabularies, setVocabularies] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [lessons, setLessons] = useState<GraphqlTypes.LearningTypes.Lesson[]>([]);
  const router = useRouter();
  const [GetLessons] = useLazyQuery(GraphqlQueries.LearningQueries.Lesson.GetLessons, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setLessons(data.lessons);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    }});
  const inTopicListPage = router.pathname === '/learning';
  const inTopicDetailPage = router.pathname === '/learning/[id]';
  const inPersonalPage = router.pathname === '/';

  // * ref data
  const writeWordInputRef = useRef<any>('');
  const practiceItemIdRef = useRef<string>('');
  const practiceDataRef = useRef<PracticeItemType[]>([]);
  const stopSpeakingTimeoutRef = useRef<any>();
  const checkHiddenTimeoutRef = useRef<any>();
  const pronounceTimeoutRef = useRef<any>();
  const currentSkillsCoresRef = useRef<string>();
  const slideRef = useRef<any>();
  
  // * state data
  const formStateInit = { message: '' };
  const [showMoreMeaning, setShowMoreMeaning] = useState(true);
  const [formState, setFormState] = useState(formStateInit);
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [textRecording, setTextRecording] = useState<string>('');
  const [writeWordValue, setWriteWordValue] = useState<string>('');
  const [practiceData, setPracticeData] = useState<PracticeItemType[]>([]);
  const [currentVocabularies, setCurrentVocabularies] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [currentVocabulariesSlide, setCurrentVocabulariesSlide] = useState<GraphqlTypes.LearningTypes.Vocabulary[][]>([]);
  const [currentVocabulary, setCurrentVocabulary] = useState<GraphqlTypes.LearningTypes.Vocabulary>();
  const [currentVocabularyIncludeWordRefer, setCurrentVocabularyIncludeWordRefer] = useState<GraphqlTypes.LearningTypes.Vocabulary>();
  const [currentVocabularyIndex, setCurrentVocabularyIndex] = useState<number>(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [commentsData, setCommentsData] = useState<GraphqlTypes.LearningTypes.Comment[]>();
  const [pronounceTimer, setPronounceTimer] = useState<number>(pronounceTime);
  const [practiceItemInProgressId, setPracticeItemInProgressId] = useState<string>('');
  const [reactionList, setReactionList] = useState<GraphqlTypes.LearningTypes.Reaction[]>([]);
  const [reactionListTitle, setReactionListTitle] = useState<ReactNode>('');
  const [openReactionList, setOpenReactionList] = useState<boolean>(false);
  const [currentMemoryAnalyses, setCurrentMemoryAnalyses] = useState<GraphqlTypes.LearningTypes.Maybe<GraphqlTypes.LearningTypes.MemoryAnalysis[]>>([]);
  const [showLoadMoreLearningContent, setShowLoadMoreLearningContent] = useState<boolean>(true);
  // * api
  const [GetVocabulariesIncludeWordRefer, { loading: getVocabulariesIncludeWordReferLoading }] = useLazyQuery(GraphqlQueries.LearningQueries.Vocabulary.GetVocabulariesIncludeWordRefer, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCurrentVocabularyIncludeWordRefer(transferVocabulariesData(data?.vocabularies ?? [])?.[0]);

      setShowLoadMoreLearningContent(false);

      setShowMoreMeaning(true);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const LearnVocabularyRefetchQueries = [];
  if (inTopicListPage) LearnVocabularyRefetchQueries.push(GraphqlQueries.LearningQueries.Topic.GetMyTopics);
  if (inTopicDetailPage) LearnVocabularyRefetchQueries.push(GraphqlQueries.LearningQueries.Topic.GetMyTopicDetails);
  if (inPersonalPage) LearnVocabularyRefetchQueries.push(GraphqlQueries.LearningQueries.User.GetUser);
  const [LearnVocabularyGql,  { loading: learnVocabularyLoading }] = useMutation(GraphqlMutations.LearningMutations.Vocabulary.LearnVocabulary, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (currentMemoryAnalyses && currentVocabulary) {
        const indexMemoryAnalysis = currentMemoryAnalyses.findIndex((memoryAnalysis) => memoryAnalysis.vocabulary.id === currentVocabulary.id);
        if (indexMemoryAnalysis > -1) {
          const updateMemoryAnalysis = {
            ...currentMemoryAnalyses[indexMemoryAnalysis],
            memoryStatus: GraphqlTypes.LearningTypes.MemoryStatus.Memorized,
          };
          setCurrentMemoryAnalyses([...currentMemoryAnalyses.slice(0, indexMemoryAnalysis ), updateMemoryAnalysis, ...currentMemoryAnalyses.slice(indexMemoryAnalysis +1)  ]);
        } else {
          setCurrentMemoryAnalyses([...currentMemoryAnalyses, data.enrollment.learnVocabulary]);  
        }
      
      }

      GetCurrentUser({ fetchPolicy: 'network-only' });

      GetMyTopics({ fetchPolicy: 'network-only' });
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: LearnVocabularyRefetchQueries,
  });

  const [GetMyTopics] = useLazyQuery<{ myTopics: GraphqlTypes.LearningTypes.Topic[] }>(
    GraphqlQueries.LearningQueries.Topic.GetMyTopics,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
    },
  );

  const [GetCurrentUser] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCurrentUser(data?.user);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const [GetComments] = useLazyQuery<{ comments: GraphqlTypes.LearningTypes.Comment[] }>(GraphqlQueries.LearningQueries.Comment.GetComments, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCommentsData(data.comments ?? []);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    // pollInterval: 60000,
  });

  const [WriteCommentGql] = useMutation(GraphqlMutations.LearningMutations.Comment.WriteComment, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      GetComments({
        variables: {
          entityId: myTopic?.id,
          entityName: 'topic',
        }
      });
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.Comment.GetComments,
    ],
  });

  const [ReplyCommentGql] = useMutation(GraphqlMutations.LearningMutations.Comment.ReplyComment, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      GetComments({
        variables: {
          entityId: myTopic?.id,
          entityName: 'topic',
        }
      });
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.Comment.GetComments,
    ],
  });

  const [ReactCommentGql] = useMutation(GraphqlMutations.LearningMutations.Comment.ReactComment, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      GetComments({
        variables: {
          entityId: myTopic?.id,
          entityName: 'topic',
        }
      });
    },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.Comment.GetComments,
    ],
  });

  //* Dialog Warning
  interface DialogWarningValueType {
    open: boolean,
    type: string | 'goToTest' | 'stopLearning',
    title: ReactNode,
    message: ReactNode,
    confirmTitle?: ReactNode,
    cancelTitle?: ReactNode,
  };
  const initWarningValue: DialogWarningValueType = {
    open: false,
    type: '',
    title: '',
    message: '',
    confirmTitle: '',
    cancelTitle: '',
  };
  const [dialogWarningValue, setDialogWarningValue] = useState(initWarningValue);
  const handleOpenDialogWarning = (
    data: {
      type: 'goToTest' | 'stopLearning',
      title: ReactNode,
      message: ReactNode,
      confirmTitle?: ReactNode,
      cancelTitle?: ReactNode,
    }
  ) => {
    setDialogWarningValue({
      open: true,
      type: data.type,
      title: data.title,
      message: data.message,
      confirmTitle: data.confirmTitle,
      cancelTitle: data.cancelTitle,
    });
  };
  const handleCloseDialogWarning = () => {
    setDialogWarningValue(initWarningValue);
  };
  const handleConfirmDialogWarning = (dialogWarningValue: DialogWarningValueType) => {
    setDialogWarningValue(initWarningValue);

    if (dialogWarningValue.type === 'goToTest') handleGoToTest(title);
    if (dialogWarningValue.type === 'stopLearning') handleClose();
  };

  // * handle logic
  const handleErrorLoadingAudio = () => {
    handleListen({ errorLoadingAudio: true });
  };

  const handleWrite = (event: any) => {
    event.persist();
    
    setPronounceTimer(pronounceTime);

    if (event.keyCode === 13) {
      if (!event.target.value) return;

      const id = uuidv4();

      practiceItemIdRef.current = id;

      const isCorrectWord = writeWordValue.toLowerCase().trim() === currentVocabulary?.vocabulary.toLowerCase();

      const practiceItem = {
        id: id,
        text: writeWordValue,
        write: isCorrectWord,
        listen: isCorrectWord ? undefined : false,
        speak: isCorrectWord ? undefined : false,
      };
      const newPracticeData = [practiceItem, ...practiceData];
      
      setPracticeData(newPracticeData);
      practiceDataRef.current = newPracticeData;

      setWriteWordValue('');
      
      if (isCorrectWord) {
        setPracticeItemInProgressId(id);
        writeWordInputRef.current.blur();
        playAudioInPractice();
      }

      return;
    }

    setWriteWordValue(event.target.value);
  };

  const handleListen = (data?: { errorLoadingAudio?: boolean }) => {
    const practiceItemIndex = practiceDataRef.current.findIndex(item => item.id === practiceItemIdRef.current);

    const newPracticeData = [...practiceDataRef.current];
    newPracticeData[practiceItemIndex].listen = !data?.errorLoadingAudio;
    newPracticeData[practiceItemIndex].speak = undefined;
    newPracticeData[practiceItemIndex].errorLoadingAudio = data?.errorLoadingAudio;

    setPracticeData(newPracticeData);
    practiceDataRef.current = newPracticeData;

    handleCountdownPronounce(pronounceTime);

    stopSpeakingTimeoutRef.current = setTimeout(() => {
      stopSpeaking();
    }, pronounceTime * 1000);
  };

  const stopSpeaking = (practiceItemId?: string) => {
    const practiceItemIndex = practiceDataRef.current.findIndex(item => item.id === (practiceItemId ?? practiceItemIdRef.current));

    const newPracticeData = [...practiceDataRef.current];
    newPracticeData[practiceItemIndex].speak = false;

    setPracticeData(newPracticeData);
    practiceDataRef.current = newPracticeData;

    setPracticeItemInProgressId('');

    setTextRecording('');

    // handle learning vocabulary when completing a practice session
    handleLearning(practiceDataRef.current, currentVocabularyIndex);

    writeWordInputRef.current.focus();
  };

  const reStartSpeaking = (practiceItemId: string) => {
    // set start timer value
    setPronounceTimer(pronounceTime);

    const practiceItemIndex = practiceDataRef.current.findIndex(item => item.id === practiceItemId);

    const newPracticeData = [...practiceDataRef.current];
    newPracticeData[practiceItemIndex].speak = undefined;

    setPracticeData(newPracticeData);
    practiceDataRef.current = newPracticeData;

    setPracticeItemInProgressId(practiceItemId);

    // timer run
    handleCountdownPronounce(pronounceTime);

    stopSpeakingTimeoutRef.current = setTimeout(() => {
      stopSpeaking(practiceItemId);
    }, pronounceTime * 1000);
  };

  const handleSpeak = (practiceItemId: string, textRecording: string) => {
    if (!currentVocabulary) return;

    const correctAnswer = currentVocabulary.vocabulary;

    setTextRecording(textRecording);

    const isRightAnswer = stringComparison(correctAnswer, textRecording, true);

    if (isRightAnswer) {
      clearTimeout(stopSpeakingTimeoutRef.current);
      clearTimeout(pronounceTimeoutRef.current);

      const practiceItemIndex = practiceDataRef.current.findIndex(item => item.id === practiceItemId);

      const newPracticeData = [...practiceDataRef.current];
      newPracticeData[practiceItemIndex].speak = true;

      setPracticeData(newPracticeData);
      practiceDataRef.current = newPracticeData;
      
      setPracticeItemInProgressId('');

      setTextRecording('');

      // handle learning vocabulary when completing a practice session
      handleLearning(practiceDataRef.current, currentVocabularyIndex);

      writeWordInputRef.current.focus();
    }
  };

  const handleLearning = (practiceData: PracticeItemType[], currentVocabularyIndex: number) => {
    // handle learn word
    const listenCores = cloneDeep(practiceData).filter(item => item.listen).length;
    const speakCores = cloneDeep(practiceData).filter(item => item.speak).length;
    const writeCores = cloneDeep(practiceData).filter(item => item.write).length;

    const skillsGetPoints = ['reading'];
    if (listenCores >= 5) skillsGetPoints.push('listening');
    if (speakCores >= 5) skillsGetPoints.push('speaking');
    if (writeCores >= 5) skillsGetPoints.push('writing');

    const currentSkillsGetPoints = skillsGetPoints.concat().toString();

    if ((listenCores >= 5 || speakCores >= 5 || writeCores >= 5) && currentSkillsGetPoints !== currentSkillsCoresRef.current) {
      currentSkillsCoresRef.current = currentSkillsGetPoints;
      LearnVocabularyGql({
        variables: {
          learnVocabularyInput: {
            lessonId: currentVocabularies[currentVocabularyIndex]?.lesson?.id || currentLessonId || lessons[currentLessonIndex]?.id,
            vocabularyId: currentVocabularies[currentVocabularyIndex]?.id,
            skills: skillsGetPoints,
          }
        }
      });
    }
  };

  const handleCountdownPronounce = (timer: number) => {
    if (timer <= 0) return;

    clearTimeout(pronounceTimeoutRef.current);
    pronounceTimeoutRef.current = setTimeout(() => {
      const newTimer = timer - 1;
      setPronounceTimer(newTimer);
      handleCountdownPronounce(newTimer);
    }, 1000);
  };

  const handleReset = () => {
    // reset pronounceTimeout
    clearTimeout(pronounceTimeoutRef.current);

    // reset form state
    setPracticeData([]);
    practiceDataRef.current = [];
    currentSkillsCoresRef.current = '';
    setTextRecording('');
  };
  
  const handleChangeLesson = (lessonId: string) => {
    const newLessonIndex = lessons?.findIndex(item => item.id === lessonId) ?? -1;

    if (newLessonIndex === -1) {
      toastify({
        message: 'Not found lesson',
        type: 'warning',
      });

      return;
    }

    setCurrentVocabularyIndex(0);

    setCurrentLessonIndex(newLessonIndex);

    // reset
    handleReset();
  };

  const handleChangeVocabulary = (newVocabularyIndex: number) => {
    // NextVocabulary
    setCurrentVocabularyIndex(newVocabularyIndex);

    // reset
    handleReset();
  };

  const handleClose = () => {
    handleReset();
    setCurrentVocabularyIndex(0);
    setOpen(false);
  };

  const handleGoToTest = (title: ReactNode) => {
    // handleClose();
    handleTest({
      title: title,
      vocabularies: currentVocabularies,
      studentId: myTopic?.students?.[0]?.id,
      myTopic: myTopic,
    });
  };

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
  };

  const handleComment = () => {
    if (!formState?.message?.trim()) return;
    WriteCommentGql({
      variables: {
        createCommentInput: {
          entityId: currentVocabularies[0].topic.id,
          entityName: 'topic',
          category: GraphqlTypes.LearningTypes.CategoryComment.Comment,
          rating: 0,
          text: formState.message,
        }
      },
      onCompleted: (data) => {
        // console.log(data);
      }
    });

    setFormState(formStateInit);
  };

  const handleReplyComment = (data: ReplyCommentDataType) => {
    ReplyCommentGql({
      variables: {
        replyCommentInput: {
          entityId: currentVocabularies[0].topic.id,
          entityName: 'topic',          
          parentId: data.parentId,
          text: data.text,
        }
      },
      onCompleted: (data) => {
        // console.log(data);
      }
    });
  };

  const handleReactComment = (data: ReactCommentDataType) => {
    ReactCommentGql({
      variables: {
        reactCommentInput: {        
          commentId: data.commentId,
          emoji: data.emoji,
        }
      },
      onCompleted: (data) => {
        // console.log(data);
      }
    });
  };

  const handleViewReactionList = (data: HandleViewReactionListType) => {
    setReactionListTitle(data.title);
    setReactionList(data.reactions);
    setOpenReactionList(true);
  };

  const handleShowViewMoreContent = (currentVocabularyId: string) => {    
    GetVocabulariesIncludeWordRefer({
      variables: {
        getVocabulariesInput: {
          vocabularyIds: [currentVocabularyId],
        },
        target: 'vi',
        translatesTarget: 'en',
        source: 'en',
        state: Math.random(),
      },
    });
  };

  const { playAgain: playAudioInContent } = useAudio({ url: currentVocabulary?.audio || '' });
  const { playAgain: playAudioInPractice } = useAudio({
    url: currentVocabulary?.audio || '',
    endedCallback: handleListen,
    errorCallback: handleErrorLoadingAudio,
  });

  const slideProperties = {
    autoplay: false,
    duration: 999999999999,
    indicators: true,
    arrows: true,
    prevArrow: (
      <Box
        children={(
          <NavigateBeforeIcon
            sx={{ fontSize: '20px', cursor: 'pointer', width: '30px', height: '30px' }}
          />
        )}
        sx={{
          display: 'flex',
          p: 1,
          borderRadius: '50%',
          color: '#ffffff',
          backgroundColor: lighten(theme.colors.primary.main, 0.8),
          opacity: 0.3,
          '&:hover': {
            opacity: 1,
            color: theme.colors.primary.main,
          }
        }}
      />
    ),
    nextArrow: (
      <Box
        children={(
          <NavigateNextIcon
            sx={{ fontSize: '20px', cursor: 'pointer', width: '30px', height: '30px' }}
          />
        )}
        sx={{
          display: 'flex',
          p: 1,
          borderRadius: '50%',
          color: '#ffffff',
          backgroundColor: lighten(theme.colors.primary.main, 0.8),
          opacity: 0.3,
          '&:hover': {
            opacity: 1,
            color: theme.colors.primary.main,
          }
        }}
      />
    ),
    infinite: true,
    canSwipe: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    transitionDuration: 300,
    defaultIndex: 0,
  };
  useEffect(() => {
    GetCurrentUser();
    GetLessons({
      variables: {
        ids: myTopic?.lessons?.map((lesson: GraphqlTypes.LearningTypes.Lesson) => lesson.id)
      }
    });

    return () => {
      clearTimeout(stopSpeakingTimeoutRef.current);
      clearTimeout(pronounceTimeoutRef.current);
      clearTimeout(checkHiddenTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const newCurrentLessonIndex = lessons?.findIndex(item => item.id === currentLessonId) ?? -1;
    if (currentLessonId) {
      GetLessons({
        variables: {
          ids: currentLessonId
        }
      });
    }
    setCurrentLessonIndex(newCurrentLessonIndex >= 0 ? newCurrentLessonIndex : 0);
  }, [currentLessonId]);

  useEffect(() => {
    if (vocabularyList && vocabularyList.length > 0) {
      setCurrentVocabularies(vocabularyList);

    }
  }, [vocabularyList]);

  useEffect(() => {
    if ( currentLessonIndex > -1 && lessons.length > 0) {
      setCurrentVocabularies(!!vocabularyList?.length ? vocabularyList : lessons[currentLessonIndex].vocabularies ?? []);
    }
  }, [currentLessonIndex, lessons.length]);
  useEffect(() => {
    if (myTopic) {
      GetComments({
        variables: {
          entityId: myTopic?.id,
          entityName: 'topic',
        }
      });
    }
  }, [myTopic]);

  useEffect(() => {
    setCurrentMemoryAnalyses(memoryAnalyses ?? []);
  }, [memoryAnalyses]);

  useEffect(() => {
    const vocabulary = currentVocabularies[currentVocabularyIndex];
    const vocabularyInSlide = currentVocabulariesSlide.findIndex(item => item.findIndex(subitem => subitem.id === vocabulary.id) !== -1);
    slideRef?.current?.goTo(vocabularyInSlide);
  }, [currentVocabularyIndex]);

  useEffect(() => {
    const newCurrentVocabulariesSlide: GraphqlTypes.LearningTypes.Vocabulary[][] = [];
    let currentIndex = 0;
    currentVocabularies.forEach((item, index) => {
      if (!newCurrentVocabulariesSlide[currentIndex]) newCurrentVocabulariesSlide[currentIndex] = [];
      newCurrentVocabulariesSlide[currentIndex].push(item);
      
      if ((index + 1) % limitVocabularyInSlide === 0) currentIndex+=1;
      
      return item;
    });
    setCurrentVocabulariesSlide(newCurrentVocabulariesSlide);
  }, [currentVocabularies]);

  useEffect(() => {
    const vocabulary = currentVocabularies[currentVocabularyIndex];
    if (vocabulary) setCurrentVocabulary(vocabulary);
  }, [currentVocabularies, currentVocabularyIndex]);

  useEffect(() => {
    setShowLoadMoreLearningContent(true);
  }, [currentVocabulary]);

  // useEffect(() => console.log(getVocabulariesIncludeWordReferLoading), [getVocabulariesIncludeWordReferLoading]);
  // useEffect(() => console.log(currentVocabulary), [currentVocabulary]);

  // TODO for test
  // useEffect(() => {
  //   LearnVocabularyGql({
  //     variables: {
  //       learnVocabularyInput: {
  //         lessonId: currentVocabulary?.lesson?.id,
  //         vocabularyId: currentVocabulary?.id,
  //         skills: ['reading', 'listening', 'speaking', 'writing'],
  //       }
  //     }
  //   });
  // }, [currentVocabularyIndex, currentVocabularies])
  // TODO end for test

  // if (!currentVocabularies.length) return null;

  return (
    <Dialog
      open={open}
      onClose={() => handleOpenDialogWarning({ type: 'stopLearning', title: t('End of current learning session'), message: t('Do you want to continue?'), confirmTitle: t('Ok') })}
      scroll="paper"
      fullScreen
      fullWidth
      TransitionComponent={Transition}
      sx={{
        '.MuiDialog-paper': {
          minWidth: '310px',
          boxShadow: `0px 0px 10px 2px ${theme.colors.alpha.black[50]}`,
        },
        ...sx,
      }}
    >
      <DialogContent
        dividers
        sx={{
          p: {
            xs: 1,
            md: 2.5,
          },
          width: '100%',
          // margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default
        }}
      >
        <BoxWrapper>
          {/* learning title */}
          <Paper elevation={1} variant="elevation" sx={{ width: '100%', mt: { xs: theme.spacing(2), md: theme.spacing(0) } }}>
            <BoxSession sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: theme.spacing(2.5) }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonCustom
                  startIcon={<AssignmentOutlinedIcon sx={{ fontSize: `${theme.spacing(3)} !important` }} />}
                  color="primary"
                  variant="contained"
                  sx={{
                    cursor: 'unset',
                    borderRadius: '50%',
                    padding: theme.spacing(1),
                    mr: {
                      xs: theme.spacing(1),
                      md: theme.spacing(3),
                    },
                    ml: {
                      xs: theme.spacing(0),
                      md: theme.spacing(2),
                    },
                    minWidth: 'unset',
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                  }}
                />
                <Typography
                  variant="h3"
                  children={(
                    <Box>
                      {title}
                      {subtitle}  
                    </Box>
                  )}
                />
              </Box>
              <Box>
                <ButtonCustom
                  startIcon={<CloseIcon sx={{ fontSize: `${theme.spacing(3)} !important` }} />}
                  color="error"
                  variant="text"
                  onClick={() => handleOpenDialogWarning({ type: 'stopLearning', title: t('End of current learning session'), message: t('Do you want to continue?'), confirmTitle: t('Ok') })}
                  sx={{
                    borderRadius: '50%',
                    padding: theme.spacing(1),
                    minWidth: 'unset',
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    bgcolor: theme.colors.error.lighter,
                    transition: 'transform 300ms',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      transition: 'transform 300ms',
                    },
                  }}
                />
              </Box>
            </BoxSession>
          </Paper>

          {/* word list */}
          {!!currentVocabulariesSlide.length && (
            <WordListWrapper>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  variant="h3" children={t('Word list')}
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    mr: 1,
                  }}
                />
                <ButtonCustom
                  variant="contained"
                  children={t('Test now')}
                  color="warning"
                  endIcon={<ArrowForwardOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                  sx={{
                    minWidth: 'unset',
                    p: '4px 12px',
                    fontSize: '12px',
                    lineHeight: 1,
                  }}
                  onClick={() => handleOpenDialogWarning({ type: 'goToTest', title: t('This will lead to test page'), message: t('Do you want to continue?'), confirmTitle: t('Ok') })}
                  rest={{
                    disabled: practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0
                  }}
                />
              </Box>
              <Box
                sx={{
                  mt: 1,
                  '.react-slideshow-container': {
                    minHeight: '46px',
                  },
                  '.indicators': {
                    visibility: currentVocabulariesSlide.length > 1 ? 'visible' : 'hidden',
                    '.each-slideshow-indicator': {
                      opacity: '.15 !important',
                    },
                    '.each-slideshow-indicator.active': {
                      opacity: '.5 !important',
                    }
                  }
                }}
              >
                {
                  <SlideVocabulary ref={slideRef} {...{...slideProperties, arrows: currentVocabulariesSlide.length > 1}}>
                    {
                      currentVocabulariesSlide.map((slideItem, slideItemIndex) => {
                        return (
                          <Box
                            key={slideItemIndex}
                            sx={{
                              // display: 'flex',
                              // justifyContent: 'space-evenly',
                              width: 'fit-content',
                              mx: 'auto',
                              px: 4,
                              textAlign: 'center',
                            }}
                          >
                            {
                              slideItem.map((item, index) => {
                                const memoryAnalyseIndex = currentMemoryAnalyses?.findIndex((memoryAnalyse) => {
                                  return memoryAnalyse.vocabulary.id === item.id;
                                }) ?? -1;
              
                                const memoryStatus = currentMemoryAnalyses?.[memoryAnalyseIndex]?.memoryStatus;
                                
                                const isCurrentVocabulary = slideItem?.[currentVocabularyIndex - slideItemIndex * limitVocabularyInSlide]?.id === item.id;

                                const isPractice = practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0 || learnVocabularyLoading;
              
                                if (!memoryStatus) {
                                  return (
                                    <ButtonCustom
                                      key={item.id}
                                      children={item.vocabulary}
                                      onClick={() => handleChangeVocabulary(index + slideItemIndex * limitVocabularyInSlide)}
                                      rest={{
                                        disabled: isPractice,
                                      }}
                                      sx={{
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        borderRadius: '22px',
                                        p: '4px 15px',
                                        mx: 0.5,
                                        my: 0.25,
                                        backgroundColor: `${isCurrentVocabulary ? theme.colors.primary.main : theme.colors.secondary.light} !important`,
                                        color: '#ffffff !important',
                                        cursor: 'pointer',
                                        lineHeight: '14px',
                                        whiteSpace: 'nowrap',
                                        userSelect: 'none',
                                        ...isPractice && { opacity: 0.5 },
                                      }}
                                    />
                                  );
                                } else {
                                  return (
                                    <LabelCustom
                                      key={item.id}
                                      children={item.vocabulary}
                                      onClick={() => {
                                        if (!isPractice )
                                          handleChangeVocabulary(index + slideItemIndex * limitVocabularyInSlide);
                                      }}
                                      color={
                                        memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Memorized
                                          ? 'success'
                                          : memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Vague
                                            ? 'warning'
                                            : 'error'
                                      }
                                      sx={{
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        borderRadius: '22px',
                                        p: '4px 15px',
                                        mx: 0.5,
                                        my: 0.25,
                                        backgroundColor: `${isCurrentVocabulary ? theme.colors.primary.main : '' } !important`,
                                        color: `${isCurrentVocabulary ? '#ffffff' : '' } !important`,
                                        cursor: isPractice ? 'default' : 'pointer',
                                        lineHeight: '14px',
                                        whiteSpace: 'nowrap',
                                        userSelect: 'none',
                                        ...isPractice && { opacity: 0.5 },
                                      }}
                                    />
                                  );
                                }
                              })
                            }
                          </Box>
                        );
                      })
                    }
                  </SlideVocabulary>
                }
              </Box>
            </WordListWrapper>
          )}

          {/* content and practice */}
          <ContentAndPracticeWrapper>
            <Grid container columnSpacing={2.5} alignItems="start"> 
              {/* content */}
              <Grid
                item
                xs={12}
                md={8}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                {/* title */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <StudentIcon sx={{ mr: '18px' }} />
                  <Typography
                    variant="h3" children={t('Content')}
                    sx={{
                      fontSize: '20px',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* vocabulary */}
                <Paper
                  id="learning-content"
                  elevation={1}
                  variant="elevation"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '6px',
                    p: 2.5,
                    position: 'relative',
                    boxShadow: theme.colors.shadows.card,
                    ...showLoadMoreLearningContent
                      ? {
                        maxHeight: '700px',
                        overflowY: 'hidden',
                      }
                      : {},
                  }}
                >
                  {/* image */}
                  {currentVocabulary?.image && (
                    <Box
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={currentVocabulary?.image}
                        // src="/images/source/lesson-test/prompt-image-demo.png"
                        alt="..."
                        style={{
                          maxHeight: '280px',
                        }}
                      />
                    </Box>
                  )}
                  
                  {/* vocabulary card */}
                  { currentVocabulary && (
                    <Box
                      sx={{
                        // minHeight: '270px',
                        display: 'flex',
                        alignItems: 'center',
                        my: { xs: 5, md: 7 },
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: '6px',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-evenly',
                          width: '100%',
                          maxWidth: '740px',
                          m: 'auto',
                          p: 1,
                          // TODO for test
                          // height: '200px',
                          // overflow: 'hidden',
                          // TODO end for test
                        }}
                      >
                        {/* vocabulary */}
                        <Box
                          sx={{
                            position: 'relative',
                            fontWeight: 700,
                            fontSize: currentVocabulary.vocabulary.length > 10 ? '44px' : '52px',
                            mx: { xs: 2, md: 4 },
                            my: '28px',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1',
                            width: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {/* pos */}
                          <Typography
                            variant="inherit"
                            children={currentVocabulary.pos}
                            sx={{
                              color: '#CCCCCC',
                              fontWeight: 400,
                              fontSize: '28px',
                              position: 'absolute',
                              top: '-30px',
                              right: 0,
                              transform: 'translate(50%, 0)'
                            }}
                          />

                          {/* void */}
                          <VolumeUpIcon
                            onClick={playAudioInContent}
                            sx={{
                              fontSize: '40px',
                              color: theme.colors.primary.main,
                              cursor: 'pointer',
                              transition: 'all 300ms',
                              '&:hover' : {
                                transform: 'scale(1.3)',
                              },
                              mr: '21px',
                            }}
                          />

                          {/* text */}
                          <p>{currentVocabulary.vocabulary}</p>

                          {/* phonetic */}
                          <Box
                            children={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'end',
                                }}
                              >
                                { currentVocabulary.phonetic && (
                                  <Typography
                                    variant="inherit"
                                    children={currentVocabulary.phonetic}
                                    sx={{
                                      fontSize: '24px',
                                      fontWeight: '700',
                                      color: addAlpha('#223354', 0.5)
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            sx={{
                              fontWeight: 700,
                              fontSize: '24px',
                              position: 'absolute',
                              bottom: '-30px',
                              left: '50%',
                              transform: 'translate(-50%, 0)'
                            }}
                          />
                        </Box>

                        {/* translation */}
                        <Typography
                          variant="inherit"
                          sx={{
                            fontWeight: 700,
                            fontSize: currentVocabulary.translation.length > 20 ? '26px' : '40px',
                            mx: { xs: 2, md: 4 },
                            mb: '-10px',
                            width: 'fit-content',
                            color: theme.colors.secondary.main
                          }}
                        >
                          {currentVocabulary.translation}
                        </Typography>
                      </Box>

                      {currentVocabulary && currentVocabulary.referenceId && showLoadMoreLearningContent && (
                        <Box
                          textAlign="center"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            left: 0,
                            bottom: '10px',
                          }}
                        >
                          {/* view more */}
                          <ButtonCustom
                            variant="outlined"
                            color="primary"
                            children={getVocabulariesIncludeWordReferLoading ? <LoadingData /> : t('View more')}
                            sx={{
                              minWidth: 'unset',
                              p: '0px 28px',
                              minHeight: '38px',
                              fontSize: '15px',
                              lineHeight: 1,
                              mx: 'auto',
                            }}
                            onClick={() => {
                              if (getVocabulariesIncludeWordReferLoading) return;

                              handleShowViewMoreContent(currentVocabulary?.id);
                            }}
                          />
                        </Box>
                      )}
                      
                      {!showMoreMeaning && !showLoadMoreLearningContent && (
                        <Box
                          textAlign="center"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            left: 0,
                            bottom: '10px',
                          }}
                        >
                          {/* view more */}
                          <ButtonCustom
                            variant="outlined"
                            color="primary"
                            children={t('Show meaning')}
                            sx={{
                              minWidth: 'unset',
                              p: '0px 28px',
                              minHeight: '38px',
                              fontSize: '15px',
                              lineHeight: 1,
                              mx: 'auto',
                            }}
                            onClick={() => setShowMoreMeaning(true)}
                          />
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* meaning */}
                  {showMoreMeaning && (
                    <Box sx={{ minHeight: '0px', display: 'flex', justifyContent: 'center' }}>
                      {/* { getVocabulariesIncludeWordReferLoading */}
                      {!showLoadMoreLearningContent && !!Object.entries(currentVocabularyIncludeWordRefer?.referData ?? {}).length && (
                        <Grid container columnSpacing={2.5} alignItems="start" mb={4}>
                          {/* Define */}
                          { !!Object.entries(currentVocabularyIncludeWordRefer?.referData?.definition ?? {}).length && (
                            <Grid
                              item
                              xs={12}
                              md={!Object.entries(currentVocabularyIncludeWordRefer?.referData?.translation ?? {}).length ? 12 : 8}
                              sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                              {/* title */}
                              <Typography
                                variant="inherit" children={t('Definition')}
                                sx={{
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                }}
                              />
                              {
                                Object.entries(currentVocabularyIncludeWordRefer?.referData?.definition ?? {}).map((item: [any, any], index: number) => {
                                  const key: WordTypes = item[0];

                                  return (
                                    !!currentVocabularyIncludeWordRefer?.referData?.definition?.[key]?.length && (
                                      <Box
                                        sx={{
                                          mt: 3,
                                        }}
                                        key={key+index}
                                      >
                                        <Typography
                                          variant="inherit"
                                          children={
                                            t(
                                              key
                                                .split('')
                                                .map(
                                                  (item, index) =>
                                                    index === 0
                                                      ? item.toUpperCase()
                                                      : index === key.length - 1
                                                        ? null
                                                        : item
                                                )
                                                .filter(item => item)
                                                .join('')
                                            )
                                          }
                                          sx={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: theme.colors.primary.main,
                                          }}
                                        />
                                        <Box>
                                          {(cloneDeep(currentVocabularyIncludeWordRefer?.referData?.definition?.[key]) || []).map((item, index) => {
                                            return (
                                              <Box
                                                sx={{
                                                  px: 4.5,
                                                  position: 'relative',
                                                  mt: 1,
                                                }}
                                                key={index}
                                              >
                                                <Typography
                                                  variant="inherit"
                                                  children={index + 1}
                                                  sx={{
                                                    borderRadius: '50%',
                                                    backgroundColor: theme.colors.secondary.main,
                                                    color: '#ffffff',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'absolute',
                                                    fontSize: '10px',
                                                    fontWeight: 400,
                                                    width: '20px',
                                                    height: '20px',
                                                    top: '3px',
                                                    left: '8px',
                                                  }}
                                                />
                                                <Typography
                                                  variant="inherit"
                                                  children={item.explanation}
                                                  sx={{
                                                    fontSize: '18px',
                                                    fontWeight: 400
                                                  }}
                                                />
                                                
                                                {
                                                  item.examples.map((example, index) => {
                                                    return (
                                                      <Box
                                                        key={index}
                                                        sx={{
                                                          width: '100%',
                                                          display: 'flex',
                                                          mt: 1,
                                                        }}
                                                      >
                                                        <Typography
                                                          variant="inherit"
                                                          children={example.sentence}
                                                          sx={{
                                                            width: '50%',
                                                            fontSize: '16px',
                                                            fontWeight: 400,
                                                            color: theme.colors.secondary.dark,
                                                          }}
                                                        />
                                                        <Typography
                                                          variant="inherit"
                                                          children={example.translation}
                                                          sx={{
                                                            width: '50%',
                                                            fontSize: '16px',
                                                            fontWeight: 400,
                                                          }}
                                                        />
                                                      </Box>
                                                    );
                                                  })
                                                }
          
                                                {!!item?.synonyms?.length && (
                                                  <Typography
                                                    variant="inherit"
                                                    children={`${t('Synonyms')}:`}
                                                    sx={{
                                                      fontSize: '16px',
                                                      fontWeight: 400,
                                                      my: 1,
                                                    }}
                                                  />
                                                )}
                                                {
                                                  item.synonyms.map((synonym, index) => {
                                                    return (
                                                      <ButtonCustom
                                                        key={index}
                                                        variant="outlined"
                                                        color="inherit"
                                                        children={synonym}
                                                        sx={{
                                                          fontSize: '16px',
                                                          fontWeight: 300,
                                                          color: theme.colors.secondary.dark,
                                                          backgroundColor: 'unset !important',
                                                          borderRadius: '10px',
                                                          lineHeight: '19px',
                                                          p: '0px 8px',
                                                          minWidth: 'unset',
                                                          mr: 1,
                                                          cursor: 'default',
                                                        }}
                                                      />
                                                    );
                                                  })
                                                }
                                                
                                                {!!item.antonyms.length && (
                                                  <Typography
                                                    variant="inherit"
                                                    children={`${t('Antonyms')}:`}
                                                    sx={{
                                                      fontSize: '16px',
                                                      fontWeight: 400,
                                                      my: 1,
                                                    }}
                                                  />
                                                )}
                                                {
                                                  item.antonyms.map((antonym, index) => {
                                                    return (
                                                      <ButtonCustom
                                                        key={index}
                                                        variant="outlined"
                                                        color="inherit"
                                                        children={antonym}
                                                        sx={{
                                                          fontSize: '16px',
                                                          fontWeight: 300,
                                                          color: theme.colors.secondary.dark,
                                                          backgroundColor: 'unset !important',
                                                          borderRadius: '10px',
                                                          lineHeight: '19px',
                                                          p: '0px 8px',
                                                          minWidth: 'unset',
                                                          mr: 1,
                                                          cursor: 'default',
                                                        }}
                                                      />
                                                    );
                                                  })
                                                }
                                              </Box>
                                            );
                                          })}
                                        </Box>
                                      </Box>
                                    )
                                  );
                                })
                              }
                            </Grid>
                          )}

                          {/* Translate */}
                          { !!Object.entries(currentVocabularyIncludeWordRefer?.referData?.translation ?? {}).length && (
                            <Grid 
                              item
                              xs={12}
                              md={!Object.entries(currentVocabularyIncludeWordRefer?.referData?.definition ?? {}).length ? 12 : 4}
                              sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <Typography
                                variant="inherit" children={t('Translation')}
                                sx={{
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                }}
                              />

                              {
                                Object.entries(currentVocabularyIncludeWordRefer?.referData?.translation ?? {}).map((item: [any, any], index: number) => {
                                  const key: WordTypes = item[0];

                                  return (
                                    !!currentVocabularyIncludeWordRefer?.referData?.translation?.[key]?.length && (
                                      <Box
                                        sx={{
                                          mt: 3,
                                        }}
                                        key={key+index}
                                      >
                                        <Typography
                                          variant="inherit"
                                          children={
                                            t(
                                              key
                                                .split('')
                                                .map(
                                                  (item, index) =>
                                                    index === 0
                                                      ? item.toUpperCase()
                                                      : index === key.length - 1
                                                        ? null
                                                        : item
                                                )
                                                .filter(item => item)
                                                .join('')
                                            )
                                          }
                                          sx={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: theme.colors.primary.main,
                                          }}
                                        />
                                        <Box>
                                          {
                                            (cloneDeep(currentVocabularyIncludeWordRefer?.referData?.translation?.[key]) || []).map((item, index) => {
                                              return (
                                                <Box
                                                  key={index}
                                                  sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    mt: 1,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="inherit"
                                                    children={item.translation}
                                                    sx={{
                                                      width: '50%',
                                                      fontSize: '18px',
                                                      fontWeight: 400,
                                                      maxWidth: '200px',
                                                    }}
                                                  />
                                                  <Typography
                                                    variant="inherit"
                                                    children={item.synonym}
                                                    sx={{
                                                      width: '50%',
                                                      fontSize: '18px',
                                                      fontWeight: 400,
                                                      color: theme.colors.secondary.dark,
                                                    }}
                                                  />
                                                </Box>
                                              );
                                            })
                                          }
                                        </Box>
                                      </Box>
                                    )
                                  );
                                })
                              }
                            </Grid>
                          )}
                        </Grid>
                      )}

                      {!showLoadMoreLearningContent && showMoreMeaning && (
                        <Box
                          textAlign="center"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            left: 0,
                            bottom: '10px',
                          }}
                        >
                          {/* view more */}
                          <ButtonCustom
                            variant="outlined"
                            color="primary"
                            children={t('Hide meaning')}
                            sx={{
                              minWidth: 'unset',
                              p: '0px 28px',
                              minHeight: '38px',
                              fontSize: '15px',
                              lineHeight: 1,
                              mx: 'auto',
                            }}
                            onClick={() => setShowMoreMeaning(false)}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              {/* practice */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* title */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  {/* group title */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <PracticeIcon sx={{ mr: '18px' }} />
                    <Typography
                      variant="h3" children={t('Practice')}
                      sx={{
                        fontSize: '20px',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* group scores */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* writing */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img alt="" src="/images/icon/group-write.png" width="30" />
                      { cloneDeep(practiceData).filter(item => item.write).length >= 5
                        ? (
                          <CheckIcon
                            sx={{
                              ml: 0.5,
                              color: theme.colors.success.dark,
                              fontSize: '24px',
                              borderRadius: '50%',
                              // backgroundColor: theme.colors.success.lighter,
                              // boxShadow: theme.colors.shadows.card,
                            }}
                          />
                        )
                        : (
                          <Typography
                            variant="inherit"
                            children={`${cloneDeep(practiceData).filter(item => item.write).length}/5`}
                            sx={{
                              ml: 0.5,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: theme.colors.secondary.light,
                            }}
                          />
                        )
                      }
                    </Box>

                    {/* listing */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: '14px',
                      }}
                    >
                      <img alt="" src="/images/icon/group-listen.png" width="30" />
                      { cloneDeep(practiceData).filter(item => item.listen).length >= 5
                        ? (
                          <CheckIcon
                            sx={{
                              ml: 0.5,
                              color: theme.colors.success.dark,
                              fontSize: '24px',
                              borderRadius: '50%',
                              // backgroundColor: theme.colors.success.lighter,
                              // boxShadow: theme.colors.shadows.card,
                            }}
                          />
                        )
                        : (
                          <Typography
                            variant="inherit"
                            children={`${cloneDeep(practiceData).filter(item => item.listen).length}/5`}
                            sx={{
                              ml: 0.5,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: theme.colors.secondary.light,
                            }}
                          />
                        )
                      }
                    </Box>

                    {/* speaking */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: '14px',
                      }}
                    >
                      <img alt="" src="/images/icon/group-speak.png" width="30" />
                      { cloneDeep(practiceData).filter(item => item.speak).length >= 5
                        ? (
                          <CheckIcon
                            sx={{
                              ml: 0.5,
                              color: theme.colors.success.dark,
                              fontSize: '24px',
                              borderRadius: '50%',
                              // backgroundColor: theme.colors.success.lighter,
                              // boxShadow: theme.colors.shadows.card,
                            }}
                          />
                        )
                        : (
                          <Typography
                            variant="inherit"
                            children={`${cloneDeep(practiceData).filter(item => item.speak).length}/5`}
                            sx={{
                              ml: 0.5,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: theme.colors.secondary.light,
                            }}
                          />
                        )
                      }
                    </Box>
                  </Box>
                </Box>
                
                {/* write word input */}
                <Box
                  sx={{
                    // backgroundColor: theme.colors.secondary.lighter,
                    backgroundColor: theme.colors.alpha.white[100],
                    boxShadow: theme.colors.shadows.card,
                    borderRadius: '6px',
                    p: 2.5,
                    mb: 1,
                  }}
                >
                  <TextField
                    inputRef={writeWordInputRef}
                    value={writeWordValue}
                    size="small"
                    placeholder={t('Re-enter the word.......')}
                    fullWidth
                    sx={{
                      borderRadius: '4px',
                      '& .MuiOutlinedInput-root': {
                        WebkitTapHighlightColor: 'transparent !important',
                        // backgroundColor: '#ffffff',
                        '& fieldset': {
                          border: `2px solid ${theme.colors.primary.light}`,
                        },
                        '&:hover fieldset': {
                          border: `2px solid ${theme.colors.primary.main}`,
                        },
                        '&.Mui-focused fieldset': {
                          border: `2px solid ${theme.colors.primary.main}`,
                        },
                        '&.Mui-disabled fieldset': {
                          border: '2px solid #22335480',
                        },
                      },
                    }}
                    onChange={handleWrite}
                    onKeyUp={handleWrite}
                    disabled={!!practiceItemInProgressId}
                  />
                </Box>

                {/* write word records */}
                <Box
                  sx={{
                    height: '100%',
                    maxHeight: '613px',
                    overflowY: 'auto',
                  }}
                >
                  {cloneDeep(practiceData).map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        boxShadow: theme.colors.shadows.card,
                        borderRadius: '6px',
                        backgroundColor: theme.colors.alpha.white[100],
                        p: 2.5,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="inherit"
                            children={item.text}
                            sx={{
                              color: '#ffffff',
                              backgroundColor: item.write ? theme.colors.success.dark : theme.colors.error.dark,
                              borderRadius: '16px',
                              p: '0px 12px',
                              fontSize: '18px',
                              fontWeight: '500',
                              mr: 0.5,
                            }}
                          />
                          { item.write && item.errorLoadingAudio && (
                            <Tooltip
                              arrow
                              placement="right"
                              title={t('Unable to load audio file')}
                              sx={{ display: 'flex' }}
                            >
                              <Box sx={{ display: 'flex', opacity: 0.5 }}>
                                <VolumeOffIcon /> 
                              </Box>
                            </Tooltip>
                          )}
                        </Box>

                        {
                          item.listen === undefined
                            ? <VolumeUpIcon
                              className="animate-ping"
                              sx={{
                                fontSize: '24px',
                                color: theme.colors.primary.main,
                              }}
                            />
                            : item.speak === undefined
                              ? <Box sx={{ display: 'flex' }}>
                                <Typography
                                  variant="inherit"
                                  children={textRecording}
                                  sx={{ mr: 1 }}
                                />
                                <VoiceRecording
                                  setVoiceRecording={setTextRecording}
                                  handleAnswers={(textRecording) => handleSpeak(item.id, textRecording)}
                                  isClicked={false}
                                  lang="en-US"
                                  microSize="24px"
                                  autoStart
                                  autoStartInTime={pronounceTime}
                                  correctAnswer={currentVocabulary?.vocabulary}
                                  sx={{
                                    p: 0,
                                    backgroundColor: 'unset !important',
                                    cursor: 'default',
                                    mr: 1.5,
                                  }}
                                />
                                <Typography
                                  variant="inherit"
                                  children={pronounceTimer}
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    color: theme.colors.secondary.main,
                                    minWidth: '10px',
                                  }}
                                />
                              </Box>
                              : <ButtonCustom
                                variant="outlined"
                                color={
                                  item.write
                                    ? item.speak
                                      ? 'success'
                                      : 'warning'
                                    : 'error'
                                }
                                startIcon={
                                  item.write
                                    ? item.speak
                                      ? <CheckIcon />
                                      : <RefreshIcon />
                                    : <CloseIcon />
                                }
                                children={
                                  item.write
                                    ? item.speak
                                      ? t('The correct pronunciation')
                                      : t('Re-pronounce')
                                    : t('Incorrect vocabulary')
                                }
                                sx={{
                                  border: 'unset !important',
                                  fontSize: '12px',
                                  cursor: !(item.write && !item.speak) ? 'default' : 'pointer',
                                  backgroundColor: !(item.write && !item.speak) ? 'unset !important' : '',
                                  p: '2px 12px',
                                }}
                                onClick={item.write && !item.speak ? () => reStartSpeaking(item.id) : undefined}
                                rest={{
                                  disabled: (item.write && !item.speak) && !!practiceItemInProgressId,
                                }}
                              />
                        }
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* next button */}
            <Box sx= {{ width: '100%', mt: theme.spacing(2), textAlign: 'center', }}>
              {
                currentVocabularyIndex === currentVocabularies.length - 1
                  ? <ButtonCustom
                    variant="contained"
                    children={t('Test')}
                    color="warning"
                    endIcon={<ArrowForwardOutlinedIcon sx={{ fontSize: '20px !important' }} />}
                    sx={{
                      minWidth: 'unset',
                      p: '10px 28px',
                      fontSize: '15px',
                      lineHeight: 1,
                    }}
                    onClick={() => handleGoToTest(title)}
                    rest={{
                      disabled: practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0
                    }}
                  />
                  : <ButtonCustom
                    variant="contained"
                    children={t('Next')}
                    endIcon={<ArrowForwardOutlinedIcon sx={{ fontSize: '20px !important' }} />}
                    sx={{
                      minWidth: 'unset',
                      p: '10px 28px',
                      fontSize: '15px',
                      lineHeight: 1,
                    }}
                    onClick={() => handleChangeVocabulary(currentVocabularyIndex + 1)}
                    rest={{
                      disabled: practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0 || learnVocabularyLoading
                    }}
                  />
              }
            </Box>
          </ContentAndPracticeWrapper>

          {/* lesson list */}
          { showLessonList && !! lessons?.length && (
            <LessonListWrapper>
              <Typography
                variant="h3" children={t('Lesson list')}
                sx={{
                  fontSize: '20px',
                  fontWeight: 700,
                }}
              />
              <Box sx={{ mt: 1 }}>
                {
                  lessons.map((item, index) => {
                    const isCurrentItem = index === currentLessonIndex;
                    return (
                      <ButtonCustom
                        key={item.id}
                        onClick={() => handleChangeLesson(item.id)}
                        rest={{
                          disabled: !item.vocabularies.length || practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0,
                        }}
                        children={
                          <Box sx={{ display: 'flex', alignItems: 'center' }} >
                            <Typography
                              variant="h3" children={item.name}
                              sx={{
                                fontSize: '18px',
                                fontWeight: 500,
                                mr: theme.spacing(2.5),
                                lineHeight: 1,
                                color: `${isCurrentItem ? '#ffffff' : theme.colors.secondary.dark} !important`,
                              }}
                            />
                            <Typography
                              variant="h3" children={`${item?.vocabularies?.length ?? 0} ${t('word')}`}
                              sx={{
                                fontSize: '12px',
                                lineHeight: '15px',
                                fontWeight: 500,
                                borderRadius: '26px',
                                height: '20px', 
                                minWidth: '52px',
                                padding: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: `${theme.colors.secondary.light} !important`,
                                color: '#ffffff !important'
                              }}
                            />
                          </Box>
                        }
                        sx={{
                          opacity: !item.vocabularies.length || practiceData.findIndex(item => item.listen === undefined || item.speak === undefined) >= 0 ? 0.5 : 1,
                          fontSize: '18px',
                          fontWeight: '700',
                          borderRadius: '40px',
                          p: '12px 16px',
                          mr: '12px',
                          mb: '12px',
                          backgroundColor: `${isCurrentItem ? theme.colors.secondary.main : '#ffffff'} !important`,
                          color: `${isCurrentItem ? '#ffffff' : theme.colors.primary.main} !important`,
                          cursor: 'pointer',
                          boxShadow: `0px 0px 2px 0px ${theme.palette.grey[500]}`,
                          minWidth: '192px',
                          ':hover': {
                            boxShadow: theme.colors.shadows.card,
                          }
                        }}
                      />
                    );
                  })
                }
              </Box>
            </LessonListWrapper>
          )}

          {/* comment */}
          { !!commentsData && (
            <CommentsWrapper>
              <Typography
                variant="h3" children={t('Comment/ Discussion')}
                sx={{
                  fontSize: '20px',
                  fontWeight: 700,
                }}
              />
              <Paper
                elevation={1}
                variant="elevation"
                sx={{
                  mt: 1,
                  borderRadius: '6px',
                  p: {
                    xs: 1,
                    md: 4,
                  }
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    mb: 1.5,
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
                      src={currentUser?.identity?.traits.picture ?? ''}
                    />
                    <TextField
                      multiline
                      maxRows={4}
                      value={formState.message}
                      onChange={handleChange}
                      variant="standard"
                      name="message"
                      fullWidth
                      sx={{
                        '.MuiInputBase-root::before': {
                          borderBottom: `2px solid ${theme.palette.common.black}`,
                          opacity: 0.1,
                        },
                      }}
                      placeholder={t('Do you have any questions or suggestions for this topic?')}
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
                      children={t('Comment')}
                      onClick={handleComment}
                    />
                  </Box>
                </Box>
                {currentUser && commentsData.map((item, index) => {
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
              </Paper>
            </CommentsWrapper>
          )}
        </BoxWrapper>
      </DialogContent>

      { openReactionList && (
        <ViewReactionList
          open={openReactionList}
          setOpen={setOpenReactionList}
          title={reactionListTitle}
          reactionList={reactionList}
        />
      )}

      {dialogWarningValue.open && (
        <DialogConfirm
          open={dialogWarningValue.open}
          type={DialogConfirmType.warning}
          message={dialogWarningValue.message}
          title={dialogWarningValue.title}
          onCancel={handleCloseDialogWarning}
          onConfirm={() => handleConfirmDialogWarning(dialogWarningValue)}
          confirmTitle={dialogWarningValue.confirmTitle}
          cancelTitle={dialogWarningValue.cancelTitle}
        />
      )}
    </Dialog>
  );
};

export { LearningPage };
