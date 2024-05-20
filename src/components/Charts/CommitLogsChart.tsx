import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { aggregateCommitsOverTime } from "../../utils/aggregateCommitsOverTime";
import { CustomTooltip } from "./utils";
import { Row } from "../../types/AuthorWorkLog";
interface TProp {
    rows: Row[],
    activityMeta: { [key: string]: string};
}
const CommitLogsChart = ({rows, activityMeta}: TProp) => {
	return (
		<div className="card">
			<div className="containerHeading">Commit Logs</div>
			<div className="containerSubHeading">Get overview of daily commit activity</div>
			<ResponsiveContainer height="100%" width="100%">
				<LineChart data={aggregateCommitsOverTime(rows)}>
					<XAxis
						dataKey="label"
						tickFormatter={(value) => {
							const dateObj = new Date(value);
							return (
								dateObj.getDate() +
								" " +
								dateObj.toLocaleString("default", { month: "short" })
							);
						}}
					/>
					<Tooltip content={<CustomTooltip metaType="date" activityMeta={activityMeta}/>} />
					<Line
						dataKey="Commits"
						type="linear"
						stroke={activityMeta["Commits"]}
						fill={activityMeta["Commits"]}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default CommitLogsChart;
