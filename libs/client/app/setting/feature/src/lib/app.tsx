/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ButtonCustom, LoadingData } from '@els/client/app/shared/ui';
import { Box, FormControl, MenuItem, Select, Switch, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { cloneDeep } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import vnFlag from 'country-flag-icons/3x2/VN.svg';
import usFlag from 'country-flag-icons/3x2/US.svg';
import { MutationFunctionOptions } from '@apollo/client';
import { DialogConfirmValueType } from './setting';
import { i18n as internationalization } from '@els/client-shared-i18n';

const AppWrapper = styled(Box)(
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
  `
);

const ImageWrapper = styled('img')(
  () => `
    width: 30px;
  `
);

const langsStudy: GraphqlTypes.LearningTypes.Language[] = [
  { id: uuidv4(), fromTopics: [], learningTopics: [], code: 'en', name: 'English' },
];

const languages: GraphqlTypes.LearningTypes.Language[] = [
  { id: uuidv4(), fromTopics: [], learningTopics: [], code: 'vi', name: 'Việt Nam' },
  { id: uuidv4(), fromTopics: [], learningTopics: [], code: 'en', name: 'English' },
]; 

export interface AppProps {
  currentUser: GraphqlTypes.LearningTypes.User;
  UpdateSettingApp: (options?: MutationFunctionOptions) => void;
  UpdateSettingAppLoading: boolean;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
}

export const App: FC<AppProps> = (props) => {
  const { currentUser, UpdateSettingApp, UpdateSettingAppLoading, handleOpenDialogConfirm } = props;
  const [openDialogWarning, setOpenDialogWarning] = useState<boolean>(false);
  const theme = useTheme();
  
  const { t }: { t: any } = useTranslation();
  const vnFlagObject: any = vnFlag;
  const usFlagObject: any = usFlag;

  // * page state
  interface AppOptionDataType {
    learningLang: string;
    fromLang: string;
    sound: boolean;
    notification: boolean;
    listen: boolean;
    speak: boolean;
  }

  const initAppOptionData: AppOptionDataType = {
    learningLang: 'en',
    fromLang: 'vi',
    sound: true,
    notification: true,
    listen: true,
    speak: true,
  };
  const [appOptionData, setAppOptionData] = useState<AppOptionDataType>(initAppOptionData);

  // * load data
  
  // * handle logic
  const handleChange = useCallback((event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    const type = event.target.type;
    const checked = event.target.checked;
    if (name === 'notification' && value && Notification.permission === 'denied') {
      setOpenDialogWarning(true);
      return;     
    }
    setAppOptionData({
      ...appOptionData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }, [appOptionData]);

  function setOptionData() {
    setAppOptionData({
      learningLang: currentUser.setting?.appSetting?.learningLang ?? 'en',
      fromLang: currentUser.setting?.appSetting?.fromLang ?? 'vi',
      sound: currentUser.setting?.appSetting?.sound ?? true,
      notification: currentUser.setting?.appSetting?.notification ?? true,
      listen: currentUser.setting?.appSetting?.listen ?? true,
      speak: currentUser.setting?.appSetting?.speak ?? true,
    });
  }

  const handleReset = useCallback(() => {
    setOptionData();
  }, [currentUser]);

  const handleUpdate = useCallback(() => {
    internationalization.changeLanguage(appOptionData.fromLang);

    UpdateSettingApp({
      variables: {
        updateSettingAppInput: {
          learningLang: appOptionData.learningLang,
          fromLang: appOptionData.fromLang,
          sound: appOptionData.sound,
          notification: appOptionData.notification,
          listen: appOptionData.listen,
          speak: appOptionData.speak
        }
      }
    });
  }, [appOptionData, UpdateSettingApp]);

  useEffect(() => {
    setOptionData();
  }, [currentUser]);

  function mapItem(item: any) {
    return <MenuItem
      key={item.code}
      value={item.code}
      sx={{ p: '8px 14px' }}
    >
      { item.code === 'vi' && <ImageWrapper alt={t('Vietnamese')} src={vnFlagObject.src} /> }
      { item.code === 'en' && <ImageWrapper alt={t('English')} src={usFlagObject.src} /> }
    </MenuItem>;
  }

  // * render ui
  return (
    <AppWrapper width="100%" maxWidth="440px">
      {/* options */}
      <Dialog open={openDialogWarning}>
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
          {t('Notification Not Allowed')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              t('You currently have desktop notifications turned off. Please update your browser\'s settings to either allow desktop notification or allow site to ask for permission')
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogWarning(false)} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        {/* learningLang */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Learn language')}
          />

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 80,
              fontSize: '12px',
              fontWeight: 500,
              '.MuiSelect-select': {
                padding: '8px 14px',
                height: '0 !important',
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
              name="learningLang"
              value={appOptionData.learningLang}
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
              {cloneDeep(langsStudy).map(mapItem)}
            </Select>
          </FormControl>
        </OptionItem>

        {/* fromLang */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Display language')}
          />

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 80,
              fontSize: '12px',
              fontWeight: 500,
              '.MuiSelect-select': {
                padding: '8px 14px',
                height: '0 !important',
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
              name="fromLang"
              value={appOptionData.fromLang}
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
              {cloneDeep(languages).map(mapItem)}
            </Select>
          </FormControl>
        </OptionItem>
        
        {/* sound */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Sound effects')}
          />

          <Box mr="-12px">
            <Switch
              name="sound"
              checked={appOptionData.sound}
              onChange={handleChange}
              size="medium"
              sx={{
                py: '12px',
                pl: '8px !important',
                pR: '12px !important',
              }}
            />
          </Box>
        </OptionItem>
        
        {/* notification */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Notify')}
          />

          <Box mr="-12px">
            <Switch
              name="notification"
              checked={appOptionData.notification}
              onChange={handleChange}
              size="medium"
              sx={{
                py: '12px',
                pl: '8px !important',
                pR: '12px !important',
              }}
            />
          </Box>
        </OptionItem>
        
        {/* listen */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Listening exercises')}
          />

          <Box mr="-12px">
            <Switch
              name="listen"
              checked={appOptionData.listen}
              onChange={handleChange}
              size="medium"
              sx={{
                py: '12px',
                pl: '8px !important',
                pR: '12px !important',
              }}
            />
          </Box>
        </OptionItem>
        
        {/* speak */}
        <OptionItem>
          <OptionItemLabel
            color="inherit"
            variant="subtitle1"
            children={t('Speaking exercises')}
          />

          <Box mr="-12px">
            <Switch
              name="speak"
              checked={appOptionData.speak}
              onChange={handleChange}
              size="medium"
              sx={{
                py: '12px',
                pl: '8px !important',
                pR: '12px !important',
              }}
            />
          </Box>
        </OptionItem>
      </Box>

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
          {...UpdateSettingAppLoading ? {
            children: t('Updating'),
            startIcon: <LoadingData />
          } : {
            children: t('Update'),
            startIcon: null
          }}
          onClick={() => {
            handleOpenDialogConfirm({
              title: t('Will update your app settings'),
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
    </AppWrapper>
  );
};

export default App;
