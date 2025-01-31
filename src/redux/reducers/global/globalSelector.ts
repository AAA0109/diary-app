import { Map } from 'immutable';
import { DialogType } from 'models/common/dialogType';
import { createSelector } from 'reselect';

const getCaller = (state: Map<string, any>) => {
    return state.getIn(['global', 'temp', 'caller']);
};

const getProgress = (state: Map<string, any>) => {
    return state.getIn(['global', 'progress'], Map({})) as Map<string, any>;
};

const getFeedbackStatus = (state: Map<string, any>) => {
    return state.getIn(['global', 'sendFeedbackStatus']);
};

const getDialogState = (state: Map<string, any>, props: { type: DialogType }) => {
    return state.getIn(['global', 'dialog', props.type, 'open'], false);
};

const getGlobal = (state: Map<string, any>) => {
    return state.get('global');
};

const getCirclesLoaded = (state: Map<string, any>) => {
    return state.getIn(['circle', 'loaded'], false);
};

const getUserLoaded = (state: Map<string, any>) => {
    return state.getIn(['user', 'loaded'], false);
};

const getImageGalleryLoaded = (state: Map<string, any>) => {
    return state.getIn(['imageGallery', 'loaded'], false);
};

const getDefaultLoadData = (state: Map<string, any>) => {
    return state.getIn(['global', 'defaultLoadDataStatus'], false);
};

const getUserAuthUID = (state: Map<string, any>) => {
    return state.getIn(['authorize', 'uid']);
};

const getHeaderTitle = (state: Map<string, any>) => {
    return state.getIn(['global', 'headerTitle'], '');
};

const getNavigationStep = (state: Map<string, any>) => {
    return state.getIn(['global', 'navigationStep'], '');
};

const getEmotion = (state: Map<string, any>) => {
    return state.getIn(['global', 'emotion'], '');
};

/** **************************
 * Selectors
 ************************** */
const selectDialogState = () => {
    return createSelector([getDialogState], (state) => state);
};

const selectProgress = () => {
    return createSelector([getProgress], (progress) => progress);
};

const selectFeedbackStatus = () => {
    return createSelector([getFeedbackStatus], (status) => status);
};

const selectGlobal = () => {
    return createSelector([getGlobal], (status) => status);
};

const selectHeaderTitle = () => {
    return createSelector([getHeaderTitle], (title) => title);
};

const selectNavigationStep = () => {
    return createSelector([getNavigationStep], (step) => step);
};

const selectEmotion = () => {
    return createSelector([getEmotion], (emotion) => emotion);
};

const selectAllDataLoaded = () => {
    return createSelector(
        [getCirclesLoaded, getUserLoaded, getDefaultLoadData, getUserAuthUID],
        (circleLoaded, userLoaded, defaultDataLoaded, authUID) =>
            circleLoaded && userLoaded && defaultDataLoaded && authUID !== undefined,
    );
};

export const globalSelector = {
    getCaller,
    getGlobal,
    getFeedbackStatus,
    getProgress,
    getImageGalleryLoaded,
    selectDialogState,
    selectProgress,
    selectFeedbackStatus,
    selectGlobal,
    selectHeaderTitle,
    selectNavigationStep,
    selectAllDataLoaded,
    selectEmotion,
};
