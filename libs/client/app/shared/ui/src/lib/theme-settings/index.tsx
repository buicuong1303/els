/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useContext, useRef, useState, useEffect } from 'react';
import {
  Popover,
  Typography,
  Stack,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import { ThemeContext } from '@els/client-shared-theme';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { ThemeIcon } from '../svg-icon';

const ThemeSettingsButton = styled(Box)(
  ({ theme }) => `
    // position: fixed;
    // z-index: 9999;
    // right: ${theme.spacing(2)};
    // bottom: ${theme.spacing(2)};
  `
);

const ThemeToggleWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
  `
);

const ButtonWrapper = styled(Box)(
  ({ theme }) => `
    cursor: pointer;
    position: relative;
    border-radius: ${theme.general.borderRadiusXl};
    padding: ${theme.spacing(0.8)};
    display: flex;
    flex-direction: row;
    align-items: stretch;
    min-width: 80px;
    box-shadow: 0 0 0 2px ${theme.colors.primary.lighter};

    &:hover {
      box-shadow: 0 0 0 2px ${theme.colors.primary.light};
    }

    &.active {
      box-shadow: 0 0 0 2px ${theme.palette.primary.main};

      .colorSchemeWrapper {
        // opacity: .6;
      }
    }
  `
);

const ColorSchemeWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;

    border-radius: ${theme.general.borderRadiusXl};
    height: 28px;
    
    &.colorSchemeWrapper {
      display: flex;
      align-items: stretch;
      width: 100%;

      .primary {
        border-top-left-radius: ${theme.general.borderRadiusXl};
        border-bottom-left-radius: ${theme.general.borderRadiusXl};
      }

      .secondary {
        border-top-right-radius: ${theme.general.borderRadiusXl};
        border-bottom-right-radius: ${theme.general.borderRadiusXl};
      }

      .primary,
      .secondary,
      .alternate {
        flex: 1;
      }
    }

    &.default {
      .primary {
        background: #5569ff;
      }
  
      .secondary {
        background: #F6F8FB;
      }
    }

    &.pureLight {
      .primary {
        background: #5569ff;
      }
  
      .secondary {
        background: #f2f5f9;
      }
    }

    &.lightBloom {
      .primary {
        background: #1975FF;
      }
  
      .secondary {
        background: #000C57;
      }
    }

    &.greyGoose {
      .primary {
        background: #2442AF;
      }
  
      .secondary {
        background: #F8F8F8;
      }
    }
    
    &.purpleFlow {
      .primary {
        background: #9b52e1;
      }
  
      .secondary {
        background: #00b795;
      }
    }
    
    &.nebulaFighter {
      .primary {
        background: #8C7CF0;
      }
  
      .secondary {
        background: #070C27;
      }
    }

    &.greenFields {
      .primary {
        background: #44a574;
      }
  
      .secondary {
        background: #141c23;
      }
    }

    &.darkSpaces {
      .primary {
        background: #CB3C1D;
      }
  
      .secondary {
        background: #1C1C1C;
      }
    }
  `
);

const CheckSelected = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.success.main};
    border-radius: 50px;
    height: 26px;
    width: 26px;
    color: ${theme.palette.success.contrastText};
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -13px 0 0 -13px;
    z-index: 5;

    .MuiSvgIcon-root {
      height: 16px;
      width: 16px;
    }
  `
);

const ThemeSettings: FC = (_props) => {
  const { t }: { t: any } = useTranslation();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const setThemeName = useContext(ThemeContext);

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'PureLightTheme';
    setTheme(curThemeName);
  }, []);

  const [theme, setTheme] = useState('PureLightTheme');

  const changeTheme = (theme: string): void => {
    setTheme(theme);
    setThemeName(theme);
  };
  
  return (
    <ThemeSettingsButton>
      <Tooltip arrow title={t('Change theme')}>
        <Fab ref={ref} onClick={handleOpen} color="primary" aria-label="add" sx={{ width: '44px', height: '44px' }}>
          <ThemeIcon />
        </Fab>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <ThemeToggleWrapper>
            <Typography
              sx={{
                mt: 1,
                mb: 3,
                textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
              variant="body1"
              children={t('Light theme group')}
            />
            <Stack alignItems="center" spacing={2}>
              <Tooltip placement="left" title="Default" arrow>
                <ButtonWrapper
                  className={theme === 'DefaultTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('DefaultTheme');
                  }}
                >
                  {theme === 'DefaultTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper default">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Pure Light" arrow>
                <ButtonWrapper
                  className={theme === 'PureLightTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('PureLightTheme');
                  }}
                >
                  {theme === 'PureLightTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper pureLight">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Light Bloom" arrow>
                <ButtonWrapper
                  className={theme === 'LightBloomTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('LightBloomTheme');
                  }}
                >
                  {theme === 'LightBloomTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper lightBloom">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Grey Goose" arrow>
                <ButtonWrapper
                  className={theme === 'GreyGooseTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('GreyGooseTheme');
                  }}
                >
                  {theme === 'GreyGooseTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper greyGoose">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Purple Flow" arrow>
                <ButtonWrapper
                  className={theme === 'PurpleFlowTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('PurpleFlowTheme');
                  }}
                >
                  {theme === 'PurpleFlowTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper purpleFlow">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
            </Stack>
          </ThemeToggleWrapper>
          <ThemeToggleWrapper>
            <Typography
              sx={{
                mt: 1,
                mb: 3,
                textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
              variant="body1"
              children={t('Dark theme group')}
            />
            <Stack alignItems="center" spacing={2}>
              <Tooltip placement="left" title="Nebula Fighter" arrow>
                <ButtonWrapper
                  className={theme === 'NebulaFighterTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('NebulaFighterTheme');
                  }}
                >
                  {theme === 'NebulaFighterTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper nebulaFighter">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Green Fields" arrow>
                <ButtonWrapper
                  className={theme === 'GreenFieldsTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('GreenFieldsTheme');
                  }}
                >
                  {theme === 'GreenFieldsTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper greenFields">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
              <Tooltip placement="left" title="Dark Spaces" arrow>
                <ButtonWrapper
                  className={theme === 'DarkSpacesTheme' ? 'active' : ''}
                  onClick={() => {
                    changeTheme('DarkSpacesTheme');
                  }}
                >
                  {theme === 'DarkSpacesTheme' && (
                    <CheckSelected>
                      <CheckTwoToneIcon />
                    </CheckSelected>
                  )}
                  <ColorSchemeWrapper className="colorSchemeWrapper darkSpaces">
                    <Box className="primary" />
                    <Box className="secondary" />
                  </ColorSchemeWrapper>
                </ButtonWrapper>
              </Tooltip>
            </Stack>
          </ThemeToggleWrapper>
        </Stack>
      </Popover>
    </ThemeSettingsButton>
  );
};

export { ThemeSettings };
