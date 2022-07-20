/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import { RegisterForm } from '@els/client-guardian-ui';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { ButtonCustom, Logo } from '@els/client/app/shared/ui';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

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

export interface RegisterProps {}

export const Register: FC<RegisterProps> = (props) => {
  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const router = useRouter();

  return (
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

          <Card sx={{ mt: 3, px: 4, pt: 5, pb: 3 }}>
            <Box>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {t('Create account')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                {t('Fill in the fields below to sign up.')}
              </Typography>
            </Box>

            <RegisterForm />

            <Box my={4}>
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
                fontWeight="bold"
              >
                {t('Already have an account?')}
              </Typography>{' '}
              <ButtonCustom
                children={t('Sign in here')} onClick={() => router.push('/login')}
                sx={{
                  backgroundColor: 'unset !important',
                  padding: 0,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}  
              />
            </Box>
          </Card>
        </Container>
      </TopWrapper>
    </MainContent>
  );
};

export default Register;
