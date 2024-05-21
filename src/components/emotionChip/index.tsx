import { IEmotionChipComponentProps } from "./IEmotionChipComponentProps";
import { Chip, styled } from "@mui/material";
import { TopicThemeList } from "constants/topicThemeList";

const EmotionChip = styled(Chip)(({ theme }) => ({
    borderRadius: '8px',
}))

export function EmotionChipComponent(props: IEmotionChipComponentProps) {
    return (
        <EmotionChip variant="outlined" color={TopicThemeList[props.emotion?.toLowerCase() ?? "default"]} onDelete={props.onDelete} label={props.emotion} />
    );
}

export default EmotionChipComponent;
