/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useContext, useEffect, useRef, useState } from 'react';

import { SxProps } from '@mui/system';
import { Box, Typography, useTheme, Tooltip, Popover } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import { useTranslation } from 'react-i18next';

import { useAudio } from '@els/client-shared-hooks';

import { GraphqlTypes } from '@els/client/app/shared/data-access';

import {
  BrainIcon,
  ButtonCustom,
  CheckedCustom,
  LabelCustom,
  StartRatingIcon,
} from '@els/client/app/shared/ui';
import { HandleIgnoreWordType } from '..';
import { ToastifyContext } from '@els/client/app/shared/contexts';

export interface ViewWordItemProps {
  no: number;
  vocabulary: GraphqlTypes.LearningTypes.Vocabulary;
  memoryStatus?: GraphqlTypes.LearningTypes.MemoryStatus;
  wordsChecked: { [key: string]: boolean };
  handleIgnoreWord: (data: HandleIgnoreWordType) => void;
  wordsRating: { [key: string]: boolean };
  handleChangeWordRating: (event: any, key: string) => void;
  handleCheckMark: () => boolean;
  sx?: SxProps;
}

const ViewWordItem = (props: ViewWordItemProps) => {
  const {
    no,
    vocabulary,
    memoryStatus,
    wordsChecked,
    handleIgnoreWord,
    wordsRating,
    handleChangeWordRating,
    handleCheckMark,
    sx,
  } = props;

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const theme = useTheme();

  const isNew = (memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.New) || (memoryStatus === undefined);
  const isMemorized = memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Memorized;
  const isVague = memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Vague;
  const isForgot = memoryStatus === GraphqlTypes.LearningTypes.MemoryStatus.Forgot;

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const [showVolumeIcon, setShowVolumeIcon] = useState(false);
  
  // TODO turn on when dictionary success
  const { playing, playAgain } = useAudio({ url: vocabulary.audio || '', errorCallback: () => setShowVolumeIcon(false)});

  useEffect(() => {
    setShowVolumeIcon(playing);
  }, [playing]);

  return (
    <Box
      key={vocabulary.id}
      sx={{
        transition: 'background-color 300ms',
        '&:hover': {
          backgroundColor: theme.colors.alpha.black[10],
        },
        position: 'relative',
        p: theme.spacing(1, 2),
        display: 'flex',
        alignItems: 'center',
        borderTop: no > 0 ? `1px solid ${theme.colors.alpha.black[10]}` : '',
        width: '100%',
      }}
    >
      {/* vocabulary content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          alignItems: {
            xs: 'start',
            sm: 'center',
          },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: {
              xs: 'start',
              sm: 'center',
            },
            mr: theme.spacing(2),
            pt: {
              xs: theme.spacing(1),
              sm: theme.spacing(0),
            },
          }}
        >
          <Box sx={{ minWidth: '200px' }}>
            <Tooltip arrow placement="top" title={t(vocabulary.phonetic)}>
              <Box sx={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
                <LabelCustom
                  {...isNew && { color: 'default' }}
                  {...isMemorized && { color: 'success' }}
                  {...isVague && { color: 'warning' }}
                  {...isForgot && { color: 'error' }}
                  children={vocabulary.vocabulary}
                  onClick={playAgain}
                  sx={{
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '22px',
                    p: '14px 16px',
                    my: '4px',
                    cursor: 'pointer',
                    ...(!memoryStatus || isNew) && { backgroundColor: `${theme.colors.secondary.light} !important` },
                    ...isNew && { color: '#ffffff !important' },
                    ...isMemorized && { color: theme.colors.success.dark },
                    ...isVague && { color: theme.colors.warning.dark },
                    ...isForgot && { color: theme.colors.error.dark },
                  }}
                />
                { showVolumeIcon && (
                  <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center', color: theme.colors.primary.main }}>
                    <VolumeUpIcon />
                  </Box>
                )}
              </Box>
            </Tooltip>
          </Box>
          <Typography
            children={vocabulary.translation}
            sx={{
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
              my: '4px',
              ml: theme.spacing(2),
            }}
          />
        </Box>
      </Box>

      {/* action */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          minWidth: '60px',
        }}
      >
        <Box>
          <Tooltip
            key={isMemorized ? Math.random() : vocabulary.id}
            arrow
            placement="left"
            title={
              isMemorized
                ? wordsChecked[vocabulary.id]
                  ? t('Unmark ignore')
                  : t('Mark as ignore')
                : t('Click for mark')
            }
            sx={{}}
          >
            <Box ref={ref} sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckedCustom
                key={`checked-${wordsChecked[vocabulary.id]}`}
                color={wordsChecked[vocabulary.id] ? 'warning' : 'primary'}
                variant="outlined"
                label=""
                checked={wordsChecked[vocabulary.id]}
                name="brain"
                onClick={handleOpen}
                onChange={(e) => {
                  if (isMemorized && handleCheckMark())
                    handleIgnoreWord({ markStatus: e.target.checked, key: vocabulary.id, ignoreType: GraphqlTypes.LearningTypes.UnTrackingMode.System, checked: e.target.checked});
                }}
                sx={{
                  mr: theme.spacing(1),
                  '.MuiCheckbox-root': {
                    p: 1,
                  },
                }}
                checkedIcon={
                  <BrainIcon
                    color={
                      wordsChecked[vocabulary.id]
                        ? theme.colors.warning.main
                        : theme.colors.secondary.dark
                    }
                    bgcolor={theme.colors.alpha.white[100]}
                  />
                }
                icon={
                  <BrainIcon
                    color={
                      wordsChecked[vocabulary.id]
                        ? theme.colors.warning.main
                        : theme.colors.secondary.dark
                    }
                    bgcolor={theme.colors.alpha.white[100]}
                  />
                }
              />
            </Box>
          </Tooltip>
          {memoryStatus !== GraphqlTypes.LearningTypes.MemoryStatus.Memorized && (
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
              sx={{
                '.MuiPaper-root': {
                  overflow: 'unset',
                },
                '.MuiPaper-root:after': {
                  content: '""',
                  position: 'absolute',
                  top: '100%',
                  left: '100%',
                  borderWidth: '12px',
                  borderStyle: 'solid',
                  borderColor: 'transparent transparent transparent #9fa2bf52',
                  transform: 'rotateZ(45deg) rotateX(55deg) translate(-10px, 0px)',
                },
                '.MuiPaper-root:before': {
                  zIndex: 1,
                  content: '""',
                  position: 'absolute',
                  top: '100%',
                  left: '100%',
                  borderWidth: '12px',
                  borderStyle: 'solid',
                  borderColor: 'transparent transparent transparent #ffffff',
                  transform: 'rotateZ(45deg) rotateX(55deg) translate(-12px, 0px)',
                }
              }}
            >
              <Box display="flex" sx={{ p: 1 }}>
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    wordsChecked[vocabulary.id]
                      ? t('Unmark ignore')
                      : t('Mark as ignore')
                  }
                  sx={{ opacity: 0 }}
                >
                  <Box sx={{ mx: 0.5 }}>
                    <ButtonCustom
                      variant="outlined"
                      color="warning"
                      startIcon={<AddTaskIcon />}
                      sx={{ minWidth: 'unset', p: 1 }}
                      onClick={() => {
                        handleIgnoreWord({
                          markStatus: true,
                          key: vocabulary.id,
                          ignoreType: GraphqlTypes.LearningTypes.UnTrackingMode.System,
                          isNewVocabulary: isNew,
                        });
                        handleClose();
                      }}
                    />
                  </Box>
                </Tooltip>
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    wordsChecked[vocabulary.id]
                      ? t('Unmark remembered')
                      : t('Mark as remembered')
                  }
                >
                  <Box sx={{ mx: 0.5 }}>
                    <ButtonCustom
                      variant="outlined"
                      color="success"
                      startIcon={<TaskAltIcon />}
                      sx={{ minWidth: 'unset', p: 1 }}
                      onClick={() => {
                        handleIgnoreWord({
                          markStatus: true,
                          key: vocabulary.id,
                          ignoreType: GraphqlTypes.LearningTypes.UnTrackingMode.Topic,
                          isNewVocabulary: isNew,
                        });
                        handleClose();
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>
            </Popover>
          )}
        </Box>
        <Tooltip
          key={Math.random()}
          arrow
          placement="top-end"
          title={
            wordsRating[vocabulary.id]
              ? t('Remove from list')
              : t('Add to list')
          }
          sx={{}}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckedCustom
              key={`checked-${wordsRating[vocabulary.id]}`}
              color={wordsRating[vocabulary.id] ? 'warning' : 'primary'}
              variant="outlined"
              label=""
              checked={wordsRating[vocabulary.id]}
              name="start"
              onChange={(e) => handleChangeWordRating(e, vocabulary.id)}
              sx={{
                mr: theme.spacing(0),
                '.MuiCheckbox-root': {
                  p: 0.5,
                },
              }}
              checkedIcon={
                <StartRatingIcon
                  sx={{ width: '30px', height: '30px' }}
                  color={
                    wordsRating[vocabulary.id]
                      ? theme.colors.warning.main
                      : theme.colors.secondary.dark
                  }
                />
              }
              icon={
                <StartRatingIcon
                  sx={{ width: '30px', height: '30px' }}
                  color={
                    wordsRating[vocabulary.id]
                      ? theme.colors.warning.main
                      : theme.colors.secondary.dark
                  }
                />
              }
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export { ViewWordItem };
