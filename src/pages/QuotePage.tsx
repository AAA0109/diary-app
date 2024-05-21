import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ReactMarkdown from 'react-markdown';
import { Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_MAIN } from 'routes/paths';
import { HttpService } from 'data/webAPI/services/httpService';
import axiosInstance from 'utils/axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

const QuoteThemes = [
    {
        backgroundColor: "#469AD0",
    },
    {
        backgroundColor: "#0F344A",
    },
    {
        backgroundColor: "#EF476F",
    }
]

const randomNum = Math.floor(Math.random() * QuoteThemes.length);

export function QuotePage() {
    const { t } = useTranslation();

    const [quote, setQuote] = useState('');
    const randomTheme = QuoteThemes[randomNum];
    const navigate = useNavigate();

    const handleSkip = () => {
        navigate(PATH_MAIN.user.home);
    }

    const show_quote_day = localStorage.getItem('show_quote_day');

    useEffect(() => {
        if (show_quote_day) {
            moment(show_quote_day).diff(moment.now(), 'days') === 0 && navigate(PATH_MAIN.user.home);
        }
        fetchRandomQuote();
    }, [])

    const fetchRandomQuote = async () => {
        const res = await axiosInstance.get('https://api.api-ninjas.com/v1/quotes', {
            headers: {
                'X-Api-Key': 'nzfZGX3EZdgPdc/KZ7k+5A==CQPwzpSHnlxXEvRR'
            }
        });
        setQuote(res.data[0].quote);
    }

    const handleShow = (e: any, checked: boolean) => {
        if (checked) {
            localStorage.setItem('show_quote_day', new Date().toDateString())
        }
        else {
            localStorage.setItem('show_quote_day', '');
        }
    }

    return (
        <RootStyle style={{ backgroundColor: randomTheme.backgroundColor }}>
            <ContainerStyle>
                <img src='/quote_logo.png' alt="quotes_logo" />
                <QuotePane>
                    <QuotePaneOverlay />
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <path opacity="0.3" d="M6 37.1539C6 32.0315 7.91418 27.0978 11.7425 22.3528C15.6248 17.6077 19.9385 14.1568 24.6835 12L26.2202 15.2352C22.4458 17.3921 19.2105 20.0881 16.5145 23.3233C13.8724 26.5046 12.5513 29.7399 12.5513 33.029C12.5513 33.6761 12.7401 34.1614 13.1175 34.4849C13.5489 34.8084 14.0881 34.9702 14.7351 34.9702C18.24 34.5927 20.1272 34.404 20.3968 34.404C22.1762 34.404 24.0904 35.051 26.1393 36.3451C28.2422 37.6392 29.2937 39.85 29.2937 42.9774C29.2937 45.6195 28.431 47.8572 26.7055 49.6905C24.98 51.5238 22.5267 52.4404 19.3453 52.4404C15.6248 52.4404 12.4705 51.0115 9.88228 48.1537C7.29409 45.242 6 41.5754 6 37.1539ZM35.014 37.801C35.014 32.0315 36.9551 26.8282 40.8374 22.191C44.7736 17.4999 49.0603 14.1029 53.6975 12L55.2342 15.2352C51.4598 17.3921 48.2245 20.0611 45.5285 23.2424C42.8864 26.3698 41.5653 29.5781 41.5653 32.8673C41.5653 33.4604 41.7271 33.9726 42.0506 34.404C42.3742 34.7814 42.9403 34.9702 43.7491 34.9702C47.2001 34.5927 49.0873 34.404 49.4108 34.404C51.4059 34.404 53.374 35.1319 55.3151 36.5878C57.3102 37.9897 58.3077 40.0926 58.3077 42.8965C58.3077 45.1072 57.5258 47.2641 55.9621 49.367C54.4524 51.4159 51.8911 52.4404 48.2785 52.4404C44.3962 52.4404 41.2149 50.9576 38.7345 47.992C36.2542 44.9724 35.014 41.5754 35.014 37.801Z" fill="white" />
                    </svg>
                    <Box width="100%" display="flex" justifyContent="center" marginY="15px">
                        {quote ?
                            <Typography>
                                {quote}
                            </Typography>
                            :
                            <CircularProgress color='inherit' />
                        }
                    </Box>
                </QuotePane>
                <FormGroup>
                    <DailyCheckBoxLabel control={<DailyCheckBox onChange={handleShow} />} label="Don’t show for today" />
                </FormGroup>
            </ContainerStyle>
            <BottomButtonPane>
                <Typography onClick={handleSkip} style={{ cursor: 'pointer' }}>
                    Skip
                </Typography>
            </BottomButtonPane>
        </RootStyle>
    );
}

const RootStyle = styled(Box)(() => ({
    height: '100vh',
    display: 'flex',
    alignItems: 'space-between',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: "24px 12px",
}))

const ContainerStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    maxWidth: 480,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}));

const QuotePane = styled(Box)(() => ({
    borderRadius: 10,
    color: '#fff',
    marginTop: 50,
    marginBottom: 15,
    position: 'relative',
    padding: 16,
    transition: 'all 0.3s ease',
    width: '100%',
}))

const QuotePaneOverlay = styled(Box)(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#F6FAFD',
    borderRadius: 10,
    opacity: 0.1,
}))

const DailyCheckBoxLabel = styled(FormControlLabel)(() => ({
    color: '#fff',
}))

const DailyCheckBox = styled(Checkbox)(() => ({
    '& .MuiSvgIcon-root': {
        fontSize: 24,
        fill: '#fff',
    }
}))

const BottomButtonPane = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
    marginBottom: 20,
    color: '#fff',
}))

export default QuotePage;
