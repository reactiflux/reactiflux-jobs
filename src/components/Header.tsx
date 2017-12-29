import * as React from 'react';
import styled from 'styled-components';

const H1 = styled.h1`
  font-family: 'Space Mono', monospace;
  color: #02d8ff;
  font-size: 177px;
  font-weight: 700;
  position: relative;
  line-height: 1;
  margin: 0 0 20px 0;
  padding: 0;
  pointer-events: none;

  small {
    font-size: 42px;
    text-transform: uppercase;
    color: #dd1d64;
    position: absolute;
    top: 20px;
    right: 0;
  }

  @media screen and (max-width: 768px) {
    font-size: 50px;
    text-align: center;

    small {
      font-size: 36px;
      position: static;
    }
  }
`;

export const Header = (props: {
  children: React.ReactNode,
  subtitle: string
}) => (
  <H1>{props.children}<small>{props.subtitle}</small></H1>
);
