const TaskDots = ({ value, fillColor }: any) => {
	return (
		<div style={{ display: "flex" }}>
			{value === 0 ? (
				<div></div>
			) : (
				Array.from({ length: value }, (_, index) => (
					<div
						key={index}
						style={{
							width: 10,
							height: 10,
							borderRadius: "50%",
							backgroundColor: fillColor,
							marginRight: 5,
						}}
					/>
				))
			)}
		</div>
	);
};

export default TaskDots;
