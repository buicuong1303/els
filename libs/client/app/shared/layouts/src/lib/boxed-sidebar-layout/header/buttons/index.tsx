import { Box, Hidden } from '@mui/material';
import LanguageSwitcher from './language-switcher';
import HeaderSearch from './search';
import HeaderNotifications from './notifications';

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1.5 }}>
      <HeaderSearch />
      <Box sx={{ mx: .5 }} component="span">
        <HeaderNotifications />
      </Box>
      <Hidden smDown>
        <LanguageSwitcher />
      </Hidden>
    </Box>
  );
}

export default HeaderButtons;
