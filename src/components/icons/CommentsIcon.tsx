
export function CommentsIcon({ ...props }) {

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
                fill="#469AD0"
                d="M12.505 19.663a7.792 7.792 0 01-3.094-.655c-.06 0-.06-.06-.119-.06-.357-.118-.773-.178-1.308-.178-1.25 0-2.856.298-3.986.536.357-.536.714-1.13.892-1.547.476-.952.833-1.844.833-2.142 0-.06 0-.178-.06-.238a6.94 6.94 0 01-.713-3.093C5.01 8.182 8.4 4.85 12.505 4.85 16.609 4.85 20 8.182 20 12.227c0 4.104-3.331 7.436-7.495 7.436z"
            />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.459"
                d="M10.72 10.918h3.808M10.72 13.595h3.808"
            />
        </svg>
    );
}

export default CommentsIcon;
