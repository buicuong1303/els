/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import {
  Box,
  Button,
  createSvgIcon,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { getNodeId, getNodeLabel } from '@ory/integrations/ui';
import { isUiNodeInputAttributes } from '@ory/integrations/ui';
import { Node } from './Node';
import { object, string, number, ref } from 'yup';
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
  UiNode,
  UiNodeInputAttributes,
} from '@ory/client';
// import { Button } from '@ory/themes'
import { Component, FormEvent } from 'react';
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import { errorFields } from '.';
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
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow;
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods;
  // Is triggered on submission
  onSubmit: (values: T) => Promise<void>;
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean;
  t: any;
  toastify: any;
};

function emptyState<T>() {
  return {} as T;
}

type State<T> = {
  values: T;
  isLoading: boolean;
  confirmPassword: string | undefined;
  errors: any;
  isNormalRegister: boolean;
  inviterId: string | null;
};
// const TextFieldWrapper = styled(TextField)(
//   ({ theme }) => `
//     margin-bottom: ${theme.spacing(3.5)};
//     margin:${theme.spacing(2)} !important;
//   `
// );

class RegisterFlow<T extends Values> extends Component<Props<T>, State<T>> {
  // TODO error message need match key in errorFields export from NodeInputDefault.tsx
  private userSchema = object({
    'traits.firstName': string()
      .max(50, 'The firstName must be at most 50.')
      .required('The firstName field is required.'),
    'traits.lastName': string()
      .max(50, 'The lastName must be at most 50.')
      .required('The lastName field is required.'),
    'traits.username': string().max(50, 'The username must be at most 50.').notRequired(),
    'traits.middleName': string().max(50, 'The middleName must be at most 50.'),
    'traits.email': string()
      .max(100, 'The email must be at most 100.')
      .required('The email field is required.')
      .email('The email provided should be a valid email address.'),
    // username: string().max(255).required('The username field is required.'),
    password: string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
        'The password must be at least 8 characters, one uppercase, one number and one special case character.'
      )
      .required('Is required.'),
    confirmPassword: string()
      .required('The confirmPassword field is required.')
      .oneOf([ref('password'), undefined], 'The confirmPassword must match.'),
  });
  private userLoginWithGoogleSchema = object({
    'traits.firstName': string()
      .max(255)
      .required('The firstName field is required.'),
    'traits.lastName': string()
      .max(255)
      .required('The lastName field is required.'),
    'traits.username': string().max(255).max(255).notRequired(),

    // middleName: string().max(255),
    'traits.email': string()
      .email('The email provided should be a valid email address.')
      .max(255)
      .required('The email field is required.'),
    // username: string().max(255).required('The username field is required.'),
  });

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      values: emptyState(),
      isLoading: false,
      confirmPassword: undefined,
      errors: {},
      isNormalRegister: true,
      inviterId: '',
    };
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes());
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.flow !== this.props.flow) {
      // Flow has changed, reload the values!
      this.initializeValues(this.filterNodes());
      const isNormalRegister = this.props.flow?.ui.nodes.some(
        (node: any) => node.attributes.name === 'password'
      );
      !isNormalRegister &&
        this.setState({ isNormalRegister: false }, () =>
          console.log(this.state)
        );
    }
  }

  initializeValues = (nodes: Array<UiNode> = []) => {
    let inviterId = 'null';
    const dataUrl = new URLSearchParams(window.location.search).get(
      'inviter_id'
    );
    if (dataUrl) {
      inviterId = dataUrl;
    }
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
    this.setState((state) => ({
      ...state,
      values,
      inviterId: inviterId,
    }));
  };

  filterNodes = (): Array<any> => {
    const { flow, only } = this.props;
    if (!flow) {
      return [];
    }
    return flow.ui.nodes.filter((node: any) => {
      if (
        (node.group === 'oidc' && flow.request_url?.includes('registration')) ||
        node.attributes.name === 'traits.picture'
      ) {
        return false;
      }
      if (!only) {
        return true;
      }
      return node.group === 'default' || node.group === only;
    });
  };
  // Handles form submission
  handleSubmit = async (e: MouseEvent | FormEvent) => {
    // Prevent all native handlers
    e.stopPropagation();
    e.preventDefault();
    try {
      if (this.state.isNormalRegister)
        await this.userSchema.validate(
          { ...this.state.values, confirmPassword: this.state.confirmPassword },
          {
            abortEarly: false,
          }
        );
      else {
        await this.userLoginWithGoogleSchema.validate(
          { ...this.state.values, confirmPassword: this.state.confirmPassword },
          {
            abortEarly: false,
          }
        );
      }
      // Prevent double submission!
      if (this.state.isLoading) {
        return Promise.resolve();
      }

      this.setState((state) => ({
        ...state,
        isLoading: true,
      }));
      return this.props
        .onSubmit(this.state.values)
        .then((rs) => {
          this.props.flow?.ui.messages
            ?.filter((message) => message.type === 'error')
            .forEach((message) =>
              this.props.toastify({
                type: 'error',
                message: this.props.t(message.text),
              })
            );
        })
        .finally(() => {
          // We wait for reconciliation and update the state after 50ms
          // Done submitting - update loading status
          this.setState((state) => ({
            ...state,
            isLoading: false,
            errors: {},
            confirmPassword: '',
          }));
        });
    } catch (error) {
      const err: any = error;
      this.setState((state) => ({
        ...state,
        errors: {
          confirmPassword: err?.errors.find((e: any) =>
            e.includes('confirmPassword')
          ),
          password: err?.errors.find((e: any) => e.includes('password')),
          'traits.firstName': err?.errors.find((e: any) =>
            e.includes('firstName')
          ),
          'traits.middleName': err?.errors.find((e: any) =>
            e.includes('middleName')
          ),
          'traits.lastName': err?.errors.find((e: any) =>
            e.includes('lastName')
          ),
          'traits.username': err?.errors.find((e: any) =>
            e.includes('username')
          ),
          'traits.email': err?.errors.find((e: any) => e.includes('email')),
        },
      }));
    }
  };

  render() {
    const { hideGlobalMessages, flow, t, toastify } = this.props;
    const { values, isLoading } = this.state;
    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes();
    const setValue = (value: any, node: any) =>
      new Promise((resolve: any) => {
        this.setState(
          (state) => ({
            ...state,
            values: {
              ...state.values,
              [getNodeId(node)]: value,
            },
          }),
          resolve
        );
      });

    if (!flow) {
      // No flow was set yet? It's probably still loading...
      //
      // Nodes have only one element? It is probably just the CSRF Token
      // and the filter did not match any elements!
      return null;
    }
    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        <Stack
          direction="column"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Grid container rowSpacing={{ xs: 4, md: 2}} columnSpacing={{ xs: 2 }}>
            {nodes
              .filter((node: any) =>
                [
                  'traits.firstName',
                  'traits.middleName',
                  'traits.lastName',
                ].includes(node.attributes.name)
              )
              .map((node, k) => {
                const id = getNodeId(node) as keyof Values;
                const attributes: any = node.attributes;
                return (
                  <Grid item xs={12} md={4}>
                    <Node
                      key={`${id}-${k}`}
                      disabled={isLoading}
                      node={node}
                      value={values[id]}
                      values={values}
                      errors={this.state.errors}
                      dispatchSubmit={this.handleSubmit}
                      setValue={(value) =>
                        new Promise((resolve) => {
                          this.setState(
                            (state) => ({
                              ...state,
                              values: {
                                ...state.values,
                                [getNodeId(node)]: value,
                                'traits.inviter': this.state.inviterId,
                              },
                            }),
                            resolve
                          );
                        })
                      }
                    />
                  </Grid>
                );
              })}

            {nodes
              .filter((node: any) =>
                ['traits.email', 'traits.username'].includes(
                  node.attributes.name
                )
              )

              .map((node, k) => {
                const id = getNodeId(node) as keyof Values;
                const attributes: any = node.attributes;
                return (
                  <Grid item xs={12} md={6}>
                    <Node
                      key={`${id}-${k}`}
                      disabled={isLoading}
                      node={node}
                      value={values[id]}
                      values={values}
                      errors={this.state.errors}
                      dispatchSubmit={this.handleSubmit}
                      setValue={(value) =>
                        new Promise((resolve) => {
                          this.setState(
                            (state) => ({
                              ...state,
                              values: {
                                ...state.values,
                                [getNodeId(node)]: value,
                              },
                            }),
                            resolve
                          );
                        })
                      }
                    />
                  </Grid>
                );
              })}
            {nodes
              .filter((node: any) =>
                ['password'].includes(node.attributes.name)
              )

              .map((node, k) => {
                const id = getNodeId(node) as keyof Values;
                const attributes: any = node.attributes;
                return (
                  <Grid item xs={12} md={6}>
                    <Node
                      key={`${id}-${k}`}
                      disabled={isLoading}
                      node={node}
                      value={values[id]}
                      values={values}
                      errors={this.state.errors}
                      dispatchSubmit={this.handleSubmit}
                      setValue={(value) =>
                        new Promise((resolve) => {
                          this.setState(
                            (state) => ({
                              ...state,
                              values: {
                                ...state.values,
                                [getNodeId(node)]: value,
                              },
                            }),
                            resolve
                          );
                        })
                      }
                    />
                  </Grid>
                );
              })}
            {this.state.isNormalRegister && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  autoFocus
                  // sx={{ mt: '16px', ml: '16px' }}
                  label={'* ' + t('Confirm password')}
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={(e) => {
                    this.setState((state) => ({
                      ...state,
                      confirmPassword: e.target.value,
                    }));
                  }}
                  error={this.state.errors?.confirmPassword ? true : false}
                  helperText={t(
                    errorFields[this.state.errors?.confirmPassword]
                  )}
                  onKeyDownCapture={(e) => {
                    if (e.key === 'Enter') {
                      this.handleSubmit(e);
                    }
                  }}
                />
              </Grid>
            )}
          </Grid>

          {nodes
            .filter((node: any) => ['submit'].includes(node.attributes.type))

            .map((node, k) => {
              const id = getNodeId(node) as keyof Values;
              const attributes: any = node.attributes;
              return (
                <Box sx={{ width: '100%', marginTop: '30px !important' }}>
                  <Node
                    key={`${id}-${k}`}
                    disabled={isLoading}
                    node={node}
                    value={values[id]}
                    values={values}
                    errors={this.state.errors}
                    dispatchSubmit={this.handleSubmit}
                    setValue={(value) =>
                      new Promise((resolve) => {
                        this.setState(
                          (state) => ({
                            ...state,
                            values: {
                              ...state.values,
                              [getNodeId(node)]: value,
                            },
                          }),
                          resolve
                        );
                      })
                    }
                  />
                </Box>
              );
            })}
        </Stack>
      </form>
    );
  }
}
export default withTranslation()(RegisterFlow);
