export const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return (
      <div style={{ textAlign: "left" }}>
        <div>
          {dateObj.getDate()} {dateObj.toLocaleString("default", { month: "short" })}
        </div>
        <div style={{ color: "#868F9E" }}>{dateObj.toLocaleString("default", { weekday: "short" })}</div>
      </div>
    );
  };
  