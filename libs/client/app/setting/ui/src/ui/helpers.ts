/* eslint-disable @typescript-eslint/no-explicit-any */
import { SxProps } from '@mui/system';
import { UiNode, UiNodeInputAttributes } from '@ory/client';
import { FormEvent, ReactNode } from 'react';

export type ValueSetter = (
  value: string | number | boolean | undefined
) => Promise<void>;

export type FormDispatcher = (e: MouseEvent | FormEvent) => Promise<void>;

export interface NodeInputProps {
  nodeRef?: any;
  node: UiNode;
  attributes: UiNodeInputAttributes;
  value: any;
  disabled: boolean;
  dispatchSubmit: FormDispatcher;
  setValue: ValueSetter;
  values?: any;
  errors?: any;
  startIcon?: ReactNode;
  sx?: SxProps;
  size?: 'medium' | 'small',
  variant?: 'contained' | 'outlined',
  type?: 'text' | 'password'
  id?: string;
  name?: string;
  isNumberFormat?: boolean;
  numberFormatType?: 'text' | 'tel' | 'password';
  format?: string;
  suffix?: string;
  prefix?: string;
  thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan';
}
