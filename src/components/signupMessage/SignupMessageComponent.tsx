import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { SignupStepEnum } from 'models/authorize/signupStepEnum';
import * as authorizeActions from 'redux/actions/authorizeActions';

import { ISignupMessageProps } from './ISignupMessageProps';
import { ISignupMessageState } from './ISignupMessageState';
import { signupMessageStyles } from './signupMessageStyles';

export class SignupMessageComponent extends Component<ISignupMessageProps & WithTranslation, ISignupMessageState> {
    constructor(props: ISignupMessageProps & WithTranslation) {
        super(props);

        this.handleResetStep = this.handleResetStep.bind(this);
    }

    /**
     * Handle reset step
     */
    handleResetStep = () => {
        const { resetStep } = this.props;
        resetStep();
    };

    render() {
        const { classes, t } = this.props;
        return (
            <div className={classes.root}>
                <Typography className={classes.caption} variant="caption" component="p">
                    {t('signup.termCaption')} <NavLink to="/terms"> {t('signup.termCaptionLink')} </NavLink>
                </Typography>
                <Button
                    variant="contained"
                    className={classes.signupButton}
                    color="secondary"
                    onClick={this.handleResetStep}
                    fullWidth
                    tabIndex={3}
                >
                    {t('signup.resetButton')}
                </Button>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        resetStep: () => dispatch(authorizeActions.setSignupStep(SignupStepEnum.UserInformation)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SignupMessageComponent);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(signupMessageStyles as any)(translateWrapper as any) as any);
