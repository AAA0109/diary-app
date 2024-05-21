
export function PlusRounded({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            {...props}
        >
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path
                stroke="#FBFBFB"
                strokeLinecap="round"
                d="M8 4.571v6.858M11.43 8H4.573"
            />
        </svg>
    );
}

export default PlusRounded;
