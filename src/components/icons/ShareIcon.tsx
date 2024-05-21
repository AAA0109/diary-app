
export function ShareIcon({ ...props }) {

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
                stroke="#0F344A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zM14 17.5L9 14M14 6.5L9 10"
            />
            <path
                stroke="#469AD0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 5.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"
            />
            <path
                stroke="#0F344A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 18.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"
            />
        </svg>
    );
}

export default ShareIcon;
