/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, FC, useEffect, useCallback } from 'react';

import {
  IconButton,
  Box,
  List,
  ListItem,
  Typography,
  ListItemText,
  Popover,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { i18n as internationalization } from '@els/client-shared-i18n';
import { useTranslation } from 'react-i18next';
import jsCookies from 'js-cookie';
import getConfig from 'next/config';

import usFlag from 'country-flag-icons/3x2/US.svg';
import vnFlag from 'country-flag-icons/3x2/VN.svg';
import { SxProps } from '@mui/system';
import { MutationFunctionOptions } from '@apollo/client';
import { GraphqlTypes } from '@els/client/app/shared/data-access';

const { publicRuntimeConfig } = getConfig();

const SectionHeading = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.secondary.main};
    display: block;
    padding: ${theme.spacing(2, 2, 0)};
  `
);

const ImageWrapper = styled('img')(
  () => `
    width: 30px;
    margin: 3px;
  `
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    display: inline-flex;
    border-radius: ${theme.general.borderRadiusLg};
    justify-content: center;
    font-size: ${theme.typography.pxToRem(13)};
    padding: 0;
    position: relative;
    color: ${theme.colors.alpha.trueWhite[50]};
    background-color: ${theme.colors.alpha.white[10]};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(28)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    &.Mui-active,
    &:hover {
      background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[100]};
      }
    }
  `
);

const COOKIES_URL = publicRuntimeConfig.COOKIES_URL;

interface LanguageSwitcherProps {
  currentUser?: GraphqlTypes.LearningTypes.User;
  UpdateSettingApp: (options?: MutationFunctionOptions) => void;
  sx?: SxProps;
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = (props) => {
  const { sx, currentUser, UpdateSettingApp } = props;

  const theme = useTheme();

  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();

  const ref = useRef<any>(null);
  
  const [localLanguage, SetLocalLanguage] = useState(i18n.language);
  const [isOpen, setOpen] = useState<boolean>(false);

  const usFlagObject: any = usFlag;
  const vnFlagObject: any = vnFlag;

  const changeLocalLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
    SetLocalLanguage(lng);

    jsCookies.set('i18nextLng', lng, { path: '/', domain: COOKIES_URL });
  };

  const switchLanguage = useCallback(({ lng }: { lng: any }) => {
    changeLocalLanguage({ lng });

    if (currentUser) {
      UpdateSettingApp({
        variables: {
          updateSettingAppInput: {
            learningLang: currentUser.setting.appSetting.learningLang,
            fromLang: lng,
            sound: currentUser.setting.appSetting.sound,
            notification: currentUser.setting.appSetting.notification,
            listen: currentUser.setting.appSetting.listen,
            speak: currentUser.setting.appSetting.speak
          }
        }
      });
    }
  }, [currentUser, UpdateSettingApp]);

  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  useEffect(() => {
    if (currentUser) {
      changeLocalLanguage({ lng: currentUser.setting.appSetting.fromLang });
    }
  }, [currentUser]);

  useEffect(() => SetLocalLanguage(i18n.language), [i18n.language]);

  return (
    <Box sx={sx}>
      <Tooltip arrow title={t('Language switcher')}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          sx={{
            width: {
              xs: theme.spacing(4.5),
              sm: theme.spacing(5),
              md: theme.spacing(6),
            },
            height: {
              xs: theme.spacing(4.5),
              sm: theme.spacing(5),
              md: theme.spacing(6),
            }
          }}
        >
          {localLanguage === 'vi' && (
            <ImageWrapper alt={t('Vietnamese')} src={vnFlagObject.src} />
          )}
          {(localLanguage === 'en' || localLanguage === 'en-US') && (
            <ImageWrapper alt={t('English')} src={usFlagObject.src} />
          )}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ top: '8px' }}
      >
        <Box sx={{ maxWidth: 240 }}>
          <SectionHeading variant="body2" color="text.primary">
            {t('Language switcher')}
          </SectionHeading>
          <List sx={{ p: 2 }} component="nav">
            <ListItem
              className={localLanguage === 'vi' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'vi' });
                handleClose();
              }}
            >
              <ImageWrapper alt={t('Vietnamese')} src={vnFlagObject.src} />
              <ListItemText sx={{ pl: 1 }} primary={t('Vietnamese')} />
            </ListItem>
            <ListItem
              className={
                localLanguage === 'en' || localLanguage === 'en-US' ? 'active' : ''
              }
              button
              onClick={() => {
                switchLanguage({ lng: 'en' });
                handleClose();
              }}
            >
              <ImageWrapper alt={t('English')} src={usFlagObject.src} />
              <ListItemText sx={{ pl: 1 }} primary={t('English')} />
            </ListItem>
          </List>
          {/* <Divider />
          <Text color="warning">
            <Box p={2} sx={{ maxWidth: 340 }}>
              <WarningTwoToneIcon fontSize="small" />
              <Typography variant="body1">
                {t(
                  'We only translated a small part of the template, for demonstration purposes'
                )}
                !
              </Typography>
            </Box>
          </Text> */}
        </Box>
      </Popover>
    </Box>
  );
};

export default LanguageSwitcher;
