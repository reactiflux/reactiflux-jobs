import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const Symbol = styled.div`
  border-radius: 50%;
  width: 10em;
  height: 10em; 
  margin: 0px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid #02d8ff;
  border-right: 1.1em solid #b9f4ff;
  border-bottom: 1.1em solid #b9f4ff;
  border-left: 1.1em solid #b9f4ff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;

  &::after {
    border-radius: 50%;
    width: 10em;
    height: 10em;  
  }

  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export class LoadingIndicator extends React.Component {

  render() {
    return (
      <Container>
        <Symbol />
      </Container>      
    );
  }

  componentDidMount() {
    document.getElementsByTagName('body')[0].scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }
}