
export function InVisibleIcon({ ...props }) {

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
                d="M8.56 13a3.61 3.61 0 01-.14-1c0-1.98 1.6-3.58 3.58-3.58.347 0 .683.05 1 .141m0 6.878A3.581 3.581 0 0015.439 13"
            />
            <path
                stroke="#0F344A"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21.11 9.41c.9 1.41.9 3.78 0 5.19-2.29 3.6-5.58 5.68-9.11 5.68-.85 0-1.688-.12-2.5-.355M21 4.5l-17 17m11.654-17A9.155 9.155 0 0012 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19.493.775 1.032 1.48 1.61 2.107"
            />
        </svg>
    );
}

export default InVisibleIcon;
