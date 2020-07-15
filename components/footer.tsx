import { LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { device } from '../lib/theme';

export interface LayoutProps {
  disclaimer?: string;
}

const ConnectSocial = styled.div`
  font-size: 32px;
  .anticon {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.dark};
  }
  .anticon:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterContent = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media ${device.mobileS} {
    justify-content: flex-start;
  }
  @media ${device.tablet} {
    justify-content: flex-end;
  }
`;

const Footer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Row
      gutter={[16, 16]}
      style={{ width: '100%', margin: 0, padding: '32px 0' }}
    >
      <Col xs={{ span: 22, offset: 1 }} lg={{ span: 4, offset: 2 }}>
        <ConnectSocial>
          <a href="https://www.linkedin.com/in/jonathan-gertig-02077944/">
            <LinkedinOutlined />
          </a>
          <a href="https://twitter.com/JGertig">
            <TwitterOutlined />
          </a>
        </ConnectSocial>
      </Col>
      <FooterContent xs={{ span: 22, offset: 1 }} lg={{ span: 16, offset: 0 }}>
        <p>&copy; Jonathan Gertig 2020</p>
      </FooterContent>
      {children}
    </Row>
  );
};

export default Footer;
