/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';
import { SxProps } from '@mui/system';

interface PageTitleProps {
  title: ReactNode;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit" | undefined;
  onClick?: () => void;
  sx?: SxProps;
}

const PageTitle:FC<PageTitleProps>  = (props) => {
  const { title, align, variant, onClick, sx } = props;

  return (
    <Typography
      textAlign={align}
      variant={variant}
      onClick={onClick}
      sx={sx}
    >
      {title}
    </Typography>
  );
}

export { PageTitle };