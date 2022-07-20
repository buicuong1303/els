/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ReactNode } from 'react';
import { SxProps } from '@mui/system';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
  Dialog,
  Avatar,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { useTranslation } from 'react-i18next';


import {
  ButtonCustom, 
} from '@els/client/app/shared/ui';
import { GraphqlTypes } from '@els/client/app/shared/data-access';


export interface ViewReactionListProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  title: ReactNode;
  reactionList: GraphqlTypes.LearningTypes.Reaction[];
  sx?: SxProps;
}

const ViewReactionList = (props: ViewReactionListProps) => {
  const { reactionList, sx, open, setOpen, title } = props;

  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   console.log(reactionList);
  // }, [reactionList]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
      sx={{
        zIndex: 10001,
        '.MuiDialog-paper': {
          minWidth: '310px',
          maxWidth: '360px',
          boxShadow: `0px 0px 10px 2px ${theme.colors.alpha.black[50]}`,
        },
        ...sx,
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: theme.spacing(2),
        }}
      >
        <Typography
          variant="h3"
          children={title}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ p: 1, minHeight: '160px' }}>
        {reactionList.map((item, index) => {
          return (
            <Box
              key={item._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  alt={item.user.identity?.traits.firstName}
                  src={item.user.identity?.traits.picture?.toString()}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: {
                      xs: 1,
                      md: 1.5
                    },
                  }}
                />
                <Typography
                  variant="inherit"
                  children={`${item.user.identity?.traits.firstName} ${item.user.identity?.traits.lastName}`}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,

                  }}
                />
              </Box>
              <ButtonCustom
                startIcon={
                  <ThumbUpIcon
                    sx={{
                      fontSize: '12px !important',
                      fill: theme.colors.primary.light,
                      stroke: '#ffffff',
                      strokeWidth: '2px',
                    }}
                  />
                }
                variant="contained"
                sx={{
                  p: 0,
                  width: '18px',
                  height: '18px',
                  minWidth: 'unset',
                  borderRadius: '50%',
                  mr: 4,
                }}
              />
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions
        sx={{ display: 'flex', justifyContent: 'end', px: theme.spacing(2) }}
      >
        <ButtonCustom
          children={t('Close')}
          onClick={handleClose}
          sx={{
            fontSize: '13px',
            color: theme.colors.secondary.main,
            fontWeight: 100,
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export { ViewReactionList };
