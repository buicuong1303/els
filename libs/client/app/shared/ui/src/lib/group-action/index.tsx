import { ReactNode, FC, useRef, useState } from 'react';
import {
  Button,
  Menu,
  Tooltip,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SxProps } from '@mui/system';

interface Action {
  label?: string;
  icon?: ReactNode;
  callback?: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
}

interface GroupActionProps {
  options: Action[];
  sx?: SxProps;
  size?: "small" | "medium" | "large" | undefined;
  color?: "inherit" | "error" | "primary" | "secondary" | "success" | "info" | "warning" | undefined;
  variant?: "text" | "outlined" | "contained" | undefined;
  children?: ReactNode;
}

const GroupAction: FC<GroupActionProps> = (props) => {
  const { options, sx, size="medium", color="primary", variant="outlined", children } = props;

  const theme = useTheme();

  const actionRef = useRef(null);
  const [open, setOpenMenu] = useState<boolean>(false);

  return (
    <>
      <Tooltip key={Math.random()} arrow placement="top" title="Thêm lựa chọn">
        <Button
          size={size}
          color={color}
          variant={variant}
          ref={actionRef}
          onClick={() => setOpenMenu(true)}
          endIcon={<MoreVertIcon fontSize="small" />}
          sx={{
            '.MuiButton-endIcon': {
              margin: '0px', 
            },
            minWidth: 'unset',
            px: theme.spacing(1),
          }}
          children={children}
        />
      </Tooltip>
      <Menu
        anchorEl={actionRef.current}
        onClose={() => setOpenMenu(false)}
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          '.MuiMenu-paper': {
            boxShadow: 'unset',
          },
          '.MuiMenu-list': {
            display: 'flex',
            flexDirection: 'row',
            padding: theme.spacing(0),
            border: 'unset',
          },
        }}
      >
        {options.map((item, index) => (
          <Tooltip
            arrow
            placement="top-start"
            title={item.label || ''}
            key={`${item.label}-${index}`}
          >
            <Button
              startIcon={item.icon}
              onClick={item.callback}
              variant="outlined"
              color={item.color}
              size="medium"
              sx={{
                minWidth: 'unset',
                px: theme.spacing(1),
                mx: theme.spacing(0.5),
                mr: index === options.length - 1 ? 1 : 0.5,
              }}
            />
          </Tooltip>
        ))}
      </Menu>
    </>
  );
};

export { GroupAction };