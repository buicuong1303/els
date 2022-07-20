/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, Ref, useState, ChangeEvent, useEffect } from 'react';
import type { ReactElement } from 'react';

import {
  Avatar,
  Link,
  Box,
  Button,
  Divider,
  InputAdornment,
  lighten,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Theme,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Hidden,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import { useTranslation } from 'react-i18next';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-container {
      height: auto;
    }
    
    .MuiDialog-paperScrollPaper {
      max-height: calc(100vh - 64px)
    }
  `
);

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};

    .MuiInputBase-input {
      font-size: ${theme.typography.pxToRem(17)};
    }
  `
);

const SearchInputWrapperButton = styled(Button)(
  ({ theme }) => `
    font-weight: normal;
    background: ${theme.colors.alpha.white[10]};
    border:  ${alpha(theme.colors.alpha.white[30], 0.2)} solid 1px;
    margin-left: ${theme.spacing(3)};
    border-radius: ${theme.general.borderRadiusLg};
    height: ${theme.spacing(6)};

    &:hover {
      background: ${alpha(theme.colors.alpha.white[30], 0.15)};
      border: ${theme.colors.alpha.white[30]} solid 1px;
    }
  `
);

const BtnControl = styled(Box)(
  ({ theme }) => `
    font-weight: bold;
    text-transform: uppercase;
    font-size: 11px !important;
    background: ${alpha(theme.colors.alpha.white[100], 0.8)};
    color: ${theme.colors.alpha.black[100]};
    border-radius: ${theme.general.borderRadius};
    padding: 0 6px;
    margin-left: ${theme.spacing(2)};
  `
);

const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
  `
);

function HeaderSearch() {
  const { t }: { t: any } = useTranslation();

  const [openSearchResults, setOpenSearchResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);

    if (event.target.value) {
      if (!openSearchResults) {
        setOpenSearchResults(true);
      }
    } else {
      setOpenSearchResults(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    document.onkeydown = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 's') handleClickOpen();
    };

    return () => {
      document.onkeydown = null;
    };
  }, []);

  return (
    <>
      <SearchInputWrapperButton
        variant="contained"
        disableElevation
        onClick={handleClickOpen}
        startIcon={<SearchTwoToneIcon />}
        endIcon={
          <BtnControl>Shift+S</BtnControl>
        }
      >
        {t('Search...')}
      </SearchInputWrapperButton>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitleWrapper>
          <SearchInputWrapper
            value={searchValue}
            autoFocus={true}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            placeholder={t('Enter the word you want to find') + '...'}
            fullWidth
            label={t('Search')}
          />
        </DialogTitleWrapper>
        <Divider />

        {openSearchResults && (
          <DialogContent>
            <Box
              sx={{ pt: 0, pb: 1 }}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="body2" component="span">
                {t('Search results for')}{' '}
                <Typography
                  sx={{ fontWeight: 'bold' }}
                  variant="body1"
                  component="span"
                >
                  {searchValue}
                </Typography>
              </Typography>
              <Link href="#" variant="body2" underline="hover">
                {t('Advanced search')}
              </Link>
            </Box>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Dashboard for Healthcare Platform')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    {t(
                      'This page contains all the necessary information for managing all hospital staff.'
                    )}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Example Projects Application')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    {t(
                      'This is yet another search result pointing to a app page.'
                    )}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItem button>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link href="#" underline="hover" sx={{ fontWeight: 'bold' }} variant="body2">
                      {t('Search Results Page')}
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    {t(
                      'Choose if you would like to show or not this typography section here...'
                    )}
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItem>
            </List>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button color="primary">{t('View all search results')}</Button>
            </Box>
          </DialogContent>
        )}
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;
