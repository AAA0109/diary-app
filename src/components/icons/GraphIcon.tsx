
export function GraphIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 32 32"
            {...props}
        >
            <rect
                width="25.685"
                height="27.113"
                x="5.313"
                y="3.887"
                fill="#469AD0"
                opacity="0.1"
                rx="5"
            ></rect>
            <path
                stroke="#469AD0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M28.514 26.88H8a6 6 0 01-6-6V1"
            ></path>
            <path
                stroke="#469AD0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.273 17.205l2.274-5.99c.545-1.438 2.442-1.748 3.416-.558l1.601 1.954a2 2 0 003.13-.046l5.488-7.114"
            ></path>
        </svg>
    );
}

export default GraphIcon;
