/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles } from '@mui/styles';
import SvgImage from '@mui/icons-material/Image';
import { Box, CircularProgress, Theme, Typography, useMediaQuery } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { IDiaryCarouselComponentProps } from './IDiaryCarouselComponentProps';
import DiaryPaneComponent from '../diaryPane';
import useDiary from 'hooks/useDiary';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            position: 'relative',
        },
        carousel: {
            display: 'flex',
            width: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            "&::-webkit-scrollbar": {
                display: 'none',
            },
        },
        arrowIcon: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all .3s',
            '&:hover': {
                transform: 'translateY(-50%) scale(1.1)',
            },
            '& svg': {
                color: '#eee',
            }
        },
        noDisplay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    }),
);

export function DiaryCarouselComponent(props: IDiaryCarouselComponentProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { loadingDiaryList } = useDiary();

    const { diaryList, style } = props;

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [canScrollRight, setCanScrollRight] = React.useState(false);
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const leftScroll = () => {
        if (scrollRef.current) {
            setScrollLeft(scrollRef.current.scrollLeft - 260);
            scrollRef.current.scrollLeft -= 260;
        }
    }

    const rightScroll = () => {
        if (scrollRef.current) {
            setScrollLeft(scrollRef.current.scrollLeft + 260);
            scrollRef.current.scrollLeft += 260;
        }
    }

    const handleScroll = (event: any) => {
        if (scrollRef.current) {
            setCanScrollRight(scrollLeft < scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth);
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            setCanScrollRight(scrollLeft < scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth);
            scrollRef.current.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener('scroll', handleScroll);
            }
        }
    }, [scrollRef.current]);

    const canScrollLeft = scrollLeft > 0;
    return (
        <Box className={classes.root}>
            {loadingDiaryList ?
                <Box className={classes.noDisplay}>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </Box>
                :
                (
                    diaryList.length === 0 ?
                        <Box className={classes.noDisplay}>
                            <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)">
                                No diary yet...
                            </Typography>
                        </Box>
                        :
                        <>
                            <Box className={classes.carousel} ref={scrollRef}>
                                {diaryList.map(e => (
                                    <DiaryPaneComponent diary={e} key={e.id} updateDiaryList={props.updateDiaryList} isFixedSize={true} isCarrousel={true} />
                                ))}
                            </Box>
                            {
                                !mdDownHidden && <>
                                    <Box className={classes.arrowIcon} left="20px">
                                        <ArrowBackIosNewIcon onClick={leftScroll} />
                                    </Box>
                                    <Box className={classes.arrowIcon} right="20px">
                                        <ArrowForwardIosIcon onClick={rightScroll} />
                                    </Box>
                                </>
                            }
                        </>
                )
            }
        </Box>
    );
}

export default DiaryCarouselComponent;
