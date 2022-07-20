/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  // OutlinedInput,
  // Button,
  useTheme
} from '@mui/material';

import { Logo } from '@els/client/app/shared/ui';

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

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
  font-size: ${theme.typography.pxToRem(75)};
`
);

const TypographyH3 = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.alpha.black[50]};
`
);

// const OutlinedInputWrapper = styled(OutlinedInput)(
//   ({ theme }) => `
//     background-color: ${theme.colors.alpha.white[100]};
// `
// );

// const ButtonNotify = styled(Button)(
//   ({ theme }) => `
//     margin-right: -${theme.spacing(1)};
// `
// );

export const ComingSoon:FC = () => {
  const { t }: { t: any } = useTranslation();
  
  const theme = useTheme();

  const calculateTimeLeft = () => {
    const difference = +new Date('2022') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents:any = [];

  Object.keys(timeLeft).forEach((interval, index) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <Box
        key={index}
        textAlign="center"
        sx={{
          px: {
            xs: theme.spacing(1),
            md: theme.spacing(3),
          },
        }}
      >
        <TypographyH1
          variant="h3"
          sx={{
            fontSize: {
              xs: '2rem',
              md: '4rem',
              lg: '5rem',
            }
          }}
          children={timeLeft[interval]}
        />
        <TypographyH3 variant="h4" children={interval} />
      </Box>
    );
  });

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
            <Box textAlign="center" mb={3}>
              <Container maxWidth="xs">
                <Typography variant="h1" sx={{ mt: 4, mb: 2 }}>
                  {t('Coming Soon')}
                </Typography>
                <Typography
                  variant="h3"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  {t(
                    'We are working on implementing the last features before our launch!'
                  )}
                </Typography>
              </Container>
              <img
                alt="Coming Soon"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                }}
                src="/images/status/coming-soon.svg"
              />
            </Box>

            <Box display="flex" justifyContent="center">
              {timerComponents.length ? timerComponents : <>Time's up!</>}
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </Box>
  );
};

export default ComingSoon;