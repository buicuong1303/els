/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { Box, Stack, TextField } from '@mui/material';
import { getNodeId, isUiNodeInputAttributes } from '@ory/integrations/ui';
import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
  UiNode
} from '@ory/client';
import { Component, Dispatch, FormEvent, SetStateAction } from 'react';
import * as Yup from 'yup';
import { Node } from './node';
import { errorFields } from './node-input-default';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { DialogConfirmValueType } from '@els/client/app/setting/feature';
export type Values = Partial<
| SubmitSelfServiceLoginFlowBody
| SubmitSelfServiceRegistrationFlowBody
| SubmitSelfServiceRecoveryFlowBody
| SubmitSelfServiceSettingsFlowBody
| SubmitSelfServiceVerificationFlowBody
>;

export type Methods =
  | 'oidc'
  | 'password'
  | 'profile'
  | 'totp'
  | 'webauthn'
  | 'link'
  | 'lookup_secret';

export type Props<T> = {
  // The flow
  flow?:
  | SelfServiceLoginFlow
  | SelfServiceRegistrationFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow
  | SelfServiceSettingsFlow;
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods;
  // Is triggered on submission
  onSubmit: (values: T) => Promise<void>;
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean;
  buttonSaveRef: any;
  buttonCancelRef?: any;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  t: any;
  setCanUpdate: Dispatch<SetStateAction<boolean>>;
};

function emptyState<T>() {
  return {} as T;
}

type State<T> = {
  values: T;
  isLoading: boolean;
  confirmPassword: string;
  errors: any;
  showConfirmPassword: boolean,
};


export default class SettingPasswordFlow<T extends Values> extends Component<Props<T>, State<T>> {
  private validationSchema = Yup.object({
    password: Yup.string().required('The password field is required.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
        'The password must be at least 8 characters, one uppercase, one number and one special case character'
      ),
    confirmPassword: Yup.string()
      .required('The confirmPassword field is required.')
      .oneOf([Yup.ref('password')], 'The confirmPassword must match.'),
  });

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      showConfirmPassword: false,
      values: emptyState(),
      isLoading: false,
      confirmPassword: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes());
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.flow !== this.props.flow) {
      // Flow has changed, reload the values!
      this.initializeValues(this.filterNodes());
    }
  }

  initializeValues = (nodes: Array<UiNode> = []) => {
    // Compute the values
    const values = emptyState<T>();
    nodes.forEach((node) => {
      // This only makes sense for text nodes
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === 'button' ||
          node.attributes.type === 'submit'
        ) {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return;
        }
        values[node.attributes.name as keyof Values] = node.attributes.value;
      }
    });

    // Set all the values!
    this.setState((state) => ({ ...state, values }));
  };

  filterNodes = (): Array<UiNode> => {
    const { flow, only } = this.props;
    if (!flow) {
      return [];
    }
    return flow.ui?.nodes.filter(({ group }) => {
      if (group === 'oidc' && flow.request_url?.includes('registration'))
        return false;
      if (!only) {
        return true;
      }
      return group === 'default' || group === only;
    });
  };

  updateState() {
    this.setState((state) => ({
      ...state,
      isLoading: false,
      confirmPassword: '',
      errors: {}
    }));
  }

  handleSubmit = async (e: MouseEvent | FormEvent) => {
    // Prevent all native handlers
    e.stopPropagation();
    e.preventDefault();

    // Prevent double submission!
    if (this.state.isLoading) {
      return Promise.resolve();
    }

    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));

    return this.props.onSubmit(this.state.values).finally(() => {
      // We wait for reconciliation and update the state after 50ms
      // Done submitting - update loading status
      this.updateState();
    });
  };

  handleValidate = async (e: any) => {
    try {
      await this.validationSchema.validate(
        { ...this.state.values, confirmPassword: this.state.confirmPassword },
        {
          abortEarly: false,
        }
      );

      this.props.handleOpenDialogConfirm({
        title: this.props.t('Will update your password'),
        message: this.props.t('Do you want to continue?'),
        callback: () => {
          this.handleSubmit(e);
        },
      });
    } catch (error) {
      const err: any = error;
      this.setState((state) => ({
        ...state,
        errors: {
          confirmPassword: err?.errors.find((errors: any) =>
            errors.includes('confirmPassword')
          ),
          password: err?.errors.find((errors: any) => errors.includes('password')),
        },
      }));
    }
  };

  render() {
    const { flow, t, buttonSaveRef, buttonCancelRef, setCanUpdate } = this.props;
    const { values, isLoading, showConfirmPassword } = this.state;

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes();

    if (!flow) {
      // No flow was set yet? It's probably still loading...
      //
      // Nodes have only one element? It is probably just the CSRF Token
      // and the filter did not match any elements!
      return null;
    }

    return (
      <form
        action={flow.ui?.action}
        method={flow.ui?.method}
        onReset={() => {
          this.initializeValues(this.filterNodes());

          this.updateState();

          setCanUpdate(false);
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{
            mb: 4,
            '.MuiFormControl-root': {
              mb: '0px !important',
              ml: 0,
              pr: 0.5,
            },
          }}
        >
          {nodes?.filter((node: any) => node.attributes['type'] !== 'submit').map((node: any, k) => {
            const id = getNodeId(node) as keyof Values;
            return (
              <Node
                key={`${id}-${k}`}
                disabled={isLoading}
                node={node}
                value={values[id]}
                size="small"
                type="password"
                dispatchSubmit={this.handleValidate}
                errors={this.state.errors}
                setValue={(value: unknown) =>
                  new Promise((resolve) => {
                    const newErrors = {...this.state.errors};
                    delete newErrors[node.attributes.name];

                    this.setState(
                      (state) => ({
                        ...state,
                        values: {
                          ...state.values,
                          [getNodeId(node)]: value,
                        },
                        errors: newErrors,
                      }),
                      () => resolve()
                    );

                    setCanUpdate(true);
                  })
                }
                sx={{
                  '.MuiOutlinedInput-root': {
                    height: '40px',
                    mb: '0px !important',
                    input: {
                      height: '40px',
                    }
                  }
                }}
              />
            );
          })}

          <TextField
            size="small"
            type={ showConfirmPassword
              ? 'text'
              : 'password'
            }
            InputProps={{
              endAdornment:
                   this.state.showConfirmPassword
                     ? <VisibilityOffIcon onClick={() => this.setState((state) => ({ ...state, showConfirmPassword: false}))} sx={{ cursor: 'pointer' }} />
                     : <VisibilityIcon onClick={() => this.setState((state) => ({ ...state, showConfirmPassword: true}))} sx={{ cursor: 'pointer' }} />

            }}
            fullWidth
            variant='outlined'
            label={'* ' + t('Confirm password')}
            value={this.state.confirmPassword}
            onChange={(e) => {
              const newErrors = {...this.state.errors};
              delete newErrors['confirmPassword'];

              this.setState((state) => ({
                ...state,
                confirmPassword: e.target.value,
                errors: newErrors,
              }));

              setCanUpdate(true);
            }}
            error={this.state.errors?.confirmPassword ? true : false}
            helperText={t(errorFields[this.state.errors?.confirmPassword])}
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                this.handleValidate(e);
              }
            }}
            sx={{
              pl: '4px !important',
              pr: '0 !important',
              '.MuiOutlinedInput-root': {
                height: '40px',
                mb: '0px',
                input: {
                  height: '40px',
                }
              }
            }}
          />
        </Stack>

        <Box width="100%" display="flex" justifyContent="end">
          <button ref={buttonCancelRef} children='cancel' type="reset" style={{ display: 'none' }} />

          <Box width="fit-content">
            {nodes?.filter(((node: any) => node.attributes['type'] === 'submit')).map((node, k) => {
              const id = getNodeId(node) as keyof Values;
              return (
                <Node
                  nodeRef={buttonSaveRef}
                  key={`${id}-${k}`}
                  disabled={isLoading}
                  node={node}
                  value={values[id]}
                  size="small"
                  variant='contained'
                  dispatchSubmit={this.handleValidate}
                  setValue={(value: unknown) =>
                    new Promise((resolve) => {
                      this.setState(
                        (state) => ({
                          ...state,
                          values: {
                            ...state.values,
                            [getNodeId(node)]: value,
                          },
                        }),
                        () => resolve()
                      );
                    })
                  }
                  sx={{
                    px: '30px',
                    py: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: '18px',
                    display: 'none',
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </form>
    );
  }
}
