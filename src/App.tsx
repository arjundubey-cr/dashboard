import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row } from "./types/AuthorWorkLog";
import Badge from "./components/Badge";
import HalfCircleSpinner from "./components/Loader";
import TaskDots from "./components/TaskDots";
import UserInfo from "./components/UserInfo";
import { Table, THead, THeadTR, TH, TBody, TBodyTR, TD } from "./components/Table";
import "./App.css";
import { formatDate } from "./utils/formateDate";

const URL = "https://mocki.io/v1/4770bb69-ee83-4271-a581-d8f5f15761ec";

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [rows, setRows] = useState<Row[]>([]);
	const [activityMeta, setActivityMeta] = useState<{ [key: string]: string }>({});
	const [summaryData, setSummaryData] = useState<any[]>([]);

	useEffect(() => {
		axios
			.get(URL)
			.then((response) => {
				const data = response.data?.data;
				const activityMeta = data.AuthorWorklog.activityMeta.reduce(
					(acc: { [key: string]: string }, item: any) => {
						acc[item.label] = item.fillColor;
						return acc;
					},
					{},
				);
				const summaryData = data.AuthorWorklog.rows.map((row: any) => {
					const totalActivity = row.totalActivity.reduce((acc: any, item: any) => {
						acc[item.name] = item.value;
						return acc;
					}, {});
					return {
						name: row.name,
						daysActive: row.activeDays.days,
						burnout: row.activeDays.isBurnOut ? "Yes" : "No",
						insights: row.activeDays.insight.join(", "),
						incidentAlert: totalActivity["Incident Alert"],
						incidentResolved: totalActivity["Incident Resolved"],
						commits: totalActivity["Commits"],
						"PR Open": totalActivity["PR Open"],
						"PR Merged": totalActivity["PR Merged"],
						"PR Comments": totalActivity["PR Comments"],
						"PR Reviewed": totalActivity["PR Reviewed"],
						dayWiseActivity: row.dayWiseActivity,
					};
				});
				setActivityMeta(activityMeta);
				setRows(data.AuthorWorklog.rows);
				setSummaryData(summaryData);
			})
			.catch((error) => console.log(error))
			.finally(() => setIsLoading(false));
	}, []);

	const generateSummaryData = (totalActivity: any) => {
		return totalActivity.map((activity: any) => (
			<div
				key={activity.name}
				className="summary-item"
				style={{ borderRight: `2px solid ${activityMeta[activity.name]}` }}>
				<span className="summary-label">{activity.name}</span>
				<Badge>{activity.value}</Badge>
			</div>
		));
	};

	const generateBadgeDots = ( items: any) => {
		return items.map((activity: any) => (
			<div
				key={activity.name}
				className="badge-dots">
				<TaskDots value={activity.count} fillColor={activity.fillColor} />
				<Badge hidden>{activity.count}</Badge>
			</div>
		));
	};

	if (isLoading) return <HalfCircleSpinner />;
	return (
		<div className="container">
			<div className="dashboardContainer">
				<div className="tableContainer card">
					<div className="containerHeading">Activity Log</div>
					<div className="containerSubHeading">Get a bird's eye view of your team's daily work activity</div>
					<Table>
						<THead>
							<THeadTR>
								<TH>Name</TH>
								<TH>Summary</TH>
								{rows[0]?.dayWiseActivity.map((dayWiseActivity) => (
									<TH key={dayWiseActivity.date}>{formatDate(dayWiseActivity.date)}</TH>
								))}
							</THeadTR>
						</THead>
						<TBody>
							{rows.map((row, index) => (
								<TBodyTR key={index}>
									<TD valign="top" align="left">
										<UserInfo name={row.name} />
									</TD>
									<TD>{generateSummaryData(row.totalActivity)}</TD>
									{row.dayWiseActivity.map((dayWiseActivity, index) => (
										<TD key={index}>
											{generateBadgeDots(
												dayWiseActivity.items.children,
											)}
										</TD>
									))}
								</TBodyTR>
							))}
						</TBody>
					</Table>
				</div>
				<div className="chartsContainer">

				</div>
			</div>
		</div>
	);
};

export default App;
