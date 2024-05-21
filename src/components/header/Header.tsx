import { styled } from "@mui/styles";
import BackButton from "components/backButton";
import { ReactElement } from "react";
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { useSelector } from 'redux/store';
import { IHeaderProps } from "./IHeader";

const HeaderStyle = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    margin: "10px 0",
}));

const FormerStyle = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
}));

const HeaderTitleStyle = styled('p')(() => ({
    fontSize: 20,
    fontWeight: 400,
    marginLeft: 10,
}));

const selectHeaderTitle = globalSelector.selectHeaderTitle();

export function Header({ child, trailing, beforeIcon, color }: IHeaderProps) {
    const title = useSelector((state: any) => selectHeaderTitle(state)) as string;

    return (
        <HeaderStyle>
            <FormerStyle>
                {beforeIcon ?? <BackButton />}
                {child ?? <HeaderTitleStyle style={{ color: color ?? 'inherit' }}>
                    {title}
                </HeaderTitleStyle>}
            </FormerStyle>
            {trailing!}
        </HeaderStyle>
    );
}

export default Header;
