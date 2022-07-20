/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';

import {
  IconButton,
  Box,
  List,
  ListItem,
  Typography,
  ListItemText,
  Popover,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { i18n as internationalization } from '@els/client-shared-i18n';
import { useTranslation } from 'react-i18next';
import jsCookies from 'js-cookie';
import getConfig from 'next/config';

import usFlag from 'country-flag-icons/3x2/US.svg';
import vnFlag from 'country-flag-icons/3x2/VN.svg';

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
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
  `
);

const COOKIES_URL = publicRuntimeConfig.COOKIES_URL;

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;

  const usFlagObject: any = usFlag;
  const vnFlagObject: any = vnFlag;

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);

    jsCookies.set('i18nextLng', lng, { path: '/', domain: COOKIES_URL });
  };
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Language switcher')}>
        <IconButtonWrapper color="secondary" ref={ref} onClick={handleOpen}>
          {getLanguage === 'vi' && (
            <ImageWrapper alt={t('Vietnamese')} src={vnFlagObject.src} />
          )}
          {(getLanguage === 'en' || getLanguage === 'en-US') && (
            <ImageWrapper alt={t('English')} src={usFlagObject.src} />
          )}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ maxWidth: 240 }}>
          <SectionHeading variant="body2" color="text.primary">
            {t('Language switcher')}
          </SectionHeading>
          <List sx={{ p: 2 }} component="nav">
            <ListItem
              className={getLanguage === 'vi' ? 'active' : ''}
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
                getLanguage === 'en' || getLanguage === 'en-US' ? 'active' : ''
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
    </>
  );
}

export default LanguageSwitcher;
