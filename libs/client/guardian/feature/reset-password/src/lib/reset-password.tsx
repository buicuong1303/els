/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import { ResetPasswordForm } from '@els/client-guardian-ui';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { ButtonCustom, Logo } from '@els/client/app/shared/ui';
import { FC } from 'react';
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

export interface ResetPasswordProps {}

export const ResetPassword: FC<ResetPasswordProps> = (props) => {
  const { t }: { t: any } = useTranslation();

  const theme = useTheme();
  
  const router = useRouter();

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
                {t('Reset Password')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                {t(
                  'Enter a strong but easy to remember password.'
                )}
              </Typography>
            </Box>

            <ResetPasswordForm />

            <Box my={4}>
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
                fontWeight="bold"
              >
                {t('Want to sign in?')}
              </Typography>{' '}
              <ButtonCustom
                children={t('Click here')} onClick={() => router.push('/login')}
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

export default ResetPassword;
