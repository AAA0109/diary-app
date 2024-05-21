
export function MessageIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="none"
            viewBox="0 0 26 26"
            {...props}
        >
            <path
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21.25 21.248c-3.566 3.566-8.845 4.336-13.166 2.338-.638-.256-1.16-.464-1.658-.464-1.384.008-3.108 1.35-4.004.456-.895-.896.448-2.62.448-4.014 0-.497-.2-1.01-.456-1.65-1.999-4.32-1.228-9.601 2.338-13.166C9.304.195 16.698.195 21.25 4.748c4.56 4.56 4.552 11.948 0 16.5z"
                clipRule="evenodd"
            ></path>
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.596 13.482h.01M12.919 13.482h.01M8.242 13.482h.01"
            ></path>
        </svg>
    );
}

export default MessageIcon;
