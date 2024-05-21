
export function CopyIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="24"
            fill="none"
            viewBox="0 0 30 24"
            {...props}
        >
            <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.088 17.842v-7.665c0-2.116 2.157-3.832 4.818-3.832h7.226M9.088 17.842c0 2.117 2.157 3.833 4.818 3.833h2.822c1.278 0 2.503-.404 3.407-1.123l4.404-3.503c.904-.72 1.411-1.694 1.411-2.71v-4.162c0-2.116-2.157-3.832-4.817-3.832M9.088 17.842c-2.66 0-4.818-1.715-4.818-3.832V6.345c0-2.117 2.157-3.833 4.818-3.833h7.227c2.66 0 4.817 1.716 4.817 3.833m-2.408 15.33v-1.916c0-2.117 2.157-3.833 4.817-3.833h2.41"
            ></path>
        </svg>
    );
}

export default CopyIcon;
