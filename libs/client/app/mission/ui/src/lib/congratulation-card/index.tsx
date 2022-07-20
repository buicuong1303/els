import { ButtonCustom } from '@els/client/app/shared/ui';
import { Dialog, Typography, useTheme } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface CongratulationCardProps {
  open: boolean;
  onClose: () => void;
  icon?: any;
  title?: ReactNode;
  message?: ReactNode;
  buttonLabel?: ReactNode;
  sx?: SxProps;
  rest?: any;
}

const CongratulationCard: FC<CongratulationCardProps> = (props) => {
  const { open, onClose, icon, title, message, buttonLabel, sx, rest } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '.MuiPaper-root': {
          minWidth: '340px',
          minHeight: '350px',
          overflow: 'inherit',
          backgroundColor: '#ffffff00',
          boxShadow: 'unset',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '6px',
          padding: theme.spacing(0, 4, 4),
          backgroundColor: theme.colors.alpha.white[100],
          boxShadow: theme.colors.shadows.card,
          ...sx,
        }}
        {...rest}
      >
        {/* icon */}
        { icon && (
          <Box
            sx={{
              position: 'relative',
              textAlign: 'center',
              mt: { xs: '-30px', sm: '-40px', md: '-50px', lg: '-60px' }
            }}
          >
            <ButtonCustom
              variant="contained"
              color="inherit"
              startIcon={icon}
              sx={{
                position: 'relative',
                backgroundColor: `${theme.colors.secondary.lighter} !important`,
                cursor: 'unset',
                minWidth: 'unset',
                width: { xs: '60px', sm: '80px', md: '100px', lg: '120px' },
                height: { xs: '60px', sm: '80px', md: '100px', lg: '120px' },
                borderRadius: '50%',
                color: 'unset',
                p: 0,
              }}
            />
          </Box>
        )}

        {/* title  */}
        {title && (
          <Typography
            variant="inherit"
            children={title}
            sx={{
              mt: { xs: 3, md: 5},
              textAlign: 'center',
              color: theme.colors.warning.main,
              fontSize: { xs: '24px', md: '28px' },
              fontWeight: 700,
            }}
          />
        )}

        {/* message */}
        {message}
  
        {/* action */}
        <Box textAlign="center" mt={{ xs: 3, md: 5 }}>
          <ButtonCustom
            variant="contained"
            color="primary"
            children={buttonLabel ?? t('Keep studying')}
            sx={{
              px: { xs: 2, sm: 3, md: 3, lg: 4 },
              py: { xs: 1, sm: 1, md: 2, lg: 2 },
              fontSize: '16px', 
              fontWeight: 700,
              lineHeight: '19px',
            }}
            onClick={onClose}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export { CongratulationCard };
