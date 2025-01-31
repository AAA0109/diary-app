
export function TranslateIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <g
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                opacity="0.5"
            >
                <path d="M19.06 18.67l-2.14-4.27-2.14 4.27M15.17 17.91h3.52"/>
                <path d="M19.92 21.02c-.84.61-1.87.98-2.99.98a5.08 5.08 0 115.08-5.08M11.95 8.93C12 11 11 12 8.93 11.95H5.01C3 12 2 11 2 8.93V5.01c0-2.02 1-3.02 3.02-3.02h3.92c2.07 0 3.07 1 3.02 3.02M9.01 5.85H4.95M6.97 5.17v.68M7.99 5.84c0 1.75-1.37 3.17-3.05 3.17M9.01 9.01c-.73 0-1.39-.39-1.85-1.01M2 15c0 3.87 3.13 7 7 7l-1.05-1.75M22 9c0-3.87-3.13-7-7-7l1.05 1.75"/>
            </g>
        </svg>
    );
}

export default TranslateIcon;
