import { styled } from "@mui/styles";
import CoinIcon from "../../assets/images/coin.png"

const BountyBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: "10px 15px",
    borderRadius: "24px",
    backgroundColor: "#fff",
    fontSize: 12,
    fontWeight: 500,
    zIndex: 1,
}));

const BountyNumber = styled('span')(() => ({
    fontWeight: 800,
    color: "#469AD0",
    marginRight: 4,
}));

const BountyIcon = styled('img')(() => ({
    width: 14,
    height: 14,
    marginRight: 8,
}));

export function Bounty() {
    return (
        <BountyBox>
            <BountyIcon src={CoinIcon} alt="coin" />
            <BountyNumber>100</BountyNumber>
            PTS
        </BountyBox>
    );
}

export default Bounty;
