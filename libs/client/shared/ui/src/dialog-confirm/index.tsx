/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Dialog, DialogActions, Typography, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC, ReactNode, useEffect } from 'react';
import { ButtonCustom } from '@els/client/app/shared/ui';
import { useTranslation } from 'react-i18next';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '..';
import { addAlpha } from '@els/client/shared/utils';

export enum DialogConfirmType {
  error='error',
  warning='warning',
  info='info',
  success='success',
};

interface DialogConfirmProps {
  open: boolean;
  type: DialogConfirmType;
  title?: ReactNode;
  message?: ReactNode;
  onCancel?: () => void;
  cancelTitle?: ReactNode;
  onConfirm: () => void;
  confirmTitle?: ReactNode;
  sx?: SxProps;
  rest?: any;
};

const DialogConfirm: FC<DialogConfirmProps> = (props) => {
  const { open, type, title, message, onCancel, cancelTitle, onConfirm, confirmTitle, sx, rest } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  useEffect(() => {
    document.onkeydown = (event) => {
      if (event.key === 'Enter') {
        onConfirm();
      };
    };
  }, [onConfirm]);

  useEffect(() => {
    return () => {
      document.onkeydown = null;
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        '.MuiPaper-root': {
          minWidth: { xs: '320px', md: '550px' },
          px: { xs: 2, sm: 4, md: 7, lg: 10 },
          py: { xs: 2, md: 7 },
        },
        ...sx,
      }}
    >
      <ButtonCustom
        color={type}
        variant="outlined"
        sx={{
          width: '80px',
          height: '80px',
          padding: 0,
          margin: 'auto',
          border: 'unset !important',
          borderRadius: '50%',
          ...type === 'error' && {background: theme.colors.error.lighter},
          ...type === 'warning' && {background: theme.colors.warning.lighter},
          ...type === 'info' && {background: theme.colors.info.lighter},
          ...type === 'success' && {background: theme.colors.success.lighter},
        }}
      >
        {type === 'error' && <ErrorIcon width="60px" height="60px" />}
        {type === 'warning' && <WarningIcon width="60px" height="60px" />}
        {type === 'info' && <InfoIcon width="60px" height="60px" />}
        {type === 'success' && <SuccessIcon width="60px" height="60px" />}
      </ButtonCustom>

      { title && (
        <Typography
          variant="inherit"
          textAlign="center"
          children={title}
          sx={{
            mt: { xs: 1.5, md: 3 },
            textAlign: 'center',
            fontSize: { xs: '20px', md: '23px' },
            fontWeight: 700,
            lineHeight: '30px',
          }}
        />
      )}

      { message && (
        <Box
          textAlign="center"
          children={message}
          sx={{
            mt: { xs: 1.5, md: 3 },
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: addAlpha(theme.colors.alpha.black[100], 0.5)
          }}
        />
      )}

      <DialogActions
        sx={{
          justifyContent: 'center',
          mt: { xs: 1.5, md: 3 },
          p: 0,
        }}
      >
        {onCancel && (
          <ButtonCustom
            color="primary"
            variant="outlined"
            children={cancelTitle ?? t('Cancel')}
            onClick={() => onCancel()}
            sx={{
              color: theme.colors.secondary.main,
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '18.75px',
              marginLeft: 1.5,
              marginRight: 1.5,
              px: { xs: `calc(${theme.spacing(3)} - 1px)`, md: `calc(${theme.spacing(4)} - 1px)` },
              py: { xs: `calc(${theme.spacing(1)} - 1px)`, md: `calc(${theme.spacing(2)} - 1px)` },
            }}
          />
        )}
        {type === 'error' && (
          <ButtonCustom
            color="error"
            variant="contained"
            children={confirmTitle ?? t('Confirm')}
            onClick={() => onConfirm()}
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '18.75px',
              marginLeft: 1.5,
              marginRight: 1.5,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 2 },
            }}
          />
        )}
        {type === 'warning' && (
          <ButtonCustom
            color="warning"
            variant="contained"
            children={confirmTitle ?? t('Confirm')}
            onClick={() => onConfirm()}
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '18.75px',
              marginLeft: 1.5,
              marginRight: 1.5,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 2 },
            }}
          />
        )}
        {type === 'info' && (
          <ButtonCustom
            color="info"
            variant="contained"
            children={confirmTitle ?? t('Confirm')}
            onClick={() => onConfirm()}
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '18.75px',
              marginLeft: 1.5,
              marginRight: 1.5,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 2 },
            }}
          />
        )}
        {type === 'success' && (
          <ButtonCustom
            color="success"
            variant="contained"
            children={confirmTitle ?? t('Confirm')}
            onClick={() => onConfirm()}
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '18.75px',
              marginLeft: 1.5,
              marginRight: 1.5,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 2 },
            }}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export { DialogConfirm };
