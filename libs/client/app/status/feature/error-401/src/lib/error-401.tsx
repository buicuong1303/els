/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  // useTheme,
} from '@mui/material';


import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

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

export const Error401:FC = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <Box sx={{ overflowY: 'auto', height: '100%' }}>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <img
                alt="401"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                }}
                src="/images/status/401.svg"
              />
              <Typography variant="h2" sx={{ my: 2 }}>
                {t('We are sorry but we are unable to authenticate you.')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                {t(
                  'You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.'
                )}
              </Typography>

              <Button href="/" variant="outlined">
                {t('Back to home')}
              </Button>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </Box>
  );
};

export default Error401;