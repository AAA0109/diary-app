
export function MottoIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 32 32"
            {...props}
        >
            <circle
                cx="14.667"
                cy="18.667"
                r="8"
                fill="#469AD0"
                opacity="0.2"
            ></circle>
            <path
                fill="#469AD0"
                d="M29.227 7.493A1.333 1.333 0 0028 6.667h-2.667V4a1.333 1.333 0 00-.826-1.227 1.333 1.333 0 00-1.454.28l-4 4a1.332 1.332 0 00-.387.947v3.453l-2.946 2.934a1.334 1.334 0 000 1.893 1.335 1.335 0 001.893 0l2.934-2.947H24a1.333 1.333 0 00.947-.386l4-4a1.334 1.334 0 00.28-1.454z"
            ></path>
            <path
                stroke="#0F344A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 2.667A13.333 13.333 0 1029.333 16m-5.493 1.6v-.053a8 8 0 11-9.44-9.44"
            ></path>
        </svg>
    );
}

export default MottoIcon;
