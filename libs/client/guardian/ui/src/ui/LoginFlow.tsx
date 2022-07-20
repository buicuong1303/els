/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { ButtonCustom } from '@els/client/app/shared/ui';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { getNodeId, getNodeLabel, isUiNodeInputAttributes } from '@ory/integrations/ui';
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
import { NextRouter } from 'next/router';
// import { Button } from '@ory/themes'
import { Component, FormEvent } from 'react';
import { withTranslation } from 'react-i18next';
import { Node } from './Node';

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
  router?: NextRouter;
};

function emptyState<T>() {
  return {} as T;
}

type State<T> = {
  values: T;
  isLoading: boolean;
};

class LoginFlow<T extends Values> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      values: emptyState(),
      isLoading: false,
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
    return flow.ui.nodes.filter(({ group }) => {
      if (group === 'oidc' && flow.request_url?.includes('registration'))
        return false;
      if (!only) {
        return true;
      }
      return group === 'default' || group === only;
    });
  };

  // Handles form submission
  handleSubmit = (e: MouseEvent | FormEvent) => {
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
      this.setState((state) => ({
        ...state,
        isLoading: false
      }));
    });
  };

  render() {
    const { flow, t, router } = this.props;
    const { values, isLoading } = this.state;

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes();
    const setValue = (value: any, node: any, method: string) =>
      new Promise((resolve: any) => {
        this.setState(
          (state) => ({
            ...state,
            values: {
              ...state.values,
              method: method,
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
          justifyContent="center"
          alignItems="center"
        >
          { nodes
            .filter((node) => node.group !== 'oidc')
            .map((node, k) => {
              const id = getNodeId(node) as keyof Values;
              return (
                <Node
                  key={`${id}-${k}`}
                  disabled={isLoading}
                  node={node}
                  value={values[id]}
                  values={values}
                  dispatchSubmit={this.handleSubmit}
                  setValue={(value) =>
                    new Promise((resolve) => {
                      this.setState(
                        (state) => ({
                          ...state,
                          values: {
                            ...state.values,
                            method: 'password',
                            [getNodeId(node)]: value,
                          },
                        }),
                        resolve
                      );
                    })
                  }
                />
              );
            })
          }

          <Stack mt={1} direction="row" justifyContent="start" style={{ width: '100%' }} >
            <ButtonCustom
              children={t('Forgot password?')} onClick={() => !router ? null : router.push('/recovery')}
              sx={{
                backgroundColor: 'unset !important',
                padding: 0,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            />
          </Stack>

          <Divider
            children={
              <Typography
                children={t('OR')}
                sx={{
                  position: 'relative',
                  fontSize: '18px',
                  top: '4px',
                  lineHeight: 1,
                  color: '#cccccc',
                  fontWeight: 300
                }}
              />
            }
            sx={{
              position: 'relative',
              width: '100%',
              height: '1px',
              mt: 2,
            }}
          />

          <Stack mt={3} direction="row" justifyContent="space-between" style={{ width: '100%' }} >
            { nodes
              .filter((node) => node.group === 'oidc')
              .map((node, k) => {
                const attributes: any = node.attributes;
                return (
                  <Button
                    key={k}
                    variant="outlined"
                    startIcon={
                      getNodeLabel(node) === 'Sign in with google' ? (
                        <img
                          style={{ width: 20, height: 20 }}
                          //TODO: need save local image
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png"
                        />
                      ) : (
                        <img
                          style={{ width: 20, height: 20 }}
                          //TODO: need save local image
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjQdFObA8tDXxbLJPbJ__bqNe3sWQvEs6xFg&usqp=CAU"
                        />
                      )
                    }
                    name={attributes.name}
                    onClick={(e) => {
                      // On click, we set this value, and once set, dispatch the submission!
                      setValue(attributes.value, node, 'oidc').then(() =>
                        this.handleSubmit(e)
                      );
                    }}
                    value={attributes.value || ''}
                    // disabled={node.attributes.disabled || disabled}
                    sx={{
                      flex: 1,
                      maxWidth: 'calc(50% - 8px)'
                    }}
                  >
                    {getNodeLabel(node) === 'Sign in with google'
                      ? 'Google'
                      : getNodeLabel(node) === 'Sign in with facebook'
                        ? 'Facebook'
                        : getNodeLabel(node)}
                  </Button>
                );
              })
            }
          </Stack>

          <Stack mt={2} direction="row" justifyContent="center" style={{ width: '100%' }} >
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t('Don’t have an account, yet?')}
            </Typography>
            &nbsp;
            <ButtonCustom
              children={t('Sign up here')} onClick={() => !router ? null : router.push('/registration')}
              sx={{
                backgroundColor: 'unset !important',
                padding: 0,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  }
}
export default withTranslation()(LoginFlow);
