import { Avatar, Badge, Col, Row, Tooltip } from 'antd';
import React, { MutableRefObject, useRef } from 'react';
import { animated, config, useChain, useSpring, useTrail } from 'react-spring';
import styled from 'styled-components';

import theme, { device } from '../lib/theme';
import { numberWithCommas } from '../lib/utils';

interface UserListProps {
  data: Array<any>;
  match: MutableRefObject<string | null>;
}

const itemHeight = 80;

const UserListContainer = styled(animated.div)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  grid-auto-rows: min-content;
  grid-gap: 15px;
  width: 100%;
  overflow: hidden;
  will-change: padding, height;
  @media ${device.mobileS} {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
  }
  @media ${device.tablet} {
    grid-template-columns: repeat(3, minmax(100px, 1fr));
  }
  @media ${device.desktop} {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
  }
`;

const UserListItemContainer = styled(animated.div)`
  display: block;
  position: relative;
  width: max-content;
  height: ${itemHeight}px;
  will-change: transform, opacity;
`;

const UserListItem = styled(animated.div)`
  position: relative;
  overflow: hidden;
  padding: 10px;
  will-change: height, width;
  line-height: 20px;
  :hover {
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  }
`;

const UserBio = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[1]};
  margin-left: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 20px;
  width: 100%;
`;

const CountBadge = styled(Badge)`
  pointer: cursor;
  .ant-badge-count {
    background-color: ${({ theme }) => theme.colors.dark};
  }
`;

const UserList = ({ data, match }: UserListProps) => {
  const open = !!data.length;

  const springRef = useRef<any>();
  // expand the size of the list area
  const { size, opacity: opacityIgnored, ...rest } = useSpring<any>({
    ref: springRef,
    config: config.stiff,
    from: { size: '0%', padding: 0 },
    to: { size: open ? '100%' : '0%', padding: open ? 15 : 0 }
  });

  const trailRef = useRef<any>();
  // load in each user item at a time
  const trail = useTrail(data.length, {
    trail: 400 / data.length,
    ref: trailRef,
    config: config.stiff,
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? itemHeight : 0,
    width: open ? '100%' : '0%',
    from: { opacity: 0, x: 20, height: 0, width: '0%' }
  });

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, trailRef] : [trailRef, springRef], [
    0,
    open ? 0.1 : 0.6
  ]);

  // used to check if a match exists in a string, mostly used for bolding
  const matches = (val: string) => {
    return match.current
      ? val.toLocaleLowerCase().indexOf(match.current.toLocaleLowerCase()) > -1
      : false;
  };

  return (
    <UserListContainer style={{ ...rest, height: size }}>
      {trail.map(({ x, height, width, ...restTrail }, index) => (
        <UserListItemContainer
          key={data[index].node_id}
          style={{
            ...restTrail,
            width,
            transform: (x as any).interpolate((x) => `translate3d(0,${x}px,0)`)
          }}
        >
          <UserListItem style={{ height, width }}>
            <Row>
              <Col xs={{ span: 19, offset: 0 }} lg={{ span: 21, offset: 0 }}>
                <Row>
                  <a href={data[index].url}>
                    <Avatar size={24} src={data[index].avatar_url} />
                    {data[index].name
                      ? data[index].name.split(' ').map((part, index) => (
                          <span
                            key={`${part}-${index}`}
                            style={{
                              marginLeft: index === 0 ? 10 : 5,
                              color: theme.colors.electronBlue,
                              fontWeight: matches(part) ? 600 : 500,
                              fontSize: theme.fontSizes[2],
                              lineHeight: '24px'
                            }}
                          >
                            {part}
                          </span>
                        ))
                      : null}
                    <span
                      style={{
                        marginLeft: 10,
                        fontWeight: matches(data[index].login) ? 600 : 500,
                        fontSize: theme.fontSizes[2],
                        lineHeight: '24px',
                        color: 'rgba(0, 0, 0, 0.65)'
                      }}
                    >
                      {data[index].login}
                    </span>
                  </a>
                </Row>
                {data[index].bio ? (
                  <Row>
                    <Tooltip title={data[index].bio} placement="bottom">
                      <UserBio style={{ paddingRight: 10 }}>
                        {data[index].bio}
                      </UserBio>
                    </Tooltip>
                  </Row>
                ) : null}
                <Row>
                  <span
                    style={{ fontSize: theme.fontSizes[0], marginLeft: 34 }}
                  >
                    {data[index].location}
                  </span>
                </Row>
              </Col>
              <Col xs={{ span: 5, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <Row gutter={[0, 16]}>
                  <Col>
                    <Tooltip
                      title={`${
                        data[index].followers
                          ? numberWithCommas(data[index].followers)
                          : '-'
                      } Followers`}
                    >
                      <a href={data[index].followers_url}>
                        <CountBadge
                          overflowCount={999}
                          count={data[index].followers || '-'}
                        />
                      </a>
                    </Tooltip>
                  </Col>
                </Row>
                <Row gutter={[0, 16]}>
                  <Col>
                    <Tooltip
                      title={`Following ${
                        data[index].following
                          ? numberWithCommas(data[index].following)
                          : '-'
                      }`}
                    >
                      <a href={data[index].following_url}>
                        <CountBadge
                          overflowCount={999}
                          count={data[index].following || '-'}
                        />
                      </a>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </UserListItem>
        </UserListItemContainer>
      ))}
    </UserListContainer>
  );
};

export default UserList;
