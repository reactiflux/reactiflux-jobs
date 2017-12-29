import * as React from 'react';
import styled from 'styled-components';

const OfferContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
  
  &::after {
    content: ' ';
    display: block;
    height: 1px;
    background: #cccccc;
    margin: 20px 30px;
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 50px;
  }
`;

const Author = styled.strong`

`;

const Time = styled.time`
  border-bottom: 1px dotted #444;

  @media screen and (max-width: 768px) {
    display: block;
    margin: 10px 0 0 0;
    text-align: center;
  }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 5px 10px 2px 10px;
  background: #dd1d64;
  color: white;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 3px;
  font-size: 0.9em;
`;

export type OfferProps = {
  message: string,
  date: string,
  id: string,
  author: {
    name: string,
    id: number
  }
};

const HelpTrigger = styled.span`
  border-bottom: 1px dotted #222;
  cursor: help;
`;

const timeAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const diff = ((new Date()).getTime() - date.getTime()) / 1000;
  return Math.floor(diff / (3600 * 24));
};

const extractTags = (content: string): Array<string> => {
  return (content.match(/\[(.*?)\]/ig) || [])
    .map(tag => tag.replace('[', '').replace(']', ''))
    .filter(x => x.length < 15);
};

export const Offer = (props: OfferProps & { onClick: (event: React.MouseEvent<HTMLSpanElement>) => void}) => (
  <OfferContainer>
    {extractTags(props.message).map((tag, index) => <Tag key={index}>{tag}</Tag>)}
    <Time title={`${timeAgo(props.date)} day(s) ago`}>{(new Date(props.date)).toLocaleString()}</Time>

    <p dangerouslySetInnerHTML={{__html: props.message.replace(/\n/g, '<br />')}} />
    Posted by <Author title={props.id}>{props.author.name}</Author> 
    {' '}
    <HelpTrigger onClick={props.onClick}>how to contact this person?</HelpTrigger>
  </OfferContainer>
);