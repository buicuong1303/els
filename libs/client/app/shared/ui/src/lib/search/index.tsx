import { FC, ReactNode } from 'react';

import { TextField, InputAdornment, IconButton, styled } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';

import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/system';

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
  
    .MuiSvgIcon-root {
      opacity: .7;
    }
  
    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
    
    .MuiInputBase-root {
        background: ${theme.colors.alpha.white[100]};
    }
  
    .MuiInputBase-adornedEnd {
      padding-right: ${theme.spacing(0.5)};
    }
  `
);

interface SearchProps {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  placeholder?: string;
  sx?: SxProps;
  value?: string;
  onChange: (e: any) => void;
}

const Search:FC<SearchProps> = (props) => {
  const {startAdornment, endAdornment, placeholder='', sx, value='', onChange } = props;

  const { t }: { t: any } = useTranslation();

  return (
    <SearchInputWrapper
      InputProps={{
        startAdornment: startAdornment === false ? '' : startAdornment ? startAdornment : (
          <InputAdornment position="start">
            <SearchTwoToneIcon />
          </InputAdornment>
        ),
        endAdornment: endAdornment === false ? '' : endAdornment ? endAdornment : (
          <InputAdornment position="end">
            <IconButton>
              <MicTwoToneIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      fullWidth
      sx={{
        ...sx
      }}
    />
  );
}

export { Search };
