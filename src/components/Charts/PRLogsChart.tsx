import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Summary } from "../../types/AuthorWorkLog";
import { CustomTooltip } from "./utils";

interface TProp {
	summaryData: Summary[];
	activityMeta: { [key: string]: string };
}

const PRLogsChart = ({ summaryData, activityMeta }: TProp) => {
	return (
		<div className="card">
			<div className="containerHeading">PR Logs</div>
			<div className="containerSubHeading">Get overview of daily PR Activity</div>
			<ResponsiveContainer height="100%" width="100%">
				<BarChart data={summaryData}>
					<XAxis dataKey="name" tick={false} />
					<Tooltip content={<CustomTooltip activityMeta={activityMeta} />} />
					<Bar dataKey="PR Open" fill={activityMeta["PR Open"]} stackId="a" />
					<Bar dataKey="PR Merged" fill={activityMeta["PR Merged"]} stackId="a" />
					<Bar dataKey="PR Reviewed" fill={activityMeta["PR Reviewed"]} stackId="a" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default PRLogsChart;
