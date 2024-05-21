
export function FilterIcon({ ...props }) {

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
                d="M22 6.5h-6M6 6.5H2"
            />
            <path
                stroke="#469AD0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
            />
            <path
                stroke="#0F344A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M22 17.5h-4M8 17.5H2M14 21a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
            />
        </svg>
    );
}

export default FilterIcon;
