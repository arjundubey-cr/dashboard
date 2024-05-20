import styled from "styled-components";

const variables = {
	borderRadius: "16px",
	mdSpacing: "16px",
	smSpacing: "8px",
	lgSpacing: "32px",
	sm: "37.5em",
	md: "48em",
	lg: "64em",
	boxShadow:
		"0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11),0 4px 4px rgba(0, 0, 0, 0.11), 0 6px 8px rgba(0, 0, 0, 0.11), 0 8px 16px rgba(0, 0, 0, 0.11)",
};
export const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	text-align: center;
	border-radius: ${variables.borderRadius};
	overflow: none;
	table-layout: auto
`;

export const THead = styled.thead`
	position: sticky;
	z-index: 100;
`;

export const THeadTR = styled.tr`
	background: #f5f5f5;
	
`;

export const TH = styled.th`
	padding: ${variables.smSpacing};
	color: #212121;
	text-transform: capitalize;
	font-weight: 600;
	font-size: 14px;
	&:nth-child(1){
        position: sticky;
        left: 0;
        z-index: 1;
		background: #f5f5f5;
    }
	&:nth-child(2){
        position: sticky;
        left: 200px;
        z-index: 1;
		background: #f5f5f5;
    }
`;

export const TBody = styled.tbody``;

export const TBodyTR = styled.tr`
	background: #fff;
`;

export const TD = styled.td`
	padding: ${variables.smSpacing};
	border: 1px solid #ededed;
	font-size: 14px;
	width: 100px;
	&:nth-child(1){
        position: sticky;
        left: 0;
        z-index: 1;
		background: white;
    }
	&:nth-child(2){
        position: sticky;
        left: 200px;
        z-index: 1;
		background: white;
    }
`;
