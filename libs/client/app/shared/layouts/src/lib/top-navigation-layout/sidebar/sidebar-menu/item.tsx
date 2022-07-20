/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useState, useContext } from 'react';
import clsx from 'clsx';
import NextLink from 'next/link';

import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
  Badge,
  Collapse,
  ListItem,
  styled,
  TooltipProps,
  tooltipClasses
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { SidebarContext } from '@els/client/app/shared/contexts';

interface SidebarMenuItemProps {
  children?: ReactNode;
  link?: string;
  icon?: any;
  badge?: string;
  badgeTooltip?: string;
  open?: boolean;
  active?: boolean;
  name: string;
}

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.black[100],
    color: theme.palette.getContrastText(theme.colors.alpha.black[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.black[100]
  }
}));

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

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  children,
  link,
  icon: Icon,
  badge,
  badgeTooltip,
  open: openParent,
  active,
  name,
  ...rest
}) => {
  const [menuToggle, setMenuToggle] = useState<boolean>(openParent ?? false);
  const { t }: { t: any } = useTranslation();
  const { closeSidebar } = useContext(SidebarContext);

  const toggleMenu = (): void => {
    setMenuToggle((Open) => !Open);
  };

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <Button
          className={clsx({ 'Mui-active': menuToggle })}
          startIcon={Icon && <Icon />}
          endIcon={
            menuToggle ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />
          }
          onClick={toggleMenu}
        >
          {badgeTooltip ? (
            <TooltipWrapper title={badgeTooltip} arrow placement="right">
              {badge === '' ? (
                <MenuItemBadge color="primary" variant="dot" />
              ) : (
                <MenuItemBadge badgeContent={badge} />
              )}
            </TooltipWrapper>
          ) : badge === '' ? (
            <Badge color="primary" variant="dot" />
          ) : (
            <Badge badgeContent={badge} />
          )}
          {t(name)}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <NextLink href={link ?? '#'} passHref>
        <Button
          disableRipple
          component="a"
          className={clsx({ 'Mui-active': active })}
          onClick={closeSidebar}
          startIcon={Icon && <Icon />}
        >
          {t(name)}
          {badgeTooltip ? (
            <TooltipWrapper title={badgeTooltip} arrow placement="right">
              {badge === '' ? (
                <MenuItemBadge color="primary" variant="dot" />
              ) : (
                <MenuItemBadge badgeContent={badge} />
              )}
            </TooltipWrapper>
          ) : badge === '' ? (
            <MenuItemBadge color="primary" variant="dot" />
          ) : (
            <MenuItemBadge badgeContent={badge} />
          )}
        </Button>
      </NextLink>
    </ListItem>
  );
};

SidebarMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  badgeTooltip: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired
};

SidebarMenuItem.defaultProps = {
  open: false,
  active: false
};

export default SidebarMenuItem;
