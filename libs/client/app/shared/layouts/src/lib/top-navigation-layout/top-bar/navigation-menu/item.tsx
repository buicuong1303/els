/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useState, MouseEvent, useContext } from 'react';
import clsx from 'clsx';
import NextLink from 'next/link';

import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import {
  IconButton,
  Box,
  Badge,
  Popover,
  darken,
  ListItem,
  styled,
} from '@mui/material';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import { Scrollbar } from '@els/client/shared/components';
import { SidebarContext } from '@els/client/app/shared/contexts';

const IndicatorWrapper = styled(Box)(
  () => `
    width: 18px;
    height: 18px;

    .MuiSvgIcon-root {
      width: 100%;
      height: auto;
    }
  `
);

const PopoverWrapper = styled(Popover)(
  ({ theme }) => `
    .MuiList-root {
      min-width: 240px;
      padding: ${theme.spacing(2)} !important;

      .MuiListItem-root {
        padding: 2px 0 !important;

        &:last-child {
            margin-left: 0;
          }
        }

        .MuiIconButton-root {
          width: 100% !important;
          height: auto !important;
          justify-content: flex-start !important;
          font-weight: bold !important;
          padding: ${theme.spacing(1, 2)} !important;

          .MuiBadge-root {
            right: 20px !important;
            top: 20px !important;

            .MuiBadge-badge {
              background: ${theme.colors.primary.main} !important;
              color: ${theme.palette.getContrastText(theme.colors.primary.main)} !important;
            }
          }

          .name-wrapper {
            transition: ${theme.transitions.create(['all'])};

            color: ${darken(theme.sidebar.menuItemColor ?? '', 0.3)} !important;
          }

          &.Mui-active,
          &:hover {
            .name-wrapper {
              color: ${theme.palette.primary.main} !important;
            }
          }
        }
      }  
    }
  `
);

const MenuItemBadge = styled(Badge)(
  ({ theme }) => `
    .MuiBadge-badge {
      background-color: ${theme.colors.warning.light} !important;
      width: 8px;
      height: 8px;
      color: #ffffff !important;
      padding: 0;
    }
  `
);

interface NavigationMenuItemProps {
  children?: ReactNode;
  link?: string;
  icon?: any;
  badge?: string;
  open?: boolean;
  active?: boolean;
  name: string;
}

const NavigationMenuItem: FC<NavigationMenuItemProps> = ({
  children,
  link,
  icon: Icon,
  badge,
  open: openParent,
  active,
  name,
  ...rest
}) => {
  const { closeSidebar } = useContext(SidebarContext);
  const { t }: { t: any } = useTranslation();
  const [menuToggle] = useState<boolean>(openParent ?? false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <IconButton
          className={clsx({ 'Mui-active': menuToggle })}
          onClick={handleClick}
        >
          {Icon && <Icon />}
          <span className="name-wrapper">{t(name)}</span>
          <IndicatorWrapper>
            {open ? (
              <KeyboardArrowUpTwoToneIcon />
            ) : (
              <KeyboardArrowDownTwoToneIcon />
            )}
          </IndicatorWrapper>
          {badge === '' ? (
            <MenuItemBadge color="warning" variant="dot" />
          ) : (
            <MenuItemBadge badgeContent={badge} />
          )}
        </IconButton>
        <PopoverWrapper
          classes={{ root: 'child-popover' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          open={open}
        >
          <Box
            sx={{
              width: 260,
              height: 295
            }}
          >
            <Scrollbar>{children}</Scrollbar>
          </Box>
        </PopoverWrapper>
      </ListItem>
    );
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <NextLink href={link ?? ''} passHref>
        <IconButton
          component="a"
          className={clsx({ 'Mui-active': active })}
          href={link}
          onClick={closeSidebar}
        >
          {Icon && <Icon />}
          <span className="name-wrapper">{t(name)}</span>
          {badge === '' ? (
            <MenuItemBadge color="warning" variant="dot" />
          ) : (
            <MenuItemBadge badgeContent={badge} />
          )}
        </IconButton>
      </NextLink>
    </ListItem>
  );
};

NavigationMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired
};

NavigationMenuItem.defaultProps = {
  open: false,
  active: false
};

export default NavigationMenuItem;
