/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonCustom, CheckedCustom, LabelCustom } from '@els/client/app/shared/ui';
import { SuccessIcon } from '@els/client/shared/ui';
import { Box, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export interface EventItemProps {
  isCurrentDay: boolean;
  isCompleted?: boolean;
  callback?: () => void
  sx?: SxProps;
  rest?: any;
}

export function EventItem(props: EventItemProps) {
  const { isCurrentDay, isCompleted, callback, sx, rest } = props;
  
  const { t }: { t: any } = useTranslation();

  const [checked, setChecked] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.alpha.white[100],
        padding: 2,
        ...sx,
      }}
      {...rest}
    >
      {
        isCompleted
          ? (
            <>
              {isCurrentDay && (
                <LabelCustom
                  color="primary"
                  startIcon={<FiberManualRecordIcon sx={{ width: '12px', height: '12px', mr: '5px' }} />}
                  children={t('Today')}
                  sx={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: theme.colors.primary.dark,
                    borderRadius: '6px',
                  }}
                />
              )}
              <ButtonCustom
                color="success"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  width: { xs: '30px', md: '40px' },
                  height: { xs: '30px', md: '40px' },
                  minWidth: 'unset',
                  padding: 0,
                  margin: 'auto',
                  border: 'unset !important',
                  borderRadius: '50%',
                  background: theme.colors.success.lighter,
                  pointerEvents: 'none',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <SuccessIcon
                  sx={{
                    width: { xs: '24px', md: '30px' },
                    height: { xs: '24px', md: '30px' }
                  }}
                />
              </ButtonCustom>
            </>
          )
          : callback && (
            <>
              <LabelCustom
                color="primary"
                startIcon={<FiberManualRecordIcon sx={{ width: '12px', height: '12px', mr: '5px' }} />}
                children={t('Today')}
                sx={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: theme.colors.primary.dark,
                  borderRadius: '6px',
                }}
              />
              <CheckedCustom
                color="primary"
                checked={checked}
                variant='outlined'
                label={''}
                onClick={() => {
                  if (checked) return;

                  setChecked(true);
                  callback();
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  m: 0,
                  ...checked && { pointerEvents: 'none' },
                  '.MuiCheckbox-root': {
                    p: 0,
                  },
                }}
              />
            </>
          )
      }
    </Box>
  );
}

export default EventItem;
