import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import ActivityProgress from 'oldComponents/activityProgress/ActivityProgressComponent';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as globalActions from 'redux/actions/globalActions';

import { bountyBoxStyles } from './bountyBoxStyles';
import { IBountyBoxComponentProps } from './IBountyBoxComponentProps';
import { IBountyBoxComponentState } from './IBountyBoxComponentState';

// - Material-UI
// - Import app components
// - Import API

// - Import actions

export class BountyBoxComponent extends Component<
    IBountyBoxComponentProps & WithTranslation,
    IBountyBoxComponentState
> {
    /**
     * Component constructor
     */
    constructor(props: IBountyBoxComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, caption, text, image, subheader, value } = this.props;
        return (
            <Grid item xs={12} sm={6} md={4}>
                <ListItem button>
                    <Paper className={classes.paper} elevation={4}>
                        <ActivityProgress caption={caption} value={value} />
                        <Typography className={classes.text}>{text}</Typography>
                        <CardHeader
                            className={classes.cardHeader}
                            avatar={<Avatar src={image} className={classes.bigAvatar} />}
                            subheader={<Typography variant="caption">{subheader}</Typography>}
                        />
                    </Paper>
                </ListItem>
            </Grid>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: Function) => {
    return {
        setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(BountyBoxComponent);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(bountyBoxStyles as any)(translateWrapper as any));
