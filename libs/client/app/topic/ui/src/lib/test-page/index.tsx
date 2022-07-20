import { Dispatch, FC, forwardRef, ReactNode, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, Dialog, DialogContent, Paper,
  Slide,
  SlideProps, Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { lighten, SxProps } from '@mui/system';

import { useLazyQuery, useMutation } from '@apollo/client';
import { cloneDeep, shuffle } from 'lodash';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useTranslation } from 'react-i18next';

import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';

import { ToastifyContext } from '@els/client/app/shared/contexts';
import { ApolloClient } from '@els/client/shared/data-access';

import { ButtonCustom, LineProgress } from '@els/client/app/shared/ui';
import { DialogConfirm, DialogConfirmType } from '@els/client/shared/ui';
import { millisecondsToHours } from '@els/client/shared/utils';
import moment from 'moment';
import { useRouter } from 'next/router';
import FillSelectAudio from './fill-select-audio';
import FillSelectVideo from './fill-select-video';
import FillTypeAudio from './fill-typing-audio';
import FillTypeVideo from './fill-typing-video';
import FillWriteAudio from './fill-write-audio';
import FillWriteVideo from './fill-write-video';
import ResultAnnouncement from './result-announcement';
import ShortWriteAudio from './short-write-audio';
import ShortWriteVideo from './short-write-video';
import SpeakSpeak from './speak-speak';
import TestOverview from './test-overview';
import TestResults from './test-results';
import TranslateArrange from './translate-arrange';
import TranslateSelect from './translate-select';
import TranslateSelectCard from './translate-select-card';
import TranslateTyping from './translate-typing';
import TranslateWrite from './translate-write';
// import { v4 as uuidv4 } from 'uuid';

const CountdownCircleTimerSize = 78;

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1274px;
    width: 100%;
  `
);

const BoxSession = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `
);

const Transition = forwardRef<unknown, SlideProps>((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

interface RenderTestFormData {
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  isAnswered: boolean;
  setIsAnswered?: (e?: any) => void;
  setIsRightAnswer: (isRightAnswer: boolean) => void;
  handleScoreIncrease: () => void;
  setCorrectAnswer: (correctAnswer: ReactNode) => void;
  handleOpenResultAnnouncement: () => void;
  handleAddSkillsScore: (skillsName: Array<GraphqlTypes.LearningTypes.Skill['name']>) => void;
  handleAnswer: (answer: string) => void;
  setInFocusInput: Dispatch<SetStateAction<boolean>>;
  autoPlayAudio: boolean;
}

const RenderTestForm: FC<RenderTestFormData> = (renderTestFormData) => {
  const {
    vocabulary,
    isAnswered,
    setIsAnswered,
    setIsRightAnswer,
    handleScoreIncrease,
    setCorrectAnswer,
    handleOpenResultAnnouncement,
    handleAddSkillsScore,
    handleAnswer,
    setInFocusInput,
    autoPlayAudio,
  } = renderTestFormData;

  // return null;
  const check = false;
  switch (`${vocabulary?.questions?.[0]?.type}-${vocabulary?.questions?.[0]?.action}`) {
    case 'fill-select':
      if (vocabulary.questions[0].prompt.video) {
        if (check) console.log('fill-select-video');
        return (
          <FillSelectVideo
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
          />
        );
      }
      if (vocabulary.questions[0].prompt.audio) {
        if (check) console.log('fill-select-audio');
        return (
          <FillSelectAudio
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
          />
        );
      }
      return null;

    case 'fill-type':
      if (vocabulary.questions[0].prompt.video) {
        if (check) console.log('fill-type-video');
        return (
          <FillTypeVideo
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
          />
        );
      }
      if (vocabulary.questions[0].prompt.audio) {
        if (check) console.log('fill-type-audio');
        return (
          <FillTypeAudio
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
          />
        );
      }
      return null;

    case 'fill-write':
      if (vocabulary.questions[0].prompt.video) {
        if (check) console.log('fill-write-video');
        return (
          <FillWriteVideo
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
            setInFocusInput={setInFocusInput}
          />
        );
      }
      if (vocabulary.questions[0].prompt.audio) {
        if (check) console.log('fill-write-audio');
        return (
          <FillWriteAudio
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
            setInFocusInput={setInFocusInput}
          />
        );
      }
      return null;

    case 'speak-speak':
      if (check) console.log('speak-speak');
      return (
        <SpeakSpeak
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
        />
      );

    case 'translate-arrange':
      if (check) console.log('translate-arrange');
      return (
        <TranslateArrange
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
        />
      );

    case 'translate-select':
      if (check) console.log('translate-select');
      return (
        <TranslateSelect
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
          autoPlayAudio={autoPlayAudio}
        />
      );

    case 'translate-type':
      if (check) console.log('translate-type');
      return (
        <TranslateTyping
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
        />
      );

    case 'translate-write':
      if (check) console.log('translate-write');
      return (
        <TranslateWrite
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
          setInFocusInput={setInFocusInput}
        />
      );

    case 'translate-select_card':
      if (check) console.log('translate-select_card');
      return (
        <TranslateSelectCard
          key={vocabulary.id}
          vocabulary={vocabulary}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
          handleScoreIncrease={handleScoreIncrease}
          setIsRightAnswer={setIsRightAnswer}
          setCorrectAnswer={setCorrectAnswer}
          handleOpenResultAnnouncement={handleOpenResultAnnouncement}
          handleAddSkillsScore={handleAddSkillsScore}
          handleAnswer={handleAnswer}
        />
      );

    case 'short_input-write':
      if (vocabulary.questions[0].prompt.video) {
        if (check) console.log('short_input-write-video');
        return (
          <ShortWriteVideo
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
            setInFocusInput={setInFocusInput}
          />
        );
      }
      if (vocabulary.questions[0].prompt.audio) {
        if (check) console.log('short_input-write-audio');
        return (
          <ShortWriteAudio
            key={vocabulary.id}
            vocabulary={vocabulary}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            handleScoreIncrease={handleScoreIncrease}
            setIsRightAnswer={setIsRightAnswer}
            setCorrectAnswer={setCorrectAnswer}
            handleOpenResultAnnouncement={handleOpenResultAnnouncement}
            handleAddSkillsScore={handleAddSkillsScore}
            handleAnswer={handleAnswer}
            setInFocusInput={setInFocusInput}
          />
        );
      }
      return null;

    default:
      return null;

      // return (
      //   <ShortWriteVideo
      //     vocabulary={vocabulary}
      //     isAnswered={isAnswered}
      //     setIsAnswered={setIsAnswered}
      //     handleScoreIncrease={handleScoreIncrease}
      //     setIsRightAnswer={setIsRightAnswer}
      //     setCorrectAnswer={setCorrectAnswer}
      //     handleOpenResultAnnouncement={handleOpenResultAnnouncement}
      //     handleAddSkillsScore={handleAddSkillsScore}
      //   />
      // );
  }
};

export enum Equipments {
  headphone = 'headphone',
  microphone = 'microphone',
};

export type EquipmentsChecked = {
  [key in Equipments]: boolean;
};

export type SkillScore = {
  [key in GraphqlTypes.LearningTypes.Skill['name']]: number;
};

export interface QuickTestData {
  equipments: string[],
  numberOfQuestions: number,
  topicIds: string[],
};

export interface AnswersResultType {
  id: string; vocabulary: string; correctAnswer: string; answer: string; isRightAnswer: boolean;
};
export interface SkillsPercentType {
  listening: { pass: number; all: number; };
  speaking: { pass: number; all: number; };
  reading: { pass: number; all: number; };
  writing: { pass: number; all: number; };
}

export interface TestPageProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  sx?: SxProps;

  // required (vocabularies && topicId) || (isQuickTest && quickTestData && setOpenQuickTest)
  vocabularies?: GraphqlTypes.LearningTypes.Vocabulary[];
  topicId?: string;

  isQuickTest?: boolean;
  quickTestData?: QuickTestData;
  setOpenQuickTest?: (isOpen: boolean) => void;
  setQuickTestLoading?: (isOpen: boolean) => void;
}

const TestPage = (props: TestPageProps) => {
  const { title, subtitle, vocabularies: vocabulariesOriginal, topicId, isQuickTest, quickTestData, setOpenQuickTest, setQuickTestLoading, sx, open, setOpen } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const router = useRouter();

  const inTopicDetailPage = router.pathname === '/learning/[id]';

  // page ref
  const currentDuration = useRef<number>(30);
  const testStartTimeRef = useRef<Date>(new Date());
  const endStartTimeRef = useRef<Date>(new Date());
  const currentAnswerRef = useRef<string>('');
  const answersResultRef = useRef<AnswersResultType[]>([]);
  const getQuestionsTimeoutRef = useRef<any>(null);
  const getQuickTestTimeoutRef = useRef<any>(null);

  const skillsPercentInit: SkillsPercentType = {
    listening: { pass: 0, all: 0, },
    speaking: { pass: 0, all: 0, },
    reading: { pass: 0, all: 0, },
    writing: { pass: 0, all: 0, },
  };
  const skillsPercent = useRef<SkillsPercentType>(skillsPercentInit);

  // page state
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();

  const [equipmentsChecked, setEquipmentsChecked] = useState<EquipmentsChecked>({
    headphone: true,
    microphone: true,
  });

  const [skillsScore, setSkillsScore] = useState<SkillScore>({
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  });

  const [vocabularies, setVocabularies] = useState<GraphqlTypes.LearningTypes.Vocabulary[]>([]);
  const [questions, setQuestions] = useState<GraphqlTypes.LearningTypes.Question[]>([]);
  const [vocabulary, setVocabulary] = useState<GraphqlTypes.LearningTypes.Vocabulary | undefined>();

  const [scores, setScores] = useState<number>(0);

  const [testOverview, setTestOverview] = useState<boolean>(true);
  const [testResult, setTestResult] = useState<boolean>(false);
  // TODO for test
  // const [testOverview, setTestOverview] = useState<boolean>(false);
  // const [testResult, setTestResult] = useState<boolean>(true);

  const [isRetest, setIsRetest] = useState<boolean>(false);
  const [retestBoolean, setRetestBoolean] = useState<boolean>(false);
  const [questionsLoading, questionsSetLoading] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const [openResultAnnouncement, setOpenResultAnnouncement] = useState<boolean>(false);
  const [isRightAnswer, setIsRightAnswer] = useState<boolean>(false);
  const [correctAnswer, setCorrectAnswer] = useState<ReactNode>();
  const [inFocusInput, setInFocusInput] = useState<boolean>(false);
  const [inProcess, setInProcess] = useState<boolean>(false);
  //* get data
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
    }
  );

  const [GetMyTopics] = useLazyQuery<{ myTopics: GraphqlTypes.LearningTypes.Topic[] }>(
    GraphqlQueries.LearningQueries.Topic.GetMyTopics,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
    },
  );

  const [GetQuestions, { error: questionsError }] = useLazyQuery<{ questions: GraphqlTypes.LearningTypes.Question[] }>(
    GraphqlQueries.LearningQueries.Question.GetQuestions,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        setQuestions(data?.questions ?? []);

        questionsSetLoading(false);

        handleReset(isRetest);
      },
      onError: () => {
        questionsSetLoading(false);
      },
      fetchPolicy: 'network-only', // ? note: Because when using the "Retest" function, you need to reload the new question list
    },
  );

  const [GetQuickTest, { loading: getQuickTestLoading, data: quickTestResponse }] = useLazyQuery<{ quickTest: GraphqlTypes.LearningTypes.Question[] }>(
    GraphqlQueries.LearningQueries.Question.GetQuickTest,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (setOpenQuickTest) setOpenQuickTest(false);

        questionsSetLoading(false);

        handleReset(isRetest);
      },
      onError: () => {
        questionsSetLoading(false);
      },
      fetchPolicy: 'network-only', // ? note: Because when using the "Retest" function, you need to reload the new question list
    },
  );

  const UpdateMemoryAnalysisRefetchQueries = [];
  if (inTopicDetailPage) {
    UpdateMemoryAnalysisRefetchQueries.push(GraphqlQueries.LearningQueries.Topic.GetMyTopicDetails);
  }

  const [UpdateMemoryAnalysisGql] = useMutation(GraphqlMutations.LearningMutations.Enrollment.UpdateMemoryAnalysis, {
    // ? note:
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: () => {
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
    refetchQueries: UpdateMemoryAnalysisRefetchQueries,
  });

  //* Dialog Warning
  interface DialogWarningValueType {
    open: boolean,
    type: string | 'stopTesting',
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
      type: 'stopTesting',
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

    if (dialogWarningValue.type === 'stopTesting') handleClose();
  };

  //* handle logic
  const archiveTheAnswer = useCallback((answer = '') => {
    if (vocabulary) {
      const isRightAnswer = compareAnswer(vocabulary.questions[0].correctAnswer, answer);
      answersResultRef.current.push({
        id: vocabulary.id,
        vocabulary: vocabulary.vocabulary,
        correctAnswer: vocabulary.questions[0].correctAnswer,
        answer: answer,
        isRightAnswer: isRightAnswer,
      });

      skillsPercent.current = {
        listening: {
          all: skillsPercent.current.listening.all + (vocabulary.questions[0].skills.indexOf('listening') >= 0 ? 1 : 0),
          // auto pass when have answer
          pass: skillsPercent.current.listening.pass + ((vocabulary.questions[0].skills.indexOf('listening') >= 0 && answer) ? 1 : 0)
        },
        speaking: {
          all: skillsPercent.current.speaking.all + (vocabulary.questions[0].skills.indexOf('speaking') >= 0 ? 1 : 0),
          pass: skillsPercent.current.speaking.pass + ((vocabulary.questions[0].skills.indexOf('speaking') >= 0 && isRightAnswer) ? 1 : 0)
        },
        reading: {
          all: skillsPercent.current.reading.all + (vocabulary.questions[0].skills.indexOf('reading') >= 0 ? 1 : 0),
          // auto pass when have answer
          pass: skillsPercent.current.reading.pass + ((vocabulary.questions[0].skills.indexOf('reading') >= 0 && answer) ? 1 : 0)
        },
        writing: {
          all: skillsPercent.current.writing.all + (vocabulary.questions[0].skills.indexOf('writing') >= 0 ? 1 : 0),
          pass: skillsPercent.current.writing.pass + ((vocabulary.questions[0].skills.indexOf('writing') >= 0 && isRightAnswer) ? 1 : 0)
        },
      };
    }
  }, [vocabulary]);

  const handleScoreIncrease = (scores: number) => {
    console.log(scores);
    setScores(scores + 1);
  };

  const handleAddSkillsScore = (skillsName: Array<GraphqlTypes.LearningTypes.Skill['name']>) => {
    const addSkillsScore: SkillScore = {};

    skillsName.forEach(item => addSkillsScore[item] = skillsScore[item] + 1);

    setSkillsScore({
      ...skillsScore,
      ...addSkillsScore,
    });
  };

  const handleStartTest = () => {
    setTestOverview(false);
    setTestProgress(1);
  };

  const handleReset = (showOverview = true) => {
    setIsRetest(true);

    setTestOverview(!showOverview);
    setTestResult(false);
    setTestProgress(1);
    setIsAnswered(false);
    setIsRightAnswer(false);
    setScores(0);
    setSkillsScore({
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    });
    currentAnswerRef.current = '';
    testStartTimeRef.current = new Date();
    answersResultRef.current = [];
    skillsPercent.current = skillsPercentInit;
  };

  const handlePreviousTest = (testProgress: number) => { // TODO only for test
    if (testProgress < 2) return;

    setIsAnswered(false);

    const newTestProgress = testProgress - 1;
    setTestProgress(newTestProgress);
  };

  const handleNextTest = useCallback((testProgress: number) => {
    if (vocabulary) {
      archiveTheAnswer(currentAnswerRef.current);

      handleAddSkillsScore(vocabulary?.questions?.[0]?.skills ?? []);

      const newTestProgress = testProgress + 1;
      setTestProgress(newTestProgress);

      setIsRightAnswer(false);
      if (testProgress >= vocabularies.length) return;
      setIsAnswered(false);
    }
  }, [vocabulary]);
  const handleSkipTest = useCallback((testProgress: number) => {
    archiveTheAnswer();

    const newTestProgress = testProgress + 1;
    setTestProgress(newTestProgress);

    setIsRightAnswer(false);
    currentAnswerRef.current = '';

    if (testProgress >= vocabularies.length) return;
    setIsAnswered(false);
  }, [vocabulary]);

  const handleCompleteTest = () => {
    archiveTheAnswer(currentAnswerRef.current);
    endStartTimeRef.current = new Date();
    setTestResult(true);
  };

  const handleRetest = useCallback(() => {
    setRetestBoolean(!retestBoolean);
  }, [retestBoolean]);

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  const handleOpenResultAnnouncement = () => {
    setOpenResultAnnouncement(true);
  };

  const handleCloseResultAnnouncement = () => {
    setOpenResultAnnouncement(false);

    if (testProgress >= vocabularies.length) {
      handleCompleteTest();
      return;
    }

    handleNextTest(testProgress);
  };

  const compareAnswer = (correctAnswer: string, answer: string) => {
    return correctAnswer.toLowerCase() === answer.toLowerCase();
  };

  const handleAnswer = useCallback((answer: string) => {
    if (vocabulary) {
      currentAnswerRef.current = answer;

      UpdateMemoryAnalysisGql({
        variables: {
          updateMemoryAnalysisInput: {
            answer: answer,
            questionId: vocabulary?.questions?.[0]?.id,
          },
        },
      });
    }
  }, [vocabulary]);

  const setIsAnsweredCallback = useCallback((value) => setIsAnswered(value), []);
  const setIsRightAnswerCallback = useCallback((value) => setIsRightAnswer(value), []);
  const handleScoreIncreaseCallback = useCallback((value) => handleScoreIncrease(value), []);
  const setCorrectAnswerCallback = useCallback((value) => setCorrectAnswer(value), []);
  const handleOpenResultAnnouncementCallback = useCallback(() => handleOpenResultAnnouncement(), []);
  const handleAddSkillsScoreCallback = useCallback((value) => handleAddSkillsScore(value), []);

  const vocabularyMemo = useMemo(() => vocabulary, [vocabulary]);

  // * useEffect
  useEffect(() => setIsPlaying(!isAnswered), [isAnswered]);

  useEffect(() => {
    if (testProgress > 0) {
      if (quickTestResponse) {
        const newVocabulary = vocabularies[testProgress >= vocabularies.length ? vocabularies.length - 1 : testProgress - 1];

        const vocabularyQuestionIndex = quickTestResponse?.quickTest?.findIndex(item => item.vocabulary.id === newVocabulary?.id);

        const vocabularyWithQuestions = {
          ...newVocabulary,
          questions: quickTestResponse?.quickTest?.[vocabularyQuestionIndex ?? -1] ? [quickTestResponse?.quickTest?.[vocabularyQuestionIndex ?? -1]] : [],
        };
        setVocabulary(vocabularyWithQuestions);
      } else {
        const newVocabulary = vocabularies[testProgress >= vocabularies.length ? vocabularies.length - 1 : testProgress - 1];

        const vocabularyQuestionIndex = questions.findIndex(item => item.vocabulary.id === newVocabulary.id);

        const vocabularyWithQuestions = {
          ...newVocabulary,
          questions: questions[vocabularyQuestionIndex ?? -1] ? [questions[vocabularyQuestionIndex ?? -1]] : [],
        };
        setVocabulary(vocabularyWithQuestions);
      }
    }
  }, [questions, quickTestResponse, testProgress, vocabularies]);

  useEffect(() => {
    if (currentUser) {
      if (!quickTestData?.equipments) {
        setEquipmentsChecked({
          ...equipmentsChecked,
          headphone: currentUser.setting.appSetting.listen ?? true,
          microphone: currentUser.setting.appSetting.speak ?? true,
        });
      }
    }
  }, [currentUser?.setting?.appSetting?.listen, currentUser?.setting?.appSetting?.speak, quickTestData?.equipments]);

  useEffect(() => {
    setEquipmentsChecked({
      ...equipmentsChecked,
      headphone: (quickTestData?.equipments ?? []).findIndex(item => item === 'listen') > -1 ?? true,
      microphone: (quickTestData?.equipments ?? []).findIndex(item => item === 'speak') > -1 ?? true,
    });
  }, [quickTestData?.equipments]);

  useEffect(() => {
    if (setQuickTestLoading) setQuickTestLoading(getQuickTestLoading);
  }, [getQuickTestLoading]);

  useEffect(() => {
    if (isQuickTest) {
      if (getQuickTestTimeoutRef.current) clearTimeout(getQuickTestTimeoutRef.current);
      // * add to timeout because repeatedly calling an apollo query that returns data = undefined (cause unknown)
      getQuickTestTimeoutRef.current = setTimeout(() => {
        questionsSetLoading(true);

        GetQuickTest({
          variables: quickTestData,
        });
      }, 100);
    }
  }, [isQuickTest, quickTestData, retestBoolean]);

  useEffect(() => {
    if (!isQuickTest && !!vocabularies.length) {
      if (getQuestionsTimeoutRef.current) clearTimeout(getQuestionsTimeoutRef.current);
      // * add to timeout because repeatedly calling an apollo query that returns data = undefined (cause unknown)
      getQuestionsTimeoutRef.current = setTimeout(() => {
        questionsSetLoading(true);

        GetQuestions({
          variables: {
            // cover case test forgot words, was vague on the profile page because the vocabulary list was on many different topics
            ...topicId && { topicId: topicId },
            equipments: [Equipments.headphone, Equipments.microphone].filter(equipment => equipmentsChecked[equipment]),
            vocabularyIds: cloneDeep(vocabularies).map((item: GraphqlTypes.LearningTypes.Vocabulary) => item.id),
          }
        });
      }, 100);
    }
  }, [isQuickTest, vocabularies, equipmentsChecked, retestBoolean]);

  useEffect(() => {
    setIsRetest(false);
  }, [equipmentsChecked]);

  useEffect(() => {
    if (quickTestResponse?.quickTest) {
      setVocabularies(shuffle(quickTestResponse?.quickTest ?? []).map(item => item.vocabulary) ?? []);
    } else {
      setVocabularies(shuffle(vocabulariesOriginal) ?? []);
    }
  }, [vocabulariesOriginal, quickTestResponse]);

  useEffect(() => {
    document.onkeyup = (event) => {
      if (isAnswered) return;

      if (!inFocusInput && (event.key === 'ArrowRight' || event.key === 'ArrowDown')) handleSkipTest(testProgress);
    };
  }, [isAnswered, testProgress, inFocusInput]);

  useEffect(() => {
    GetCurrentUser();

    return () => {
      document.onkeyup = null;
    };
  }, []);

  useEffect(() => {
    document.onkeydown = (event) => {
      if (isAnswered) return;
    };
  }, [isAnswered]);
  if (questionsError) toastify({ type: 'error', message: questionsError.message });

  if (isQuickTest && !quickTestResponse) return null;

  // render ui
  return (
    <Dialog
      open={open}
      onClose={() => handleOpenDialogWarning({ type: 'stopTesting', title: t('End of current test session'), message: t('Do you want to continue?'), confirmTitle: t('Ok') })}
      scroll="paper"
      fullScreen
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
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          overflowY: 'scroll',
        }}
      >
        <BoxWrapper>
          {/* test title */}
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
                  onClick={() => handleOpenDialogWarning({ type: 'stopTesting', title: t('End of current test session'), message: t('Do you want to continue?'), confirmTitle: t('Ok') })}
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

          {testOverview ? (
            isQuickTest
              ? handleStartTest()
              : (
                <TestOverview
                  equipmentsChecked={equipmentsChecked}
                  setEquipmentsChecked={setEquipmentsChecked}
                  start={handleStartTest}
                  questionsLoading={questionsLoading}
                  inProcess={inProcess}
                  setInProcess={setInProcess}
                />
              )
          ) : testResult ? (
            <TestResults
              handleRetest={handleRetest}
              handleEndTest={handleClose}
              allTests={vocabularies.length}
              rightTests={scores}
              questionsLoading={questionsLoading}
              resultData={{
                timer: millisecondsToHours(moment.duration(moment(endStartTimeRef.current).diff(moment(testStartTimeRef.current)), 'milliseconds').asMilliseconds()),
                skillsPercent: skillsPercent.current,
                answersResult: answersResultRef.current,
              }}
            />
          ) : (
            <Box sx={{ width: '100%' }}>
              {/* line process */}
              <BoxSession>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: {
                      md: theme.spacing(5),
                    },
                  }}
                >
                  <LineProgress
                    allStep={vocabularies.length}
                    currentStep={testProgress}
                    color="#CCCCCC"
                    width="100%"
                    height="45px"
                    percentColor={theme.colors.primary.main}
                    fullColor={theme.colors.alpha.black[10]}
                    sx={{
                      mr: {
                        xs: theme.spacing(2),
                        md: theme.spacing(9)
                      },
                      wordSpacing: '4px',
                      '.MuiTypography-root': {
                        mb: '10px',
                        '.MuiBox-root': {
                          mr: 0.5,
                        }
                      },
                    }}
                    processPosition="top-start"
                    currentStepColor={theme.colors.alpha.black[100]}
                  />
                  <Box
                    sx={{
                      'svg': {
                        borderRadius: '50%',
                        boxShadow: 'rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0.326rem 3rem',
                        'path': {
                          strokeLinecap: 'unset',
                        }
                      },
                      transform: {
                        xs: 'scale(0.8)',
                        sm: 'scale(0.9)',
                        md: 'scale(1)',
                      }
                    }}
                  >
                    {/* //TODO note: the counter may not stop when isPlaying={false} but the 'key' does not change */}
                    { vocabulary && (
                      <CountdownCircleTimer
                        key={`${vocabulary?.id}-${isPlaying}`} // * for reset duration when rerender
                        isPlaying={isPlaying}
                        strokeWidth={16}
                        duration={vocabulary?.questions?.[0]?.duration || 30}
                        initialRemainingTime={isPlaying ? undefined : currentDuration.current > 0 ? currentDuration.current - 1 : 0}
                        colors={[
                          [theme.colors.success.main, 0.33],
                          [theme.colors.warning.main, 0.33],
                          [theme.colors.error.main, 0.33],
                        ]}
                        trailColor={lighten(theme.colors.primary.main, 0.8)}
                        size={CountdownCircleTimerSize}
                        onComplete={() => {
                          if (testProgress < vocabularies.length) {
                            handleNextTest(testProgress);
                          }
                        }}
                      >
                        {({ remainingTime }) => {
                          currentDuration.current = remainingTime ?? 0;

                          return (
                            <Typography
                              variant="h3"
                              color="unset"
                              children={remainingTime}
                            />
                          );
                        }}
                      </CountdownCircleTimer>
                    )}
                  </Box>
                </Box>
              </BoxSession>

              {/* question and answers */}
              {vocabularyMemo &&
                <RenderTestForm
                  vocabulary={vocabularyMemo}
                  isAnswered={isAnswered}
                  setIsAnswered={setIsAnsweredCallback}
                  setIsRightAnswer={setIsRightAnswerCallback}
                  handleScoreIncrease={() => handleScoreIncreaseCallback(scores)}
                  setCorrectAnswer={setCorrectAnswerCallback}
                  handleOpenResultAnnouncement={handleOpenResultAnnouncementCallback}
                  handleAddSkillsScore={handleAddSkillsScoreCallback}
                  handleAnswer={handleAnswer}
                  setInFocusInput={setInFocusInput}
                  autoPlayAudio={equipmentsChecked.headphone}
                />
              }

              {/* next */}
              <BoxSession sx={{ mt: theme.spacing(4) }}>
                { testProgress > 0 && (
                  <ButtonCustom
                    color="warning"
                    variant="outlined"
                    sx={{
                      p: theme.spacing(2, 4),
                      mx: theme.spacing(1),
                      fontSize: '18px',
                      lineHeight: 1,
                    }}
                    onClick={() => handlePreviousTest(testProgress)}
                    reopenIn={10}
                    children={t('Previous')}
                  />
                )}

                <ButtonCustom
                  color={
                    testProgress >= vocabularies.length
                      ? 'success'
                      : 'primary'
                  }
                  variant="contained"
                  sx={{
                    p: theme.spacing(2, 4),
                    mx: theme.spacing(1),
                    fontSize: '18px',
                    lineHeight: 1,
                  }}
                  onClick={() => {
                    if (testProgress >= vocabularies.length) {
                      handleCompleteTest();
                    } else {
                      if (isAnswered) handleNextTest(testProgress);
                      else handleSkipTest(testProgress);
                    }
                  }}
                  reopenIn={10}
                  children={
                    testProgress >= vocabularies.length
                      ? t('Complete')
                      : t('Skip')
                  }
                />
              </BoxSession>

              {/* result announcement */}
              { vocabulary && openResultAnnouncement &&
                <ResultAnnouncement
                  // TODO: ERIK build error by below code
                  // answer={currentAnswerRef.current}
                  vocabulary={vocabulary}
                  open={openResultAnnouncement}
                  handleOpen={handleOpenResultAnnouncement}
                  handleClose={handleCloseResultAnnouncement}
                  isRightAnswer={isRightAnswer}
                  correctAnswer={correctAnswer}
                  isLastQuestion={testProgress >= vocabularies.length}
                  autoPlayAudio={equipmentsChecked.headphone}
                />
              }
            </Box>
          )}
        </BoxWrapper>
      </DialogContent>

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

export { TestPage };
