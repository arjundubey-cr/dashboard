export interface ActivityMeta {
	label: string;
	fillColor: string;
}

export interface TotalActivity {
	name: string;
	value: string;
}

export interface DayWiseActivityItem {
	count: string;
	label: string;
	fillColor: string;
}

export interface DayWiseActivity {
	date: string;
	items: {
		children: DayWiseActivityItem[];
	};
}

export interface ActiveDays {
	days: number;
	isBurnOut: boolean;
	insight: string[];
}

export interface Row {
	name: string;
	totalActivity: TotalActivity[];
	dayWiseActivity: DayWiseActivity[];
	activeDays: ActiveDays;
}

export interface AuthorWorklog {
	activityMeta: ActivityMeta[];
	rows: Row[];
}

export interface Data {
	AuthorWorklog: AuthorWorklog;
}

export interface RootObject {
	data: Data;
}
export interface Summary {
	name: string;
	burnout: string;
	insights: string;
	incidentAlert: number;
	incidentResolved: number;
	commits: number;
	"PR Open": number;
	"PR Merged": number;
	"PR Comments": number;
	"PR Reviewed": number;
	dayWiseActivity: DayWiseActivity[];
  }