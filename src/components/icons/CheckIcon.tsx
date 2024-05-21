
export function CheckIcon({ ...props }) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="none"
            viewBox="0 0 35 35"
            {...props}
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7.292 18.958l5.833 5.834 14.583-14.584"
            ></path>
        </svg>
    );
}

export default CheckIcon;
