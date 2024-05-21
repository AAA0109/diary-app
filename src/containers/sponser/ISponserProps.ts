export interface ISponserProps {
    /**
     * Theme
     */
    history?: any;

    /**
     * Router match
     */
    location: any;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any, params?: any) => any;
}
