/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Card, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
    border-radius: 0;
    // margin-top: ${theme.spacing(4)};
  `
);

function Footer() {
  const { t }: { t: any } = useTranslation();

  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2022 - {t('PHP Group International Vietnam Co., Ltd')}
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
          children={t('Developed by Software Team')}
        />
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
