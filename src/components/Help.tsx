import * as React from 'react';
import styled from 'styled-components';

const HelpContainer = styled.div`
  position: fixed;
  width: 500px;
  max-width: 80vw;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px #444;
  z-index: 10;
  text-align: justify;

  top: 50%;
  left: 50%;

  transform: translateX(-50%) translateY(-50%);
`;

const HelpClose = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: black;
  color: white;
  position: absolute;
  top: -10px;
  right: -10px;
  cursor: pointer;

  &::after {
    font-weight: bold;
    content: 'X';
  }
`;

export const Help = (props: {
  children: React.ReactNode,
  onClick: (event: React.MouseEvent<HTMLSpanElement>) => void
}) => (
  <HelpContainer>
    <HelpClose onClick={props.onClick} />
    {props.children}
  </HelpContainer>
);