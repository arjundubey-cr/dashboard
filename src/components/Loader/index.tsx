import React, { CSSProperties } from 'react';
import styled from 'styled-components';

interface SpinnerProps {
  size?: number;
  color?: string;
  animationDuration?: number;
  className?: string;
  style?: CSSProperties;
}

const HalfSpinner = styled.div<SpinnerProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 100%;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .circle {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(${(props) => props.size}px / 10) solid transparent;
  }
  .circle.circle-1 {
    border-top-color: ${(props) => props.color};
    animation: half-circle-spinner-animation
      ${(props) => props.animationDuration}ms infinite;
  }
  .circle.circle-2 {
    border-bottom-color: ${(props) => props.color};
    animation: half-circle-spinner-animation
      ${(props) => props.animationDuration}ms infinite alternate;
  }
  @keyframes half-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HalfCircleSpinner: React.FC<SpinnerProps> = ({
  size = 60,
  color = '#000',
  animationDuration = 1000,
  className = '',
  style,
  ...props
}) => (
  <HalfSpinner
    size={size}
    color={color}
    animationDuration={animationDuration}
    className={`half-circle-spinner${className ? ' ' + className : ''}`}
    style={style}
    {...props}
  >
    <div className="circle circle-1" />
    <div className="circle circle-2" />
  </HalfSpinner>
);

export default HalfCircleSpinner;