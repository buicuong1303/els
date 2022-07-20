/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const PracticeIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M8.25763 0.5C8.43887 0.500008 8.61397 0.565643 8.75056 0.684767C8.88715 0.803891 8.97598 0.968446 9.00063 1.148L9.00763 1.25V6.044C10.3964 6.21194 11.6888 6.84073 12.6781 7.82984C13.6674 8.81894 14.2964 10.1112 14.4646 11.5H19.2586C19.4487 11.5001 19.6316 11.5722 19.7704 11.702C19.9093 11.8317 19.9937 12.0093 20.0067 12.1989C20.0196 12.3885 19.9601 12.5759 19.8402 12.7233C19.7203 12.8707 19.5489 12.9671 19.3606 12.993L19.2586 13H14.4646C14.2964 14.3888 13.6674 15.6811 12.6781 16.6702C11.6888 17.6593 10.3964 18.2881 9.00763 18.456V19.751C9.00957 19.9424 8.93828 20.1273 8.80836 20.2678C8.67843 20.4083 8.49969 20.4938 8.30875 20.5069C8.11781 20.5199 7.92911 20.4595 7.78129 20.3379C7.63347 20.2163 7.53771 20.0429 7.51363 19.853L7.50763 19.75V18.455C6.11947 18.2867 4.82777 17.658 3.83892 16.6694C2.85007 15.6807 2.22114 14.3891 2.05263 13.001H0.757628C0.566252 13.0029 0.381371 12.9317 0.240845 12.8017C0.100319 12.6718 0.0147793 12.4931 0.00174309 12.3021C-0.0112931 12.1112 0.0491601 11.9225 0.170724 11.7747C0.292287 11.6268 0.465763 11.5311 0.655628 11.507L0.757628 11.5H2.05163C2.21977 10.1114 2.84866 8.8192 3.83775 7.83012C4.82683 6.84103 6.11899 6.21214 7.50763 6.044V1.25C7.50763 1.05109 7.58665 0.860322 7.7273 0.71967C7.86795 0.579018 8.05872 0.5 8.25763 0.5ZM7.50763 13H3.56663C3.72494 13.9883 4.19113 14.9014 4.89877 15.6092C5.60641 16.317 6.51939 16.7834 7.50763 16.942V13ZM12.9486 13H9.00763V16.941C9.99558 16.7826 10.9084 16.3164 11.616 15.609C12.3236 14.9016 12.7899 13.9889 12.9486 13.001V13ZM7.50863 7.558C6.52003 7.71618 5.6066 8.18243 4.89857 8.89028C4.19054 9.59813 3.72406 10.5114 3.56563 11.5H7.50763V7.558H7.50863ZM9.00863 7.558L9.00763 11.5H12.9496C12.797 10.5487 12.359 9.6662 11.6936 8.96939C11.0282 8.27258 10.1669 7.79433 9.22363 7.598L9.00763 7.558H9.00863Z" fill="#223354"/>
    </SvgIcon>
  );
};

export { PracticeIcon };