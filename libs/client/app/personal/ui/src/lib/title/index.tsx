import React, { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { GraphqlTypes } from '@els/client/app/shared/data-access';

export interface TitleProps {
  currentUser: GraphqlTypes.LearningTypes.User;
}
const Title: FC<TitleProps> = ({ currentUser }) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography
        variant="inherit"
        children={`${t('Hello')} ${t(
          currentUser.identity?.traits?.firstName
        )} ${t(currentUser.identity?.traits?.lastName)}!`}
        sx={{
          fontSize: '24px',
          fontWeight: 700,
        }}
      />
      {currentUser.extraInfo?.numberOfTodoMissions === 0 && (
        <Box>
          <Box
            component="span"
            children={`${t('Welcome back')},`}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.secondary.light,
            }}
          />
          <Box
            component="span"
            children={t('All')}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.secondary.light,
            }}
          />
          <Box
            component="span"
            children={t('missions')}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.primary.main,
              cursor: 'pointer',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => router.push('/missions')}
          />
          <Box
            component="span"
            children={t('for today have been completed, congratulations!')}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.secondary.light,
            }}
          />
        </Box>
      )}
      {currentUser.extraInfo?.numberOfTodoMissions > 0 && (
        <Box>
          <Box
            component="span"
            children={`${t('Welcome back')}, ${t('you have')}`}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.secondary.light,
            }}
          />
          <Box
            component="span"
            children={`${t(currentUser.extraInfo?.numberOfTodoMissions)} ${t(
              'mission'
            )}`}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.primary.main,
              cursor: 'pointer',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => router.push('/missions')}
          />
          <Box
            component="span"
            children={`${t('need to complete today')}`}
            sx={{
              mr: 0.5,
              fontSize: '18px',
              color: theme.colors.secondary.light,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export{ Title };
