import { Row } from "../types/AuthorWorkLog";

export function aggregateCommitsOverTime(dataArray: Row[]) {
    const commitsPerDay: {label: string, value: number}[] = [];
  
    dataArray.forEach(data => {
      data.dayWiseActivity.forEach(dayActivity => {
        const date = dayActivity.date;
        const commits = dayActivity.items.children.find(item => item.label === "Commits")?.count ?? "0";
  
        const existingEntry = commitsPerDay.find(entry => entry.label === date);
        if (existingEntry) {
          existingEntry.value += parseInt(commits, 10);
        } else {
          commitsPerDay.push({ label: date, value: parseInt(commits, 10) });
        }
      });
    });  
    return commitsPerDay;
}