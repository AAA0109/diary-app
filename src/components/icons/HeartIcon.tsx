
export function HeartIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.7 11.941C3.876 9.37 4.839 6.43 7.539 5.56a4.612 4.612 0 014.17.7c1.116-.863 2.742-1.155 4.16-.7 2.7.87 3.67 3.81 2.847 6.382-1.282 4.077-7.008 7.218-7.008 7.218S6.025 16.066 4.7 11.942z"
                clipRule="evenodd"
            />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="1.459"
                d="M14.78 8.18a2.136 2.136 0 011.471 1.86"
            />
        </svg>
    );
}

export default HeartIcon;
