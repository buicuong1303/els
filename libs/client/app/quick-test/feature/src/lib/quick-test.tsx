/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  forwardRef,
  ReactNode,
  useEffect,
  useContext,
  useCallback,
  ChangeEvent,
} from 'react';

import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import {
  DialogContent,
  Typography,
  useTheme,
  Dialog,
  Box,
  Paper,
  Slide,
  SlideProps,
  Grid,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useTranslation } from 'react-i18next';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { cloneDeep, omit, orderBy } from 'lodash';

import {
  GraphqlQueries,
  GraphqlTypes,
} from '@els/client/app/shared/data-access';

import { ApolloClient } from '@els/client/shared/data-access';
import { ToastifyContext } from '@els/client/app/shared/contexts';

import {
  ButtonCustom,
  CancelIcon,
  CheckedCustom,
  DeleteIcon,
  HandIcon,
  LoadingData,
} from '@els/client/app/shared/ui';
import { DialogConfirm, DialogConfirmType } from '@els/client/shared/ui';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { QuickTestData } from '@els/client/app/topic/ui';
import { v4 as uuidv4 } from 'uuid';
import {
  addAlpha,
  removeVietnameseTones,
  handleApolloError,
} from '@els/client/shared/utils';

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

const LabelSection = styled(Typography)(
  ({ theme }) => `
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    min-height: 25px;
    display: flex;
    align-items: center;
  `
);

const LabelCustomOption = styled(Typography)(
  ({ theme }) => `
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  `
);

const CardSection = styled(Box)(
  ({ theme }) => `
    background: #FFFFFF;
    box-shadow: ${theme.colors.shadows.card};
    border-radius: 6px;
    padding: 20px 20px 32px 20px;
  `
);

const Transition = forwardRef<unknown, SlideProps>((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export interface DialogConfirmValueType {
  open?: boolean;
  type: DialogConfirmType;
  title: ReactNode;
  message: ReactNode;
  confirmTitle?: ReactNode;
  cancelTitle?: ReactNode;
  callback?: () => void;
}

const numberOfQuestions: { id: string; value: number }[] = [
  { id: uuidv4(), value: 5 },
  { id: uuidv4(), value: 10 },
  { id: uuidv4(), value: 15 },
  { id: uuidv4(), value: 20 },
  { id: uuidv4(), value: 30 },
];

export interface QuickTestPageProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  handleTest: () => void;
  setQuickTestData: (data: QuickTestData) => void;
  quickTestLoading: boolean;
  quickTestDataMemo: QuickTestData;
  sx?: SxProps;
}

const QuickTestPage = (props: QuickTestPageProps) => {
  const {
    open,
    setOpen,
    handleTest,
    setQuickTestData,
    quickTestLoading,
    quickTestDataMemo,
    sx,
  } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  //* page ref

  //* page state
  const [currentUser, setCurrentUser] =
    useState<GraphqlTypes.LearningTypes.User>();
  const [categories, setCategories] = useState<
  GraphqlTypes.LearningTypes.Category[]
  >([]);

  interface CustomFormType {
    listen: boolean;
    speak: boolean;
    numberOfQuestions: number;
  }
  const initCustomFormState: CustomFormType = {
    listen: true,
    speak: true,
    numberOfQuestions: 10,
  };
  const [customFormState, setCustomFormState] =
    useState<CustomFormType>(initCustomFormState);

  const [categorySelected, setCategorySelected] =
    useState<GraphqlTypes.LearningTypes.Category>();
  const [specializations, setSpecializations] = useState<{
    [key: string]: GraphqlTypes.LearningTypes.Specialization;
  }>({});
  const [specializationsSelected, setSpecializationsSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const [topicsJoined, setTopicsJoined] = useState<{
    [key: string]: GraphqlTypes.LearningTypes.Topic;
  }>({});
  const [selectAllTopicsJoined, setSelectAllTopicsJoined] =
    useState<boolean>(true);
  const [topicsJoinedSelected, setTopicsJoinedSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const [topicsNotJoined, setTopicsNotJoined] = useState<{
    [key: string]: GraphqlTypes.LearningTypes.Topic;
  }>({});
  const [topicsNotJoinedSelected, setTopicsNotJoinedSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const [allTopics, setAllTopics] = useState<{
    [key: string]: GraphqlTypes.LearningTypes.Topic;
  }>({});

  //* get data
  const [GetCurrentUser] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.user) setCurrentUser(data?.user);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  const [GetCategories, { loading: cetCategoriesLoading }] = useLazyQuery<{
    categories: GraphqlTypes.LearningTypes.Category[];
  }>(GraphqlQueries.LearningQueries.Category.GetCategories, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      setCategories(data.categories ?? []);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  const [GetMyTopics, { loading: getMyTopicsLoading }] = useLazyQuery<{
    myTopics: GraphqlTypes.LearningTypes.Topic[];
  }>(GraphqlQueries.LearningQueries.Topic.GetMyTopicsShort, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      const newTopicsJoined: {
        [key: string]: GraphqlTypes.LearningTypes.Topic;
      } = {};

      orderBy(
        data?.myTopics ?? [],
        (topic) => removeVietnameseTones(topic.name ?? ''),
        'asc'
      ).forEach((myTopic) => {
        if (!newTopicsJoined[myTopic.id]) {
          newTopicsJoined[myTopic.id] = myTopic;
        }
      });

      setTopicsJoined(newTopicsJoined);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  const [GetTopics, { loading: getTopicsLoading }] = useLazyQuery<{
    topics: {
      nodes: GraphqlTypes.LearningTypes.Topic[];
      pageInfo: { [key: string]: any };
    };
  }>(GraphqlQueries.LearningQueries.Topic.GetTopicsShort, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      const newAllTopics: { [key: string]: GraphqlTypes.LearningTypes.Topic } =
        {};

      orderBy(
        data?.topics?.nodes ?? [],
        (topic) => removeVietnameseTones(topic.name ?? ''),
        'asc'
      ).forEach((topic) => {
        if (!newAllTopics[topic.id]) {
          newAllTopics[topic.id] = topic;
        }
      });

      setAllTopics(newAllTopics);
    },
    onError: (error: ApolloError) => handleApolloError(error, toastify),
  });

  //* dialog confirm
  const initConfirmValue: DialogConfirmValueType = {
    open: false,
    type: DialogConfirmType['success'],
    title: '',
    message: '',
    confirmTitle: '',
    cancelTitle: '',
    callback: undefined,
  };
  const [dialogConfirmValue, setDialogConfirmValue] =
    useState(initConfirmValue);
  const handleOpenDialogConfirm = (data: DialogConfirmValueType) => {
    setDialogConfirmValue({
      open: true,
      type: data.type,
      title: data.title,
      message: data.message,
      confirmTitle: data.confirmTitle,
      cancelTitle: data.cancelTitle,
      callback: data.callback,
    });
  };
  const handleCloseDialogConfirm = () => {
    setDialogConfirmValue(initConfirmValue);
  };
  const handleConfirmDialogConfirm = (
    dialogConfirmValueInput: DialogConfirmValueType
  ) => {
    if (dialogConfirmValueInput.callback) dialogConfirmValueInput.callback();

    setDialogConfirmValue(initConfirmValue);
  };

  //* handle logic
  const handleCustomFormState = useCallback(
    (event: any) => {
      const name = event.target.name;
      const value = event.target.value;
      const type = event.target.type;
      const checked = event.target.checked;

      setCustomFormState({
        ...customFormState,
        [name]: type === 'checkbox' ? checked : value,
      });
    },
    [customFormState]
  );

  // category
  const handleChangeCategory = (
    _event: ChangeEvent<{}>,
    category: GraphqlTypes.LearningTypes.Category
  ) => setCategorySelected(category);

  // specialization
  const handleCheckedSpecialization = useCallback(
    (event: any) => {
      const name = event.target.name;
      const checked = event.target.checked;

      const newSpecializationsSelected = { ...specializationsSelected };
      newSpecializationsSelected[name] = checked;
      setSpecializationsSelected(newSpecializationsSelected);
    },
    [specializationsSelected]
  );

  // topics joined
  const handleCheckAllTopicJoined = useCallback(
    (event: any) => {
      const checked = event.target.checked;

      setSelectAllTopicsJoined(checked);

      const newTopicsJoinedSelected = { ...topicsJoinedSelected };
      Object.entries(topicsJoined).forEach((item) => {
        const isFilter = Object.entries(specializationsSelected).some(
          (specializationSelected) => specializationSelected[1] === true
        );

        if (!isFilter) {
          newTopicsJoinedSelected[item[0]] = checked;
          setTopicsJoinedSelected(newTopicsJoinedSelected);
          return;
        }
        if (specializationsSelected[item[1].specialization?.id ?? ''])
          newTopicsJoinedSelected[item[0]] = checked;
        setTopicsJoinedSelected(newTopicsJoinedSelected);
      });
    },
    [topicsJoinedSelected, topicsJoined, specializationsSelected]
  );

  const handleCheckedTopicJoined = useCallback(
    (event: any) => {
      const name = event.target.name;
      const checked = event.target.checked;

      const newTopicsJoinedSelected = { ...topicsJoinedSelected };
      newTopicsJoinedSelected[name] = checked;
      setTopicsJoinedSelected(newTopicsJoinedSelected);
    },
    [topicsJoinedSelected]
  );

  // topics not join
  // const handleCheckAllTopicNotJoined = useCallback((event: any) => {
  //   const checked = event.target.checked;
  //   setSelectAllTopicsNotJoined(checked);
  //   const newTopicsNotJoinedSelected = { ...topicsNotJoinedSelected };
  //   Object.entries(topicsNotJoined).forEach(item => {
  //     const isFilter = Object.entries(specializationsSelected).some(specializationSelected => specializationSelected[1] === true);
  //     if (!isFilter) {
  //       newTopicsNotJoinedSelected[item[0]] = checked;
  //     }
  //     if (isFilter) {
  //       if (specializationsSelected[item[1].specialization?.id ?? ''])
  //         newTopicsNotJoinedSelected[item[0]] = checked;
  //     }
  //   });
  //   setTopicsNotJoinedSelected(newTopicsNotJoinedSelected);
  // }, [topicsNotJoinedSelected, topicsNotJoined, specializationsSelected]);

  const handleCheckedTopicNotJoined = useCallback(
    (event: any) => {
      const name = event.target.name;
      const checked = event.target.checked;

      const newTopicsNotJoinedSelected = { ...topicsNotJoinedSelected };
      newTopicsNotJoinedSelected[name] = checked;
      setTopicsNotJoinedSelected(newTopicsNotJoinedSelected);
    },
    [topicsNotJoinedSelected]
  );

  //* useEffect
  useEffect(() => {
    if (currentUser) {
      // apply user setting to form state
      setCustomFormState({
        ...customFormState,
        listen: currentUser?.setting?.appSetting?.listen ?? true,
        speak: currentUser?.setting?.appSetting?.speak ?? true,
      });
    }
  }, [currentUser?.setting]);

  useEffect(() => {
    // set default category = "Giao tiep thong dung"
    if (categories.length) setCategorySelected(categories[1] ?? categories[0]);
  }, [categories]);

  useEffect(() => {
    if (categorySelected) {
      const newSpecializations =
        categories[
          categories.findIndex((item) => item.id === categorySelected.id)
        ]?.specializations ?? [];

      const currentSpecializations = { ...specializations };
      orderBy(
        newSpecializations,
        (specialization) => removeVietnameseTones(specialization.name ?? ''),
        'asc'
      ).forEach((specialization) => {
        if (!currentSpecializations[specialization.id]) {
          currentSpecializations[specialization.id] = specialization;
        }
      });

      // filter specialization by category selected
      setSpecializations(currentSpecializations);
    }
  }, [categorySelected]);

  useEffect(() => {
    const newTopicsJoinedSelected = { ...topicsJoinedSelected };

    Object.entries(topicsJoined).forEach(
      (item) => (newTopicsJoinedSelected[item[0]] = true)
    );

    // auto set checked = true for all topics joined
    setTopicsJoinedSelected(newTopicsJoinedSelected);
  }, [topicsJoined]);

  useEffect(() => {
    const newTopicsNotJoined = omit(
      allTopics,
      cloneDeep(Object.entries(topicsJoined).map((item) => item[0]))
    );

    // set topics not joined  = all topics - topics joined
    setTopicsNotJoined(newTopicsNotJoined);
  }, [topicsJoined, allTopics]);

  useEffect(() => {
    // set QuickTestData to filter question
    setQuickTestData({
      equipments: [
        customFormState['listen'] ? 'listen' : '',
        customFormState['speak'] ? 'speak' : '',
      ].filter((item) => !!item),
      numberOfQuestions: customFormState.numberOfQuestions,
      topicIds: [
        ...Object.entries(topicsJoinedSelected).map((item) =>
          item[1] ? item[0] : ''
        ),
        ...Object.entries(topicsNotJoinedSelected).map((item) =>
          item[1] ? item[0] : ''
        ),
      ].filter((item) => !!item),
    });
  }, [customFormState, topicsJoinedSelected, topicsNotJoinedSelected]);

  useEffect(() => {
    GetCurrentUser();

    GetCategories();

    GetMyTopics();

    GetTopics({
      variables: {
        pageNumber: 1,
        limit: -1,
      },
    });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleOpenDialogConfirm({
          type: DialogConfirmType['warning'],
          title: t('Will end your quick test'),
          message: t('Do you want to continue?'),
          callback: () => setOpen(false),
        });
      }}
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
        }}
      >
        <BoxWrapper>
          {/* title */}
          <Paper
            elevation={1}
            variant="elevation"
            sx={{
              width: '100%',
              mt: { xs: theme.spacing(2), md: theme.spacing(0) },
            }}
          >
            <BoxSession
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: theme.spacing(2.5),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonCustom
                  startIcon={<HandIcon />}
                  color="primary"
                  variant="contained"
                  sx={{
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
                    pointerEvents: 'none',
                  }}
                />
                <Typography variant="h3" children={t('Quick test')} />
              </Box>
              <Box>
                <ButtonCustom
                  startIcon={
                    <CloseIcon
                      sx={{ fontSize: `${theme.spacing(3)} !important` }}
                    />
                  }
                  color="error"
                  variant="text"
                  onClick={() =>
                    handleOpenDialogConfirm({
                      type: DialogConfirmType['warning'],
                      title: t('Will end your quick test'),
                      message: t('Do you want to continue?'),
                      callback: () => setOpen(false),
                    })
                  }
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

          {/* content */}
          <Box sx={{ width: '100%' }}>
            {/* group custom */}
            <Box>
              <LabelSection
                variant="h3"
                children={t('Custom')}
                mt="20px"
                mb={1}
              />
              <CardSection minHeight="127px">
                <BoxSession>
                  <Grid
                    container
                    rowSpacing={4}
                    columnSpacing={2}
                    alignItems="start"
                    maxWidth="500px"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      display="flex"
                      alignItems="center"
                    >
                      <LabelCustomOption
                        color="inherit"
                        variant="subtitle1"
                        children={t('Listening exercises')}
                      />

                      <Switch
                        name="listen"
                        checked={customFormState.listen}
                        onChange={handleCustomFormState}
                        size="medium"
                        sx={{
                          ml: 1,
                          py: '12px',
                          pl: '8px !important',
                          pR: '12px !important',
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      display="flex"
                      alignItems="center"
                    >
                      <LabelCustomOption
                        color="inherit"
                        variant="subtitle1"
                        children={t('Speaking exercises')}
                      />

                      <Switch
                        name="speak"
                        checked={customFormState.speak}
                        onChange={handleCustomFormState}
                        size="medium"
                        sx={{
                          ml: 1,
                          py: '12px',
                          pl: '8px !important',
                          pR: '12px !important',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} display="flex" alignItems="center">
                      <LabelCustomOption
                        color="inherit"
                        variant="subtitle1"
                        children={t('Number of questions')}
                        minWidth="140px"
                      />
                    </Grid>
                    <Grid item xs={6} display="flex" alignItems="center">
                      <FormControl
                        variant="outlined"
                        sx={{
                          minWidth: 50,
                          fontSize: '12px',
                          fontWeight: 500,
                          '.MuiSelect-select': {
                            padding: '0',
                            height: '0 !important',
                          },
                          fieldset: {
                            border: 'none !important',
                          },
                          '.MuiSvgIcon-root': {
                            mt: '2px',
                            p: '2px',
                            path: {
                              d: 'path("M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z")',
                              color: theme.colors.alpha.black[100],
                            },
                          },
                        }}
                      >
                        <Select
                          name="numberOfQuestions"
                          value={customFormState.numberOfQuestions}
                          onChange={handleCustomFormState}
                          MenuProps={{
                            anchorOrigin: {
                              horizontal: 'center',
                              vertical: 'bottom',
                            },
                          }}
                        >
                          {cloneDeep(numberOfQuestions).map((item) => {
                            return (
                              <MenuItem
                                key={item.id}
                                value={item.value}
                                sx={{ p: '8px 14px' }}
                              >
                                {item.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </BoxSession>
              </CardSection>
            </Box>

            {/* group filter */}
            <Grid container rowSpacing={2.5} columnSpacing={2.5} mt="28px">
              {/* filter */}
              <Grid item xs={12} sm={12} md={5}>
                <LabelSection variant="h3" children={t('Filter')} mb={1} />
                {cetCategoriesLoading ? (
                  <CardSection
                    display="flex"
                    p={'0 !important'}
                    overflow="hidden"
                    minHeight="50px"
                  >
                    <LoadingData sx={{ m: 'auto' }} />
                  </CardSection>
                ) : (
                  <CardSection
                    display="flex"
                    p={'0 !important'}
                    overflow="hidden"
                    minHeight="50px"
                  >
                    {/* category */}
                    {categorySelected && (
                      <Box width="fix-content">
                        <Tabs
                          orientation="vertical"
                          variant="scrollable"
                          onChange={handleChangeCategory}
                          value={categorySelected}
                          scrollButtons="auto"
                          textColor="primary"
                          indicatorColor="primary"
                          sx={{
                            minHeight: '156px',
                            '.MuiTabs-indicator': {
                              boxShadow: 'unset',
                              border: 'unset',
                              bgcolor: theme.colors.alpha.white[100],
                            },
                          }}
                        >
                          {/* {orderBy(categories, ['name'], ['asc']).map((tab) => ( */}
                          {categories.map((category) => (
                            <Tab
                              key={category.id}
                              label={t(category.name)}
                              value={category}
                              sx={{
                                bgcolor:
                                  categorySelected?.id === category.id
                                    ? '#FFFFFF'
                                    : addAlpha(theme.colors.common.grey, 0.5),
                                color: `${theme.palette.common.black} !important`,
                                textAlign: 'center',
                                p: '10px 16px',
                                fontSize: '16px',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '0',
                                ...(categorySelected?.id === category.id && {
                                  borderLeft: `2px solid ${theme.colors.primary.main}`,
                                }),
                              }}
                            />
                          ))}
                        </Tabs>
                      </Box>
                    )}

                    {/* specialization */}
                    <Box
                      sx={{
                        flex: 1,
                        p: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '520px',
                        overflowY: 'scroll',
                      }}
                    >
                      {Object.entries(specializations).map((item, index) => {
                        if (
                          categorySelected?.specializations?.findIndex(
                            (specialization) => specialization.id === item[0]
                          ) !== -1
                        ) {
                          return (
                            <CheckedCustom
                              key={item[0]}
                              color="primary"
                              variant="outlined"
                              label={item[1].name}
                              checked={
                                specializationsSelected[item[0]] ?? false
                              }
                              name={item[0]}
                              onChange={handleCheckedSpecialization}
                              sx={{
                                ...(index !== 0 && { mt: 1 }),
                                alignItems: 'start',
                                '& .MuiTypography-root': {
                                  lineHeight: '26px',
                                },
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </Box>
                  </CardSection>
                )}
              </Grid>

              {/* topic list */}
              <Grid item xs={12} sm={12} md={7}>
                <Grid container rowSpacing={2.5} columnSpacing={2.5}>
                  {/* topics joined */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LabelSection
                        variant="h3"
                        children={t('Topics joined')}
                      />

                      <CheckedCustom
                        color="primary"
                        variant="outlined"
                        label={t('Select all')}
                        checked={selectAllTopicsJoined}
                        onChange={handleCheckAllTopicJoined}
                        sx={{ ml: { xs: 2, md: 5 } }}
                      />
                    </Box>

                    <CardSection
                      display="flex"
                      p={'0 !important'}
                      overflow="hidden"
                      minHeight="50px"
                    >
                      <Box
                        sx={{
                          flex: 1,
                          p: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          maxHeight: '520px',
                          overflowY: 'scroll',
                        }}
                      >
                        {/* topics joined list */}
                        {(getTopicsLoading || getMyTopicsLoading) && (
                          <LoadingData sx={{ m: 'auto' }} />
                        )}
                        {!getTopicsLoading &&
                          !getMyTopicsLoading &&
                          (!Object.entries(topicsJoined).length ? (
                            <Box
                              textAlign="center"
                              children={t('No records to display')}
                            />
                          ) : (
                            Object.entries(topicsJoined).map((item, index) => {
                              const isFilter = Object.entries(
                                specializationsSelected
                              ).some(
                                (specializationSelected) =>
                                  specializationSelected[1] === true
                              );

                              if (!isFilter) {
                                return (
                                  <CheckedCustom
                                    key={item[0]}
                                    color="primary"
                                    variant="outlined"
                                    label={item[1].name}
                                    checked={
                                      topicsJoinedSelected[item[0]] ?? false
                                    }
                                    name={item[0]}
                                    onChange={handleCheckedTopicJoined}
                                    sx={{
                                      ...(index !== 0 && { mt: 1 }),
                                      alignItems: 'start',
                                      '& .MuiTypography-root': {
                                        lineHeight: '26px',
                                      },
                                    }}
                                  />
                                );
                              }
                              if (
                                specializationsSelected[
                                  item[1].specialization?.id ?? ''
                                ]
                              )
                                return (
                                  <CheckedCustom
                                    key={item[0]}
                                    color="primary"
                                    variant="outlined"
                                    label={item[1].name}
                                    checked={
                                      topicsJoinedSelected[item[0]] ?? false
                                    }
                                    name={item[0]}
                                    onChange={handleCheckedTopicJoined}
                                    sx={{
                                      ...(index !== 0 && { mt: 1 }),
                                      alignItems: 'start',
                                      '& .MuiTypography-root': {
                                        lineHeight: '26px',
                                      },
                                    }}
                                  />
                                );
                              return null;
                            })
                          ))}
                      </Box>
                    </CardSection>
                  </Grid>

                  {/* topics not joined */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LabelSection
                        variant="h3"
                        children={t('Topics not joined')}
                      />

                      {/* <CheckedCustom
                        color='primary'
                        variant='outlined'
                        label={t('Select all')}
                        checked={selectAllTopicsNotJoined}
                        onChange={handleCheckAllTopicNotJoined}
                        sx={{ ml: { xs: 2, md: 5 } }}
                      /> */}
                    </Box>

                    <CardSection
                      display="flex"
                      p={'0 !important'}
                      overflow="hidden"
                      minHeight="50px"
                    >
                      <Box
                        sx={{
                          flex: 1,
                          p: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          maxHeight: '520px',
                          overflowY: 'scroll',
                        }}
                      >
                        {/* topics joined list */}
                        {getTopicsLoading && (
                          <LoadingData sx={{ m: 'auto' }} />
                        )}
                        {!getTopicsLoading && (
                          !Object.entries(topicsNotJoined).length ? (
                            <Box
                              textAlign="center"
                              children={t('No records to display')}
                            />
                          ) : (
                            Object.entries(topicsNotJoined).map(
                              (item, index) => {
                                const isFilter = Object.entries(
                                  specializationsSelected
                                ).some(
                                  (specializationSelected) =>
                                    specializationSelected[1] === true
                                );

                                if (!isFilter) {
                                  return (
                                    <CheckedCustom
                                      key={item[0]}
                                      color="primary"
                                      variant="outlined"
                                      label={item[1].name}
                                      checked={
                                        topicsNotJoinedSelected[item[0]] ??
                                        false
                                      }
                                      name={item[0]}
                                      onChange={handleCheckedTopicNotJoined}
                                      sx={{
                                        ...(index !== 0 && { mt: 1 }),
                                        alignItems: 'start',
                                        '& .MuiTypography-root': {
                                          lineHeight: '26px',
                                        },
                                      }}
                                    />
                                  );
                                }
                                if (
                                  specializationsSelected[
                                    item[1].specialization?.id ?? ''
                                  ]
                                )
                                  return (
                                    <CheckedCustom
                                      key={item[0]}
                                      color="primary"
                                      variant="outlined"
                                      label={item[1].name}
                                      checked={
                                        topicsNotJoinedSelected[item[0]] ??
                                        false
                                      }
                                      name={item[0]}
                                      onChange={handleCheckedTopicNotJoined}
                                      sx={{
                                        ...(index !== 0 && { mt: 1 }),
                                        alignItems: 'start',
                                        '& .MuiTypography-root': {
                                          lineHeight: '26px',
                                        },
                                      }}
                                    />
                                  );

                                return null;
                              }
                            )
                          )
                        )}
                      </Box>
                    </CardSection>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider
              sx={{
                width: '100%',
                height: '1px',
                my: '20px',
                borderBottom: `1px dashed ${theme.colors.secondary.light}`,
              }}
            />

            {/* clear all topics select list */}
            <ButtonCustom
              variant="text"
              color="inherit"
              children={t('Deselect all')}
              endIcon={
                <DeleteIcon
                  width="16px"
                  height="16px"
                  color={theme.colors.error.main}
                />
              }
              onClick={() => {
                setSelectAllTopicsJoined(false);
                setTopicsJoinedSelected({});
                setTopicsNotJoinedSelected({});
              }}
              sx={{
                height: '26px',
                border: `0.54px solid ${addAlpha(
                  theme.colors.common.grey,
                  0.5
                )}`,
                borderRadius: '99px',
                backgroundColor: addAlpha(theme.colors.common.grey, 0.5),
                fontSize: '15px',
                fontWeight: 500,
              }}
            />

            {/* topics selected list */}
            <CardSection
              sx={{
                minHeight: '42px',
                mt: 2,
                p: '8px 8px 0px 8px !important',
              }}
            >
              <Box>
                {Object.entries(topicsJoined).map((item, index) => {
                  if (topicsJoinedSelected[item[1].id]) {
                    return (
                      <ButtonCustom
                        key={item[1].id}
                        variant="text"
                        color="inherit"
                        children={item[1].name}
                        endIcon={
                          <CancelIcon
                            width="16px"
                            height="16px"
                            color={theme.colors.error.main}
                          />
                        }
                        onClick={() => {
                          const newTopicsJoinedSelected = {
                            ...topicsJoinedSelected,
                          };
                          delete newTopicsJoinedSelected[item[0]];
                          setTopicsJoinedSelected(newTopicsJoinedSelected);
                        }}
                        sx={{
                          height: '26px',
                          border: `0.54px solid ${addAlpha(
                            theme.colors.common.grey,
                            0.5
                          )}`,
                          borderRadius: '99px',
                          fontSize: '15px',
                          fontWeight: 500,
                          mr: 1,
                          mb: 1,
                        }}
                      />
                    );
                  }

                  return null;
                })}

                {Object.entries(topicsNotJoined).map((item, index) => {
                  if (topicsNotJoinedSelected[item[1].id]) {
                    return (
                      <ButtonCustom
                        key={item[1].id}
                        variant="text"
                        color="inherit"
                        children={item[1].name}
                        endIcon={
                          <CancelIcon
                            width="16px"
                            height="16px"
                            color={theme.colors.error.main}
                          />
                        }
                        onClick={() => {
                          const newTopicsNotJoinedSelected = {
                            ...topicsNotJoinedSelected,
                          };
                          delete newTopicsNotJoinedSelected[item[0]];
                          setTopicsNotJoinedSelected(
                            newTopicsNotJoinedSelected
                          );
                        }}
                        sx={{
                          height: '26px',
                          border: `0.54px solid ${addAlpha(
                            theme.colors.common.grey,
                            0.5
                          )}`,
                          borderRadius: '99px',
                          fontSize: '15px',
                          fontWeight: 500,
                          mr: 1,
                          mb: 1,
                        }}
                      />
                    );
                  }

                  return null;
                })}
              </Box>
            </CardSection>

            {/* action */}
            <BoxSession sx={{ mt: theme.spacing(4) }}>
              <ButtonCustom
                variant="contained"
                color="primary"
                {...(quickTestLoading) ? {
                  children: t('Loading questions'),
                  endIcon: <LoadingData />
                } : {
                  children: t('Start testing'),
                  endIcon: (
                    <ArrowForwardOutlinedIcon
                      sx={{ fontSize: '24px !important' }}
                    />
                  )
                }}
                sx={{
                  height: '50px',
                  minWidth: 'unset',
                  p: '22px 32px',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
                onClick={() => {
                  if (quickTestLoading) return;

                  const hasTopicsNotJoinedSelected = Object.entries(
                    topicsNotJoinedSelected
                  ).some((item) => item[1] === true);

                  if (hasTopicsNotJoinedSelected) {
                    handleOpenDialogConfirm({
                      type: DialogConfirmType['success'],
                      title: t(
                        'The system will automatically add you to the topics that your account has not join'
                      ),
                      message: (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ opacity: 1 }}
                        >
                          <Box
                            sx={{
                              minWidth: '290px',
                              maxWidth: '320px',
                              border: `1px solid ${theme.colors.secondary.light}`,
                              p: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              textAlign: 'start',
                              justifyContent: 'start',
                              maxHeight: '200px',
                              overflowY: 'scroll',
                              borderRadius: '6px',
                              color: theme.colors.alpha.black[100],
                            }}
                          >
                            {Object.entries(topicsNotJoined).map(
                              (item, index) => {
                                if (topicsNotJoinedSelected[item[1].id]) {
                                  return (
                                    <CheckedCustom
                                      key={item[0]}
                                      color="primary"
                                      variant="outlined"
                                      label={item[1].name}
                                      checked={
                                        topicsNotJoinedSelected[item[0]] ??
                                        false
                                      }
                                      name={item[0]}
                                      sx={{
                                        ...(index !== 0 && { mt: 1 }),
                                        alignItems: 'start',
                                        '& .MuiTypography-root': {
                                          lineHeight: '26px',
                                        },
                                        pointerEvents: 'none',
                                      }}
                                    />
                                  );
                                }

                                return null;
                              }
                            )}
                          </Box>
                        </Box>
                      ),
                      callback: handleTest,
                    });
                  } else {
                    handleTest();
                  }
                }}
                rest={{
                  disabled: !quickTestDataMemo?.topicIds?.length,
                }}
              />
            </BoxSession>
          </Box>
        </BoxWrapper>
      </DialogContent>

      {dialogConfirmValue.open && (
        <DialogConfirm
          open={dialogConfirmValue.open ?? false}
          type={dialogConfirmValue.type}
          message={dialogConfirmValue.message}
          title={dialogConfirmValue.title}
          onCancel={handleCloseDialogConfirm}
          onConfirm={() => handleConfirmDialogConfirm(dialogConfirmValue)}
          confirmTitle={dialogConfirmValue.confirmTitle}
          cancelTitle={dialogConfirmValue.cancelTitle}
        />
      )}
    </Dialog>
  );
};

export { QuickTestPage };
