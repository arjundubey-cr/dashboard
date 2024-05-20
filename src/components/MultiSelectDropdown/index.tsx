import { useState } from "react";
import "./styles.css";

interface Option {
	id: string;
	title: string;
}

interface MultiSelectDropdownProps {
	options: Option[];
	selected: string[];
	toggleOption: (id: string, type: string) => void;
	type: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
	options,
	selected,
	toggleOption,
	type,
}) => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	return (
		<div className="multi-select-dropdown">
			<div
				className="multi-select-dropdown__selected"
				onClick={() => {
					setShowDropdown(!showDropdown);
				}}>
				<div>{selected.length} selected</div>
			</div>
			{showDropdown && (
				<ul className="multi-select-dropdown__options">
					{options.map((option) => {
						const isSelected = selected.includes(option.id);
						return (
							<li
								key={option.id}
								className="multi-select-dropdown__option"
								onClick={() => toggleOption(option.id, type)}>
								<input
									type="checkbox"
									checked={isSelected}
                                    readOnly
									className="c-multi-select-dropdown__option-checkbox"></input>
								<span>{option.title}</span>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
