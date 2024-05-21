
export function PlusOutlined({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="17"
            fill="none"
            viewBox="0 0 18 17"
            {...props}
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M11.5 8.5h-5M9 6v5"
            ></path>
            <circle
                cx="9"
                cy="8.5"
                r="7.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            ></circle>
        </svg>
    );
}

export default PlusOutlined;
