import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Row } from "./types/AuthorWorkLog";
import Badge from "./components/Badge";
import HalfCircleSpinner from "./components/Loader";

const URL = "https://mocki.io/v1/4770bb69-ee83-4271-a581-d8f5f15761ec";

function App() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [rows, setRows] = useState<Row[]>([]);
	const [summaryData, setSummaryData] = useState<any[]>([]);

	useEffect(() => {
		setTimeout(() => {
			axios
				.get(URL)
				.then((response) => {
					const data = response.data?.data;
					setRows(data.AuthorWorklog.rows);
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
					console.log(summaryData);
					setSummaryData(summaryData);
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoading(false));
		}, 3000);
	}, []);

	const generateSummaryData = (totalActivity: any) => {
		return totalActivity.map((acitivity: any) => {
			return (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}>
					<span style={{ fontSize: "10px" }}>{acitivity.name}</span>
					<Badge>{acitivity.value}</Badge>
				</div>
			);
		});
	};

	if (isLoading) return <HalfCircleSpinner />;
	else
		return (
			<div className="container">
				<table>
					<thead>
						<tr>
							<th>People</th>
							<th>Summary of all the Data</th>
							<th>...days</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, index) => (
							<tr key={index}>
								<td>{row.name}</td>
								<td colSpan={4}>{generateSummaryData(row.totalActivity)}</td>
								{row.dayWiseActivity.map((dayWiseActivity, index) => {
									const { date, items } = dayWiseActivity;
									return (
										<td style={{ fontSize: 10 }} key={index}>
											{items.children.map((child, index) => (
												<div key={index}>
													{child.label}-{child.count}
												</div>
											))}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
}
export default App;
