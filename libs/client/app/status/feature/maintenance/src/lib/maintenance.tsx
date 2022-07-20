/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';


import { Logo } from '@els/client/app/shared/ui';

import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
  `
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(6)};
  `
);

export const Maintenance:FC = () => {
  const { t }: { t: any } = useTranslation();

  const theme = useTheme();
  
  return (
    <Box sx={{ overflowY: 'auto', height: '100%' }}>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Logo
              sx={{
                padding: theme.spacing(3),
                background: theme.colors.primary.main,
                display: 'flex',
                justifyContent: 'center',
              }}
            />
            <Box textAlign="center">
              <Container maxWidth="xs">
                <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                  {t('The site is currently down for maintenance')}
                </Typography>
                <Typography
                  variant="h3"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  {t('We apologize for any inconveniences caused')}
                </Typography>
              </Container>
              <img
                alt="Maintenance"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                }}
                src="/images/status/maintenance.svg"
              />
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Phone')}:{' '}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.primary"
                >
                  + 00 1 888 555 444
                </Typography>
              </Box>
              <Box>
                <Tooltip arrow placement="top" title="Facebook">
                  <IconButton color="primary">
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Twitter">
                  <IconButton color="primary">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Instagram">
                  <IconButton color="primary">
                    <InstagramIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </Box>
  );
};

export default Maintenance;