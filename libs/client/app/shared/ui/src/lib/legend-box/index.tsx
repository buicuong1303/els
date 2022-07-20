/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable-next-line */
import { Typography, Box, Button } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FC } from 'react';

export interface LegendBoxProps {
  backgroundColor?: string;
  width?: string;
  sx?: SxProps;
  dotColor?: string;
  label?: string;
  value?: string | number;
  buttonText?: string;
  buttonMinWidth?: string;
  callback?: () => void;
}

const GoalsBox = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    padding: ${theme.spacing(1, 2)};
    box-shadow: rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0.326rem 3rem;
`
);

const DotLegend = styled('span')(
  ({ theme }) => `
  border-radius: 22px;
  width: ${theme.spacing(1.5)};
  height: ${theme.spacing(1.5)};
  display: inline-block;
  margin-right: ${theme.spacing(0.5)};
`
);

const TypographyPrimary = styled(Typography)(
  () => `
    color: #fff;
  `
);

const LegendBox: FC<LegendBoxProps> = (props) => {
  const theme = useTheme();
  
  const { backgroundColor, width, sx, dotColor, label, value, buttonText, callback, buttonMinWidth = theme.spacing(10) } = props;

  return (
    <GoalsBox sx={{ ...sx, background: backgroundColor, width: width ? width : '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
        }}
      >
        <DotLegend style={{ background: dotColor, marginTop: '6px', marginRight: '8px', }} />
        <Box>
          <TypographyPrimary
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: 'flex', alignItems: 'left' }}
          >
            {label}
          </TypographyPrimary>
          <TypographyPrimary
            variant="h2"
            fontWeight="bold"
            sx={{ display: 'flex', alignItems: 'left' }}
          >
            {value}
          </TypographyPrimary>
        </Box>
      </Box>
      <Box>
        <Button
          variant="outlined"
          color="info"
          sx={{
            minWidth: buttonMinWidth,
            backgroundColor: '#ffffff',
            color: theme.colors.info.main,
            '&:hover': {
              backgroundColor: '#ffffff',
              color: theme.colors.info.main,
            }
          }}
          onClick={callback}
        >
          {buttonText}
        </Button>
      </Box>
    </GoalsBox>
  );
}

export { LegendBox };
