import styled from "styled-components";

export const StyledLogo = styled.img`
	display: inline-block;
	padding: 10px;
	height: 15px;
	width: 15px;
	border-radius: 10px;
	margin-right: 5px;
	border: 1px solid ${(props) => props.color || "#ffebeb"};
	background-color: ${(props) => props.color || "#ffebeb"};
`;