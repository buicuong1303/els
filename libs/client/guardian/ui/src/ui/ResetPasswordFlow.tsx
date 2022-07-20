/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import {
  Box,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { getNodeId } from '@ory/integrations/ui';
import { isUiNodeInputAttributes } from '@ory/integrations/ui';
import { Node } from './Node';
import { object, string, ref } from 'yup';
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
} from '@ory/client';
// import { Button } from '@ory/themes'
import { Component, FormEvent } from 'react';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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
  t: any
};

function emptyState<T>() {
  return {} as T;
}

type State<T> = {
  values: T;
  isLoading: boolean;
  confirmPassword: string | undefined;
  errors: any;
};
// const TextFieldWrapper = styled(TextField)(
//   ({ theme }) => `
//     margin-bottom: ${theme.spacing(3.5)};
//     margin:${theme.spacing(2)} !important;
//   `
// );

class ResetPasswordFlow<T extends Values> extends Component<Props<T>, State<T>> {
  private userSchema = object({
    password: string().required('The password field is required'),

    confirmPassword: string()
      .required()
      .oneOf([ref('password'), undefined], 'The confirmPassword must match')
      .required('The confirmPassword field is required'),
  });
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      values: emptyState(),
      isLoading: false,
      confirmPassword: undefined,
      errors: {},
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
    return flow.ui.nodes.filter((node: any) => {
      if (
        (node.group === 'oidc' && flow.request_url?.includes('registration')) ||
        node.attributes.name === 'traits.picture'
      )
        return false;
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
      await this.userSchema.validate(
        { ...this.state.values, confirmPassword: this.state.confirmPassword },
        {
          abortEarly: false,
        }
      );
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
          this.props.flow?.ui.messages?.filter((message) => message.type === 'error').forEach((message) => toast.error(message.text));
        })
        .finally(() => {
          // We wait for reconciliation and update the state after 50ms
          // Done submitting - update loading status

          this.setState((state) => ({
            ...state,
            isLoading: false,
            errors: {}
          }));
        });
    } catch (error) {
      const err: any = error;
      console.log(error);
      this.setState((state) => ({
        ...state,
        errors: {
          confirmPassword: err?.errors.find((e: any) =>
            e.includes('confirmPassword')
          ),
          password: err?.errors.find((e: any) => e.includes('password')),
        },
      }));
    }
  };

  render() {
    const { flow, t } = this.props;
    const { values, isLoading } = this.state;
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
          <Grid container rowSpacing={{ xs: 0 }} columnSpacing={{ xs: 2 }}>


            {nodes
              .filter((node: any) => ['password'].includes(node.attributes.name))

              .map((node, k) => {
                const id = getNodeId(node) as keyof Values;
                return (
                  <Grid item xs={12} md={12}>
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
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                autoFocus
                sx={{ mt: '24px'}}
                label={'* ' + t('Confirm password')}
                type="password"
                onChange={(e) => {
                  this.setState((state) => ({
                    ...state,
                    confirmPassword: e.target.value,
                  }));
                }}
                error={this.state.errors?.confirmPassword ? true : false}
                helperText={this.state.errors?.confirmPassword}
                onKeyDownCapture={(e) => {
                  if (e.key === 'Enter') {
                    this.handleSubmit(e);
                  }
                }}
              />
            </Grid>
          </Grid>

          {nodes
            .filter((node: any) => ['submit'].includes(node.attributes.type))

            .map((node, k) => {
              const id = getNodeId(node) as keyof Values;
              return (
                <Box sx={{ width: '100%', mt: '24px !important'}}>
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
export default withTranslation()(ResetPasswordFlow);
