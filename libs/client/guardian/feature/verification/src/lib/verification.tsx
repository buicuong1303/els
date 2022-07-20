/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { ButtonCustom, Logo } from '@els/client/app/shared/ui';
import { FC } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

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

export interface VerificationProps {}

export const Verification: FC<VerificationProps> = (props) => {
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

          <Card sx={{ mt: 8, px: 4, pt: 5, pb: 3, position: 'relative', overflow: 'unset' }}>
            <ButtonCustom
              startIcon={<VerifiedIcon sx={{ fontSize: '60px !important', color: theme.colors.success.main }} />}
              sx={{
                minWidth: 'unset',
                p: theme.spacing(1),
                m: 0,
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `solid 5px ${theme.palette.background.default}`,
                backgroundColor: `${theme.palette.background.default} !important`,
                cursor: 'default',
              }}
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h2" sx={{ mb: 1, color: theme.colors.success.main }}>
                {t('Verification Success')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                {t(
                  'Thank you for your support, we have successfully verified your email address. Please login to continue your session.'
                )}
              </Typography>
              <ButtonCustom children={t('Go now')} endIcon={< DoubleArrowIcon/>} color="success" onClick={() => window.location.href = publicRuntimeConfig.APP_URL || ''} />
            </Box>
          </Card>
        </Container>
      </TopWrapper>
    </MainContent>
  );
};

export default Verification;
