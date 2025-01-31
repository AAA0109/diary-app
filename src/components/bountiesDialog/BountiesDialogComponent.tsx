import AppBar from '@mui/material/AppBar/AppBar';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import Grid from '@mui/material/Grid/Grid';
import IconButton from '@mui/material/IconButton/IconButton';
import Slide from '@mui/material/Slide';
import { withStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import Typography from '@mui/material/Typography/Typography';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames';
import BountyBox from 'components/bountyBox/BountyBoxComponent';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TransitionProps } from '@mui/material/transitions';

import { bountiesDialogStyles } from './bountiesDialogStyles';
import { IBountiesDialogComponentProps } from './IBountiesDialogComponentProps';
import { IBountiesDialogComponentState } from './IBountiesDialogComponentState';

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// - Import actions
const image1 = 'https://i.stack.imgur.com/rp3Cv.png';
const image2 = 'https://i.stack.imgur.com/EN0AX.png';
const image3 = 'https://i.stack.imgur.com/SqKnG.png';

export class BountiesDialogComponent extends Component<
    IBountiesDialogComponentProps & WithTranslation,
    IBountiesDialogComponentState
> {
    /**
     * Component constructor
     */
    constructor(props: IBountiesDialogComponentProps & WithTranslation) {
        super(props);
        this.state = {
            completed: 50,
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, text } = this.props;
        return (
            <div>
                <Button onClick={this.handleClickOpen} classes={{ root: classes.buttonBounties }}>
                    {text}
                </Button>
                <Dialog
                    maxWidth={'md'}
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.handleClose}
                                aria-label="Close"
                                className={classes.iconClose}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                color="inherit"
                                className={classNames(classes.flex, classes.dialogTitle)}
                            >
                                All Your Bounties
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={8} justifyContent={'center'} className={classes.gridContainer}>
                        <BountyBox
                            value={20}
                            caption={'Cinema Ticket 10/50'}
                            text={'Visit the site each day for 100 consecutive days (Days are counted in UTC'}
                            image={image1}
                            subheader={'Cooperation'}
                        />
                        <BountyBox
                            value={70}
                            caption={'Voucher $100 14/20'}
                            text={'Take part in at least 100 surveys of company'}
                            image={image2}
                            subheader={'Joint Stock Company'}
                        />
                        <BountyBox
                            value={40}
                            caption={'A trip to Asia 32/80'}
                            text={'Have bills with total amount of $5000'}
                            image={image3}
                            subheader={'Limited Company'}
                        />
                        <BountyBox
                            value={20}
                            caption={'Cinema Ticket 10/50'}
                            text={'Visit the site each day for 100 consecutive days (Days are counted in UTC'}
                            image={image1}
                            subheader={'Cooperation'}
                        />
                        <BountyBox
                            value={70}
                            caption={'Voucher $100 14/20'}
                            text={'Take part in at least 100 surveys of company'}
                            image={image2}
                            subheader={'Joint Stock Company'}
                        />
                        <BountyBox
                            value={40}
                            caption={'A trip to Asia 32/80'}
                            text={'Have bills with total amount of $5000'}
                            image={image3}
                            subheader={'Limited Company'}
                        />
                        <BountyBox
                            value={20}
                            caption={'Cinema Ticket 10/50'}
                            text={'Visit the site each day for 100 consecutive days (Days are counted in UTC'}
                            image={image1}
                            subheader={'Cooperation'}
                        />
                        <BountyBox
                            value={70}
                            caption={'Voucher $100 14/20'}
                            text={'Take part in at least 100 surveys of company'}
                            image={image2}
                            subheader={'Joint Stock Company'}
                        />
                        <BountyBox
                            value={40}
                            caption={'A trip to Asia 32/80'}
                            text={'Have bills with total amount of $5000'}
                            image={image3}
                            subheader={'Limited Company'}
                        />
                        <BountyBox
                            value={20}
                            caption={'Cinema Ticket 10/50'}
                            text={'Visit the site each day for 100 consecutive days (Days are counted in UTC'}
                            image={image1}
                            subheader={'Cooperation'}
                        />
                        <BountyBox
                            value={70}
                            caption={'Voucher $100 14/20'}
                            text={'Take part in at least 100 surveys of company'}
                            image={image2}
                            subheader={'Joint Stock Company'}
                        />
                        <BountyBox
                            value={40}
                            caption={'A trip to Asia 32/80'}
                            text={'Have bills with total amount of $5000'}
                            image={image3}
                            subheader={'Limited Company'}
                        />
                    </Grid>
                </Dialog>
            </div>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(BountiesDialogComponent);
export default withStyles(bountiesDialogStyles as any)(translateWrapper as any);
