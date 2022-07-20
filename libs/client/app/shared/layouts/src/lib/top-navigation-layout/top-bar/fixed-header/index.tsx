/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box} from '@mui/material';
import { FC, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { ReactNode } from 'react-transition-group/node_modules/@types/react';

const FixedHeaderWrapper = styled(Box)(
  (theme) => `
    position: fixed;
    left: 0;
    top: -100px;
    width: 100%;
    max-height: 80px;
    padding-top: 8px; 
    padding-bottom: 8px; 
    z-index: 1000;
    transition: top 300ms;
    border-bottom: solid 2px #ffffff;
  `
);

interface FixedHeaderProps {
  children?: ReactNode;
  sx?: SxProps;
}

const FixedHeader: FC<FixedHeaderProps> = (props) => {
  const { children, sx } = props;

  // * useEffect
  useEffect(() => {
    const scrollDiv = document.getElementById('__next')?.firstChild;
    
    if (scrollDiv) {
      const handleScroll = (e: any) => {
        const fixedHeaderElement = document.getElementById('fixed-header');
        if (fixedHeaderElement) {
          if (e?.srcElement?.scrollTop > 50) {
            fixedHeaderElement.style.top = '0px';
          } else {
            fixedHeaderElement.style.top = '-100px';
          }
        }
      };

      scrollDiv.addEventListener('scroll', handleScroll);
  
      return () => {
        scrollDiv.removeEventListener('scroll', handleScroll);
      };
    }

  }, []);

  return (
    <FixedHeaderWrapper
      id="fixed-header"
      sx={{
        ...sx
      }}
    >
      {children}
    </FixedHeaderWrapper>
  );
};

export default FixedHeader;