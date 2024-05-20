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
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import GitPullRequest from "./assets/git-pull-request.svg";
import GitMerge from "./assets/git-merge.svg";
import CommentDiscussion from "./assets/comment-discussion.svg";
import CodeReview from "./assets/code-review.svg";
import styled from "styled-components";
import { aggregateCommitsOverTime } from "./utils/aggregateCommitsOverTime";
const URL = "https://mocki.io/v1/4770bb69-ee83-4271-a581-d8f5f15761ec";
const ASSETS = {
	"PR Open": GitPullRequest,
	"PR Merged": GitMerge,
	"PR Comments": CommentDiscussion,
	"PR Reviewed": CodeReview,
};
const StyledLogo = styled.img`
	display: inline-block;
	padding: 10px;
	height: 15px;
	width: 15px;
	border-radius: 10px;
	margin-right: 5px;
	border: 1px solid ${(props) => props.color || "#ffebeb"};
	background-color: ${(props) => props.color || "#ffebeb"};
`;

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
				console.log(aggregateCommitsOverTime(data.AuthorWorklog.rows));
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

	const generateBadgeDots = (items: any) => {
		return items.map((activity: any) => (
			<div key={activity.name} className="badge-dots">
				<TaskDots value={activity.count} fillColor={activity.fillColor} />
				<Badge hidden>{activity.count}</Badge>
			</div>
		));
	};
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip card">
					<UserInfo name={label} />
					{payload.map((item: any) => (
						<div
							key={item.name}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<div
								style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
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

	if (isLoading) return <HalfCircleSpinner />;
	return (
		<div className="container">
			<div className="dashboardContainer">
				<div className="tableContainer card">
					<div className="containerHeading">Activity Log</div>
					<div className="containerSubHeading">
						Get a bird's eye view of your team's daily work activity
					</div>
					<Table>
						<THead>
							<THeadTR>
								<TH>Name</TH>
								<TH>Summary</TH>
								{rows[0]?.dayWiseActivity.map((dayWiseActivity) => (
									<TH key={dayWiseActivity.date}>
										{formatDate(dayWiseActivity.date)}
									</TH>
								))}
							</THeadTR>
						</THead>
						<TBody>
							{rows.map((row, index) => (
								<TBodyTR key={index}>
									<TD>
										<UserInfo name={row.name} />
									</TD>
									<TD>{generateSummaryData(row.totalActivity)}</TD>
									{row.dayWiseActivity.map((dayWiseActivity, index) => (
										<TD key={index}>
											{generateBadgeDots(dayWiseActivity.items.children)}
										</TD>
									))}
								</TBodyTR>
							))}
						</TBody>
					</Table>
				</div>
				<div className="chartsContainer">
					<div className="card">
						<div className="containerHeading">PR Logs</div>
						<div className="containerSubHeading">Get overview of daily PR Activity</div>
						<ResponsiveContainer height="100%" width="100%">
							<BarChart data={summaryData}>
								<XAxis dataKey="name" tick={false} />
								<Tooltip content={<CustomTooltip />} />
								<Bar dataKey="PR Open" fill={activityMeta["PR Open"]} stackId="a" />
								<Bar
									dataKey="PR Merged"
									fill={activityMeta["PR Merged"]}
									stackId="a"
								/>
								<Bar
									dataKey="PR Reviewed"
									fill={activityMeta["PR Reviewed"]}
									stackId="a"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="card">
						<div className="containerHeading">Commit Logs</div>
						<div className="containerSubHeading">
							Get overview of daily commit activity
						</div>
						<ResponsiveContainer height="100%" width="100%">
							<LineChart data={aggregateCommitsOverTime(rows)}>
								<XAxis
									ticks={14}
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
								<Tooltip />
								<Line dataKey="value" stroke={activityMeta["Commits"]} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
