import { FC } from "react";
import { Pagination } from '@mui/material';
import { SxProps } from "@mui/system";

export interface PaginationCustomProps {
  count?: number;
  variant?: "text" | "outlined" | undefined;
  shape?: "circular" | "rounded" | undefined;
  color?: "primary" | "secondary" | "standard" | undefined
  defaultPage?: number;
  page?: number;
  onChange?: (newPage: number) => void;
  sx?: SxProps;
}

const PaginationCustom: FC<PaginationCustomProps> = (props) => {
  const {count, variant, shape, color, defaultPage, page, onChange, sx } = props;
  
  return (
    <Pagination
      count={count}
      variant={variant}
      shape={shape}
      color={color}
      defaultPage={defaultPage}
      page={page}
      onChange={(_event: any, newPage: number ) => {
        if (onChange) onChange(newPage);
      }}
      showFirstButton
      showLastButton
      siblingCount={0}
      boundaryCount={2}
      sx={sx}
    />
  );
}

export { PaginationCustom };
