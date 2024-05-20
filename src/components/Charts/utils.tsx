import { TooltipProps } from "recharts";
import { formatDate } from "../../utils/formateDate";
import UserInfo from "../UserInfo";
import { StyledLogo } from "../common";
import GitPullRequest from "../../assets/git-pull-request.svg";
import GitMerge from "../../assets/git-merge.svg";
import CommentDiscussion from "../../assets/comment-discussion.svg";
import CodeReview from "../../assets/code-review.svg";
import Commit from "../../assets/commit.svg";
interface CustomTooltipProps extends TooltipProps<any, any> {
    metaType?: string;
    activityMeta: { [key: string]: string };
}
const ASSETS = {
	"PR Open": GitPullRequest,
	"PR Merged": GitMerge,
	"PR Comments": CommentDiscussion,
	"PR Reviewed": CodeReview,
	Commits: Commit,
};
export const CustomTooltip = ({ active, payload, label, ...props }: CustomTooltipProps) => {
    const { metaType, activityMeta } = props;
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip card">
                {metaType === "date" ? (
                    <div>{formatDate(label)}</div>
                ) : (
                    <UserInfo name={label} />
                )}
                {payload.map((item) => (
                    <div
                        key={item.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            margin: "5px 0",
                            gap: "10px",
                        }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <StyledLogo
                                // @ts-ignore
                                src={ASSETS[item.name]}
                                color={activityMeta[item.name]}
                            />
                            <span>{item.name}</span>
                        </div>
                        <div>{item.value}</div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};