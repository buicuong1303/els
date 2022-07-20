/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import { LoginForm } from '@els/client-guardian-ui';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Logo } from '@els/client/app/shared/ui';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import jsCookies from 'js-cookie';
import getConfig from 'next/config';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
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

const { publicRuntimeConfig } = getConfig();

const COOKIES_URL = publicRuntimeConfig.COOKIES_URL;

export interface LoginProps {}

export const Login: FC<LoginProps> = (props) => {
  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const router = useRouter();

  useEffect(() => {
    const inviter_id: string = router?.query.inviter_id?.toString() ?? '';

    if (inviter_id) {
      jsCookies.set('inviter_id', inviter_id, { path: '/', domain: COOKIES_URL });
    }
  }, [router]);

  return (
    <MainContent>
      <TopWrapper>
        <Container maxWidth="sm">
          <Logo
            sx={{
              padding: theme.spacing(3),
              background: theme.colors.primary.main,
              display: 'flex',
              justifyContent: 'center',
            }}
          />

          <Card sx={{ mt: 3, px: 4, pt: 5, pb: 3 }}>
            <Box>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {t('Sign in')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                {t('Fill in the fields below to sign in.')}
              </Typography>
            </Box>

            <LoginForm />
          </Card>
        </Container>
      </TopWrapper>
    </MainContent>
  );
};

export default Login;
