import { FC } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { Box, SxProps } from '@mui/system';
import { ButtonCustom } from '../button-custom';

export interface BreadcrumbsItem {
  title?: string | null;
  color?: string;
  link?: string;
  onClick?: () => void;
}

export interface BreadcrumbsCustomProps {
  title?: string;
  breadcrumbsList: BreadcrumbsItem[];
  separator?: JSX.Element | string;
  sx?: SxProps;
  icon?: JSX.Element;
}

const BreadcrumbsCustom: FC<BreadcrumbsCustomProps> = (props) => {
  const { title, breadcrumbsList = [], separator, sx, icon} = props;

  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: '28px', ...sx }}>
      {
        icon &&
        <ButtonCustom
          startIcon={icon}
          sx={{
            minWidth: 'unset',
            p: theme.spacing(1.5),
            bgcolor: '#ffffff',
            boxShadow: theme.colors.shadows.card,
            mr: theme.spacing(2),
            cursor: 'default',
            pointerEvents: 'none',
          }}
        />
      }
      <Box>
        {/* title */}
        {title && (
          <Typography
            variant="h4"
            fontWeight="700"
            children={title}
            sx={{
              minHeight: '26px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: theme.palette.text.primary,
            }}
          />
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs separator={separator ? separator : <Typography variant="h4" children={'/'} sx={{ fontSize: '14px', color: theme.palette.text.primary }} /> } aria-label="breadcrumb">
          {breadcrumbsList.map((item, index) => {
            if (item.link || item.onClick) {
              return (
                <Link key={index} href={item.link} onClick={item.onClick} underline="hover">
                  <Typography
                    key={index}
                    variant="h4"
                    fontWeight="400"
                    children={item.title}
                    sx={{
                      minHeight: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '14px',
                      color: item.color || theme.palette.text.primary,
                      cursor: 'pointer',
                      '&:hover': {
                        color: theme.colors.primary.main,
                      }
                    }}
                  />
                </Link>
              );
            } else {
              return (
                <Typography
                  key={index}
                  variant="h4"
                  fontWeight="400"
                  children={item.title}
                  sx={{
                    minHeight: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: item.color || theme.palette.text.primary,
                  }}
                />
              );
            }
          })}
        </Breadcrumbs>
      </Box>
    </Box>
  );
};

export { BreadcrumbsCustom };
