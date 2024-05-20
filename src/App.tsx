import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Data, DayWiseActivity, DayWiseActivityItem, Row, Summary } from "./types/AuthorWorkLog";
import Badge from "./components/Badge";
import HalfCircleSpinner from "./components/Loader";
import TaskDots from "./components/TaskDots";
import UserInfo from "./components/UserInfo";
import { Table, THead, THeadTR, TH, TBody, TBodyTR, TD } from "./components/Table";
import "./App.css";
import { formatDate } from "./utils/formateDate";
import { MultiSelectDropdown } from "./components/MultiSelectDropdown";
import PRLogsChart from "./components/Charts/PRLogsChart";
import CommitLogsChart from "./components/Charts/CommitLogsChart";
const URL = "https://mocki.io/v1/4770bb69-ee83-4271-a581-d8f5f15761ec";

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [rows, setRows] = useState<Row[]>([]);
	const [activityMeta, setActivityMeta] = useState<{ [key: string]: string }>({});
	const [summaryData, setSummaryData] = useState<Summary[]>([]);
	const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

	useEffect(() => {
		axios
			.get(URL)
			.then((response: AxiosResponse<{data: Data}>) => {
				const data = response.data?.data;
				const activityMeta = data.AuthorWorklog.activityMeta.reduce(
					(acc: { [key: string]: string }, item) => {
						acc[item.label] = item.fillColor;
						return acc;
					},
					{},
				);
				const summaryData = data.AuthorWorklog.rows.map((row) => {
					const totalActivity = row.totalActivity.reduce((acc:{[key:string]:string}, item) => {
						acc[item.name] = item.value;
						return acc;
					}, {});
					return {
						name: row.name,
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
				//@ts-ignore
				setSummaryData(summaryData);
			})
			.catch((error) => console.log(error))
			.finally(() => setIsLoading(false));
	}, []);

	const generateSummaryData = (
		totalActivity: Array<{ name: string; value: string }>,
		filters: string[],
	) => {
		return totalActivity
			.filter((activity) => filters.length === 0 || filters.includes(activity.name))
			.map((activity) => (
				<div
					key={activity.name}
					className="summary-item"
					style={{ borderRight: `2px solid ${activityMeta[activity.name]}` }}>
					<span className="summary-label">{activity.name}</span>
					<Badge>{activity.value}</Badge>
				</div>
			));
	};

	const generateBadgeDots = (items: DayWiseActivityItem[], filters: string[]) => {
		return items
			.filter((activity) => filters.length === 0 || filters.includes(activity.label))
			.map((activity) => (
				<div key={activity.label} className="badge-dots">
					<TaskDots value={Number(activity.count)??0} fillColor={activity.fillColor} />
					<Badge hidden>{activity.count}</Badge>
				</div>
			));
	};

	const toggleOption = (id: string, filterType: string) => {
		const selectedFiltersCopy = { ...selectedFilters };
		if (selectedFiltersCopy[filterType]) {
			if (selectedFiltersCopy[filterType].includes(id)) {
				selectedFiltersCopy[filterType] = selectedFiltersCopy[filterType].filter(
					(ele: string) => ele !== id,
				);
			} else {
				selectedFiltersCopy[filterType].push(id);
			}
		} else {
			selectedFiltersCopy[filterType] = [id];
		}
		setSelectedFilters(selectedFiltersCopy);
	};

	if (isLoading) return <HalfCircleSpinner />;
	return (
		<div className="container">
			<div className="dashboardContainer">
				<div className="tableContainer card">
					<div>
						<div>
							<div className="containerHeading">Activity Log</div>
							<div className="containerSubHeading">
								Get a bird's eye view of your team's daily work activity
							</div>
						</div>
						<div className="filtersContainer">
							<div>
								<label>Name</label>
								<MultiSelectDropdown
									options={rows.map((ele) => ({ id: ele.name, title: ele.name }))}
									selected={selectedFilters["name"] || []}
									toggleOption={toggleOption}
									type="name"
								/>
							</div>
							<div>
								<label>Activity</label>
								<MultiSelectDropdown
									options={Object.keys(activityMeta).map((ele) => ({
										id: ele,
										title: ele,
									}))}
									selected={selectedFilters["activity"] || []}
									toggleOption={toggleOption}
									type="activity"
								/>
							</div>
						</div>
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
							{rows
								.filter((ele) => {
									return (
										(selectedFilters["name"] || []).length === 0 ||
										selectedFilters["name"].includes(ele.name)
									);
								})
								.map((row, index) => (
									<TBodyTR key={index}>
										<TD>
											<UserInfo name={row.name} />
										</TD>
										<TD>
											{generateSummaryData(
												row.totalActivity,
												selectedFilters["activity"] || [],
											)}
										</TD>
										{row.dayWiseActivity.map((dayWiseActivity, index) => (
											<TD key={index}>
												{generateBadgeDots(
													dayWiseActivity.items.children,
													selectedFilters["activity"] || [],
												)}
											</TD>
										))}
									</TBodyTR>
								))}
						</TBody>
					</Table>
				</div>
				<div className="chartsContainer">
					<PRLogsChart summaryData={summaryData} activityMeta={activityMeta} />
					<CommitLogsChart rows={rows} activityMeta={activityMeta} />
				</div>
			</div>
		</div>
	);
};

export default App;
