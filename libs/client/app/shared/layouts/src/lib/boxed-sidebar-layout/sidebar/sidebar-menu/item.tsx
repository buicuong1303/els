import { FC, ReactNode, useState, useContext } from 'react';
import clsx from 'clsx';
import { SidebarContext } from '@els/client/app/shared/contexts';
import NextLink from 'next/link';

import PropTypes from 'prop-types';
import { Button, Badge, Collapse, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

interface SidebarMenuItemProps {
  children?: ReactNode;
  link?: string;
  icon?: any;
  badge?: string;
  open?: boolean;
  active?: boolean;
  name: string;
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  children,
  link,
  icon: Icon,
  badge,
  open: openParent,
  active,
  name,
  ...rest
}) => {
  const [menuToggle, setMenuToggle] = useState<boolean | undefined>(openParent);
  const { t }: { t: any } = useTranslation();
  const { toggleSidebar } = useContext(SidebarContext);

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
          {badge && <Badge badgeContent={badge} />}
          {t(name)}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <NextLink href={link} passHref>
        <Button
          className={clsx({ 'Mui-active': active })}
          onClick={toggleSidebar}
          href={link}
          startIcon={Icon && <Icon />}
          sx={{ textTransform: 'capitalize' }}
        >
          {t(name)}
          {badge && <Badge badgeContent={badge} />}
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
  open: PropTypes.bool,
  name: PropTypes.string.isRequired
};

SidebarMenuItem.defaultProps = {
  open: false,
  active: false,
};

export default SidebarMenuItem;
