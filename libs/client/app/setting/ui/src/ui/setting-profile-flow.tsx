/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { Box, Grid, Stack } from '@mui/material';
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
import { Node } from './node';
import * as Yup from 'yup';
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
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow;
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods;
  // Is triggered on submission
  onSubmit: (values: T) => Promise<void>;
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean;
  onSetCurrentAvatar: (url: string) => void;
  buttonSaveRef?: any;
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
  errors: any;
};

export default class SettingProfileFlow<T extends Values> extends Component<Props<T>, State<T>> {
  private validationSchema = Yup.object({
    'traits.firstName': Yup.string().max(50, 'The firstName must be at most 50.').required('The firstName field is required.'),
    'traits.lastName': Yup.string().max(50, 'The lastName must be at most 50.').required('The lastName field is required.'),
    'traits.middleName': Yup.string().max(50, 'The middleName must be at most 50.')
  });

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      values: emptyState(),
      isLoading: false,
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

    if (!flow) return [];

    const pictureNode: any = flow.ui?.nodes.find(({ group, attributes }: any) => attributes['name'] === 'traits.picture');
    this.props.onSetCurrentAvatar(pictureNode?.attributes.value);

    return flow.ui?.nodes.filter(({ group, attributes }: any) => {
      if (group === 'oidc' && flow.request_url?.includes('registration'))
        return false;

      if (!only)
        return true;

      return group === 'default' || group === only;
    });
  };

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
        isLoading: false,
      }));
    });
  };

  handleValidate = async (e: any) => {
    try {
      await this.validationSchema.validate(
        { ...this.state.values },
        {
          abortEarly: false,
        }
      );

      this.props.handleOpenDialogConfirm({
        title: this.props.t('Will update your profile'),
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
          'traits.firstName': err?.errors.find((errors: any) => errors.includes('firstName')),
          'traits.lastName': err?.errors.find((errors: any) => errors.includes('lastName')),
          'traits.middleName': err?.errors.find((errors: any) => errors.includes('middleName')),
        },
      }));
    }
  };

  render() {
    const { flow, buttonSaveRef, buttonCancelRef, setCanUpdate } = this.props;
    const { values, isLoading } = this.state;

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes();

    const setValue = (value: any, node: any) : Promise<void> =>
      new Promise((resolve: any) => {
        const newErrors = {...this.state.errors};
        delete newErrors[node.attributes.name];
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
        setCanUpdate(true);
      });

    return (
      <form
        action={flow?.ui?.action}
        method={flow?.ui?.method}
        onReset={() => {
          this.initializeValues(this.filterNodes());

          this.setState((state) => ({
            ...state,
            isLoading: false,
            errors: {}
          }));

          const pictureNode: any = flow?.ui?.nodes.find(({ group, attributes }: any) => attributes['name'] === 'traits.picture');
          this.props.onSetCurrentAvatar(pictureNode?.attributes.value);

          setCanUpdate(false);
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {nodes.filter((node: any) => ['traits.username'].includes(node.attributes.name)).map((node: any, k) => {
            const id = getNodeId(node) as keyof Values;
            return (
              <Node
                size="small"
                key={`${id}-${k}`}
                disabled={isLoading}
                node={node}
                value={values[id]}
                dispatchSubmit={this.handleValidate}
                errors={this.state.errors}
                setValue={(value) => setValue(value, node)}
                sx={{
                  '.MuiInputBase-root': {
                    height: '40px',
                    mb: '16px',
                    input: {
                      height: '40px',
                    }
                  }
                }}
              />
            );
          })}

          {nodes.filter((node: any) => ['traits.email', 'traits.phone'].includes(node.attributes.name)).map((node: any, k) => {
            const id = getNodeId(node) as keyof Values;
            return (
              <Node
                size="small"
                key={`${id}-${k}`}
                disabled={isLoading || node?.attributes?.name === 'traits.email'}
                node={node}
                value={values[id]}
                dispatchSubmit={this.handleValidate}
                errors={this.state.errors}
                setValue={(value) => setValue(value, node)}
                sx={{
                  '.MuiInputBase-root': {
                    height: '40px',
                    mb: '16px',
                    input: {
                      height: '40px',
                    }
                  }
                }}
              />
            );
          })}

          <Grid
            container
            direction="row"
            columnSpacing={1}
            sx={{
              '.MuiFormControl-root': {
                mb: '32px !important',
              },
            }}
          >
            {nodes.filter((node: any) => ['traits.firstName', 'traits.lastName', 'traits.middleName'].includes(node.attributes.name)).map((node: any, k) => {
              const id = getNodeId(node) as keyof Values;

              return (
                <Grid item xs={12} md={4}>
                  <Node
                    size="small"
                    key={`${id}-${k}`}
                    disabled={isLoading}
                    node={node}
                    value={values[id]}
                    dispatchSubmit={this.handleValidate}
                    errors={this.state.errors}
                    setValue={(value) => setValue(value, node)}
                    sx={{
                      '.MuiFormControl-root': {
                        mb: 4,
                      },
                      '.MuiInputBase-root': {
                        height: '40px',
                        input: {
                          height: '40px',
                        }
                      }
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>

        <Box width="100%" display="flex" justifyContent="end">
          <button ref={buttonCancelRef} children='cancel' type="reset" style={{ display: 'none' }} />

          <Box width="fit-content">
            {nodes.filter((node: any) => ['method'].includes(node.attributes.name)).map((node, k) => {
              const id = getNodeId(node) as keyof Values;
              return (
                <Node
                  nodeRef={buttonSaveRef}
                  key={`${id}-${k}`}
                  disabled={isLoading}
                  node={node}
                  value={values[id]}
                  variant='contained'
                  dispatchSubmit={this.handleValidate}
                  setValue={(value) => setValue(value, node)}
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
