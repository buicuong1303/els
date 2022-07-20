/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ButtonCustom,
  LoadingData,
} from '@els/client/app/shared/ui';
import {
  InputCustom,
  FormikTextField
} from '@els/client/shared/ui';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FastField, Form, Formik } from 'formik';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { PasswordInfoType } from '..';
import { DialogConfirmValueType } from '../../setting';
import { SettingPasswordForm } from '@els/client/app/setting/ui';
import { useMutation } from '@apollo/client';
import { GuardianMutations } from '@els/client/guardian/data-access';
import { ApolloClient } from '@els/client/shared/data-access';

const PasswordWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
  `
);

export interface PasswordProps {
  updatePassword: (passwordInfo: PasswordInfoType) => void;
  updatePasswordLoading: boolean;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  isLoginWithPassword: boolean;
  sx?: SxProps;
  error: string;
}

export const Password: FC<PasswordProps> = (props) => {
  const {
    updatePassword,
    updatePasswordLoading,
    handleOpenDialogConfirm,
    isLoginWithPassword,
    sx
  } = props;
  const [CheckCurrentPassword, {loading: checkCurrentPasswordLoading}] = useMutation<{
    account: {
      checkCurrentPassword: string;
    };
  }>(GuardianMutations.CheckCurrentPassword, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      handleOpenDialogConfirm({
        title: t('Will update your password'),
        message: t('Do you want to continue?'),
        callback: handleUpdate,
      });
    },
    onError: (error) => {
      setError.current('currentPassword', t('Current password is incorrect.'));
    },
  });

  const { t }: { t: any } = useTranslation();

  // * page ref
  const formikManagement = useRef<any>();
  const setError = useRef<any>();

  // * page state
  // const [canUpdate, setCanUpdate] = useState<boolean>(false);

  const initialValues: PasswordInfoType = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [passwordData, setPasswordData] =
    useState<PasswordInfoType>(initialValues);

  //* validate form
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().trim().required(t('Is required.')),
    newPassword: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
        t(
          'The password must be at least 8 characters, one uppercase, one number and one special case character.'
        )
      )
      .required(t('Is required.')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), undefined], t('The passwords must match'))
      .required(t('Is required.')),
  });

  //* handle logic
  const handleUpdate = () => {
    updatePassword({
      currentPassword: formikManagement.current.values.currentPassword,
      newPassword: formikManagement.current.values.newPassword,
      confirmPassword: formikManagement.current.values.confirmPassword,
    });

    setPasswordData(initialValues);
    formikManagement.current.handleReset();
  };

  // const handleSubmit = async () => {
  //   formikManagement.current.setSubmitting(true);
  //   setError.current = formikManagement.current.setFieldError;
  //   await formikManagement.current.validateForm();
  //   if (formikManagement.current.isValid) {
  //     handleOpenDialogConfirm({
  //       title: t('Will update your password'),
  //       message: t('Do you want to continue?'),
  //       callback: handleUpdate,
  //     });
  //   }
  // };
  // useEffect(() => {
  //   if (error) {
  //     setError?.current('currentPassword', 'CurrentPassword is incorrect');
  //   }
  // }, [error]);
  // * render ui
  return (
    <PasswordWrapper maxWidth="950px" sx={sx}>
      <Box>
        {!isLoginWithPassword && (
          <SettingPasswordForm
            handleOpenDialogConfirm={handleOpenDialogConfirm}
            updatePasswordLoading={updatePasswordLoading}
          />
        )}
        {isLoginWithPassword && (
          <Formik
            enableReinitialize
            initialValues={passwordData}
            onSubmit={(values, actions) => {
              setError.current = actions.setFieldError;
              CheckCurrentPassword({
                variables: {
                  checkCurrentPasswordInput: {
                    currentPassword: values['currentPassword'],
                  },
                },
              });
            }}
            // onReset={() => setCanUpdate(false)}
            validationSchema={validationSchema}
          >
            {(formik) => {
              formikManagement.current = formik;
              const { handleReset } = formik;

              return (
                <Form>
                  {/* info */}
                  <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row-reverse' }}
                  >
                    <Box
                      display="flex"
                      justifyContent="end"
                      sx={{
                        width: '100%',
                      }}
                    >
                      <Grid
                        container
                        rowSpacing={{ xs: 6, md: 5 }}
                        columnSpacing={1}
                        alignItems="start"
                      >
                        {/* current password */}
                        <Grid item xs={12}>
                          <FastField
                            InputLabelProps={{ shrink: true }}
                            component={FormikTextField}
                            inputComponent={InputCustom}
                            inputProps={{
                              type: 'password',
                            }}
                            label={`* ${t('Current Password')}`}
                            name="currentPassword"
                            fullWidth
                            // onKeyUp={() => setCanUpdate(true)}
                          />
                        </Grid>

                        {/* new password */}
                        <Grid item xs={12} sm={6}>
                          <FastField
                            InputLabelProps={{ shrink: true }}
                            component={FormikTextField}
                            inputComponent={InputCustom}
                            inputProps={{
                              type: 'password',
                            }}
                            label={`* ${t('New Password')}`}
                            name="newPassword"
                            fullWidth
                            // onKeyUp={() => setCanUpdate(true)}
                          />
                        </Grid>

                        {/* confirm password */}
                        <Grid item xs={12} sm={6}>
                          <FastField
                            InputLabelProps={{ shrink: true }}
                            component={FormikTextField}
                            inputComponent={InputCustom}
                            inputProps={{
                              type: 'password',
                            }}
                            label={`* ${t('Confirm Password')}`}
                            name="confirmPassword"
                            fullWidth
                            // onKeyUp={() => setCanUpdate(true)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* action */}
                  <Box display="flex" justifyContent="end" mt={4}>
                    <ButtonCustom
                      variant="outlined"
                      color="secondary"
                      children={t('Cancel')}
                      onClick={() => {
                        handleReset();
                      }}
                      sx={{
                        px: '30px',
                        py: '10px',
                        fontSize: '15px',
                        fontWeight: 700,
                        lineHeight: '18px',
                      }}
                    />

                    <ButtonCustom
                      type="submit"
                      startIcon={checkCurrentPasswordLoading ? <LoadingData /> : null}
                      variant="contained"
                      color="primary"
                      children={t('Update')}
                      sx={{
                        ml: 2.5,
                        px: '30px',
                        py: '10px',
                        fontSize: '15px',
                        fontWeight: 700,
                        lineHeight: '18px',
                      }}
                    />
                  </Box>
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>
    </PasswordWrapper>
  );
};

export default Password;
