import { validateEmail } from '@els/client/shared/utils';
import { Box, Button } from '@mui/material';
import { getNodeLabel } from '@ory/integrations/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeInputProps } from './helpers';
export function NodeInputLimitSubmit({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
  values
}: NodeInputProps) {
  const { t }: { t: any } = useTranslation();
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  };

  const [temporarilyDisabled, setTemporarilyDisabled] =
    useState<boolean>(false);
  const [countdownTimer, setCountdownTimer] = useState<number>(0);
  const countdownTimeoutRef = useRef<any>();
  const handleCountdown = (currentCountdownTimer: number) => {
    if (currentCountdownTimer <= 0)  {
      setTemporarilyDisabled(false);
      return;
    };

    clearTimeout(countdownTimeoutRef.current);
    countdownTimeoutRef.current = setTimeout(() => {
      const newCurrentCountdownTimer = currentCountdownTimer - 1;
      setCountdownTimer(newCurrentCountdownTimer);
      handleCountdown(newCurrentCountdownTimer);
    }, 1000);
  };
  useEffect(() => {
    if (!values.email) setTemporarilyDisabled(true); 
    else {
      if (countdownTimer <= 0 && validateEmail(values.email) )  {

        setTemporarilyDisabled(false);
        return;
      };
      setTemporarilyDisabled(true);
    }
  }, [values.email]);
  return (
    <Button
      id="button-limit-submit"
      color="primary"
      size="large"
      variant="contained"
      name={attributes.name}
      fullWidth
      onClick={(e: any) => {
        onClick();
        setValue(attributes.value).then(() => dispatchSubmit(e));
        setTemporarilyDisabled(true);
        handleCountdown(5000 / 1000);
      }}
      value={attributes.value || ''}
      disabled={temporarilyDisabled}
    >
      {t(getNodeLabel(node))}
      {!!countdownTimer && <Box sx={{ ml: 0.5 }}>({countdownTimer})</Box>}
    </Button>
  );
}
