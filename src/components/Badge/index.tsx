import styled from "styled-components"

interface BadgeProps {
  px?: number;
  py?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
}

const Badge = styled.span<BadgeProps>`
  border-radius: 9999px;
  display: inline-block;
  font-weight: normal;
  letter-spacing: 0.0375em;
  line-height: 1.125;
  text-transform: uppercase;
  padding: ${(props) => `${props.py}px ${props.px}px`};
  background-color: gray;
  font-size: 0.8rem;
  color: white;
`

Badge.displayName = 'Badge'

Badge.defaultProps = {
  px: 9,
  py: 2,
  bg: 'primary',
  color: 'white',
  fontSize: 1
}

export default Badge