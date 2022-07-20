/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationFunctionOptions } from '@apollo/client';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { BrainIcon, ButtonCustom, LoadingData, StreakIcon } from '@els/client/app/shared/ui';
import { Box, FormControl, Grid, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { cloneDeep } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { DialogConfirmValueType } from './setting';

const TargetWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
  `
);

const OptionItem = styled(Box)(
  ({ theme }) => `
    flex: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  `
);

const OptionItemLabel = styled(Typography)(
  ({ theme }) => `
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${theme.colors.secondary.main}
  `
);

interface SelectOptionType {
  id: string;
  label: string | number;
  value: string | number;
}

const wordOptions: SelectOptionType[] = [
  { id: uuidv4(), label: 'Off', value: 0 },
  { id: uuidv4(), label: 5, value: 5 },
  { id: uuidv4(), label: 10, value: 10 },
  { id: uuidv4(), label: 15, value: 15 },
  { id: uuidv4(), label: 20, value: 20 },
  { id: uuidv4(), label: 30, value: 30 },
  { id: uuidv4(), label: 50, value: 50 },
  { id: uuidv4(), label: 100, value: 100 },
];

const expOptions: SelectOptionType[] = [
  { id: uuidv4(), label: 50, value: 50 },
  { id: uuidv4(), label: 100, value: 100 },
  { id: uuidv4(), label: 150, value: 150 },
  { id: uuidv4(), label: 200, value: 200 },
  { id: uuidv4(), label: 300, value: 300 },
  { id: uuidv4(), label: 500, value: 500 },
  { id: uuidv4(), label: 1000, value: 1000 },
]; 

export interface TargetProps {
  currentUser: GraphqlTypes.LearningTypes.User;
  UpdateSettingTarget: (options?: MutationFunctionOptions) => void;
  UpdateSettingTargetLoading: boolean;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
}

export const Target: FC<TargetProps> = (props) => {
  const { currentUser, UpdateSettingTarget, UpdateSettingTargetLoading, handleOpenDialogConfirm } = props;

  const theme = useTheme();
  
  const { t }: { t: any } = useTranslation();

  // * page state
  interface TargetOptionDataType {
    reviewForgot: number;
    reviewVague: number;
    learnNew: number;
    exp: number;
  }

  const initTargetOptionData: TargetOptionDataType = {
    reviewForgot: 20,
    reviewVague: 10,
    learnNew: 5,
    exp: 50,
  };
  const [targetOptionData, setTargetOptionData] = useState<TargetOptionDataType>(initTargetOptionData);

  // * load data
  
  // * handle logic
  const handleChange = useCallback((event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    const type = event.target.type;
    const checked = event.target.checked;

    setTargetOptionData({
      ...targetOptionData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }, [targetOptionData]);

  function setOptionData() {
    setTargetOptionData({
      reviewForgot: currentUser.setting?.targetSetting?.review_forgot,
      reviewVague: currentUser.setting?.targetSetting?.review_vague,
      learnNew: currentUser.setting?.targetSetting?.learn_new,
      exp: currentUser.setting?.appSetting?.exp,
    });
  }

  const handleReset = useCallback(() => {
    setOptionData();
  }, [currentUser]);

  const handleUpdate = useCallback(() => {
    UpdateSettingTarget({
      variables:  {
        updateSettingTarget: {
          reviewForgot: targetOptionData.reviewForgot,
          reviewVague: targetOptionData.reviewVague,
          learnNew: targetOptionData.learnNew,
          exp: targetOptionData.exp,
        },
      },
    });
  }, [targetOptionData]);

  useEffect(() => {
    setOptionData();
  }, [currentUser]);

  function mapItem(item: any) {
    return (
      <MenuItem key={item.id} value={item.value} sx={{ p: '8px 14px' }}>
        {item.label}
      </MenuItem>
    );
  }

  // * render ui
  return (
    <TargetWrapper width="100%" maxWidth="960px">
      {/* options */}
      <Grid
        container
        rowSpacing="20px"
        columnSpacing={{ xs: '20px', md: '40px', lg: '48px' }}
        alignItems="start"
      >
        <Grid item xs={12} md={6}>
          <OptionItem>
            {/* Group title */}
            <Box display="flex" alignItems="center" pr="20px">
              <ButtonCustom
                variant="contained"
                color="error"
                startIcon={
                  <BrainIcon
                    width={{ xs: '18px', md: '24px' }}
                    height={{ xs: '18px', md: '24px' }}
                    color="#ffffff"
                    bgcolor={theme.colors.error.main}
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: { xs: '30px', md: '40px' },
                  height: { xs: '30px', md: '40px' },
                  mr: '20px',
                  pointerEvents: 'none',
                }}
              />

              <OptionItemLabel
                variant="subtitle1"
                children={(
                  <>
                    <Typography variant="inherit" component="span" children={t('The number of')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" sx={{ color: theme.colors.error.main }} children={t('forgotten words')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" children={t('that need to be reviewed every day')} />
                  </>
                )}
              />
            </Box>

            {/* input */}
            <Box>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 80,
                  minHeight: 40,
                  '.MuiOutlinedInput-root': {
                    minHeight: 40,
                  },
                  '.MuiSelect-select': {
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 700,
                    padding: '8px 12px',
                    height: '40 !important',
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
                  name="reviewForgot"
                  value={targetOptionData.reviewForgot}
                  onChange={handleChange}
                  sx={{
                    p: 0,
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      horizontal: 'center',
                      vertical: 'bottom',
                    },
                  }}
                >
                  {cloneDeep(wordOptions).map(mapItem)}
                </Select>
              </FormControl>
            </Box>
          </OptionItem>

          <OptionItem>
            {/* Group title */}
            <Box display="flex" alignItems="center" pr="20px">
              <ButtonCustom
                variant="contained"
                color="warning"
                startIcon={
                  <BrainIcon
                    width={{ xs: '18px', md: '24px' }}
                    height={{ xs: '18px', md: '24px' }}
                    color="#ffffff"
                    bgcolor={theme.colors.warning.main}
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: { xs: '30px', md: '40px' },
                  height: { xs: '30px', md: '40px' },
                  mr: '20px',
                  pointerEvents: 'none',
                }}
              />

              <OptionItemLabel
                variant="subtitle1"
                children={(
                  <>
                    <Typography variant="inherit" component="span" children={t('The number of')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" sx={{ color: theme.colors.warning.main }} children={t('vague words')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" children={t('that need to be reviewed every day')} />
                  </>
                )}
              />
            </Box>

            {/* input */}
            <Box>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 80,
                  minHeight: 40,
                  '.MuiOutlinedInput-root': {
                    minHeight: 40,
                  },
                  '.MuiSelect-select': {
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 700,
                    padding: '8px 12px',
                    height: '40 !important',
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
                  name="reviewVague"
                  value={targetOptionData.reviewVague}
                  onChange={handleChange}
                  sx={{
                    p: 0,
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      horizontal: 'center',
                      vertical: 'bottom',
                    },
                  }}
                >
                  {cloneDeep(wordOptions).map(mapItem)}
                </Select>
              </FormControl>
            </Box>
          </OptionItem>

          <OptionItem>
            {/* Group title */}
            <Box display="flex" alignItems="center" pr="20px">
              <ButtonCustom
                variant="contained"
                color="info"
                startIcon={
                  <BrainIcon
                    width={{ xs: '18px', md: '24px' }}
                    height={{ xs: '18px', md: '24px' }}
                    color="#ffffff"
                    bgcolor={theme.colors.info.main}
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: { xs: '30px', md: '40px' },
                  height: { xs: '30px', md: '40px' },
                  mr: '20px',
                  pointerEvents: 'none',
                }}
              />

              <OptionItemLabel
                variant="subtitle1"
                children={(
                  <>
                    <Typography variant="inherit" component="span" children={t('The number of')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" sx={{ color: theme.colors.info.main }} children={t('new words')} />
                    &nbsp;
                    <Typography variant="inherit" component="span" children={t('need to study every day')} />
                  </>
                )}
              />
            </Box>

            {/* input */}
            <Box>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 80,
                  minHeight: 40,
                  '.MuiOutlinedInput-root': {
                    minHeight: 40,
                  },
                  '.MuiSelect-select': {
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 700,
                    padding: '8px 12px',
                    height: '40 !important',
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
                  name="learnNew"
                  value={targetOptionData.learnNew}
                  onChange={handleChange}
                  sx={{
                    p: 0,
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      horizontal: 'center',
                      vertical: 'bottom',
                    },
                  }}
                >
                  {cloneDeep(wordOptions).map(mapItem)}
                </Select>
              </FormControl>
            </Box>
          </OptionItem>
        </Grid>

        <Grid item xs={12} md={6}>
          <OptionItem>
            {/* Group title */}
            <Box display="flex" alignItems="center" pr="20px">
              <ButtonCustom
                variant="contained"
                color="info"
                startIcon={
                  <StreakIcon
                    width={{ xs: '18px', md: '24px' }}
                    height={{ xs: '18px', md: '24px' }}
                    color="#ffffff"
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: { xs: '30px', md: '40px' },
                  height: { xs: '30px', md: '40px' },
                  mr: '20px',
                  pointerEvents: 'none',
                }}
              />

              <OptionItemLabel
                variant="subtitle1"
                children={t('Exp to gain every day')}
              />
            </Box>

            {/* input */}
            <Box>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 80,
                  minHeight: 40,
                  '.MuiOutlinedInput-root': {
                    minHeight: 40,
                  },
                  '.MuiSelect-select': {
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 700,
                    padding: '8px 12px',
                    height: '40 !important',
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
                  name="exp"
                  value={targetOptionData.exp}
                  onChange={handleChange}
                  sx={{
                    p: 0,
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      horizontal: 'center',
                      vertical: 'bottom',
                    },
                  }}
                >
                  {cloneDeep(expOptions).map(mapItem)}
                </Select>
              </FormControl>
            </Box>
          </OptionItem>
        </Grid>
      </Grid>

      {/* action */}
      <Box display="flex" justifyContent="center" my={{ xs: 5, md: 10 }}>
        <ButtonCustom
          variant="outlined"
          color="secondary"
          children={t('Cancel')}
          onClick={handleReset}
          sx={{
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '18px',
            p: '10px 22px',
          }}
        />

        <ButtonCustom
          variant="contained"
          color="primary"
          children={UpdateSettingTargetLoading ? t('Updating') : t('Update')}
          startIcon={UpdateSettingTargetLoading ? <LoadingData /> : null}
          onClick={() => {
            handleOpenDialogConfirm({
              title: t('Will update your target settings'),
              message: t('Do you want to continue?'),
              callback: handleUpdate,
            });
          }}
          sx={{
            maxHeight: '40px',
            minWidth: '120px',
            ml: '20px',
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '18px',
            p: '10px 22px',
          }}
        />
      </Box>
    </TargetWrapper>
  );
};

export default Target;
