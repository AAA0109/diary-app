
export function AddRoundedIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="31"
            fill="none"
            viewBox="0 0 31 31"
            {...props}
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 16h-8M16 12v8"
            ></path>
            <circle
                cx="16"
                cy="16"
                r="13"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            ></circle>
        </svg>
    );
}

export default AddRoundedIcon;
