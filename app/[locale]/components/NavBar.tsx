"use client";

import { Button, Col, Input, Row, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";

export default function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [_, setCookies] = useCookies(["token"]);

  const logout = () => {
    setCookies("token", "");
    window.localStorage.removeItem("userId");
  };

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          textAlign: "right",
          background: colorBgContainer,
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        }}>
        <Row>
          {/* <Col span={8} style={{ padding: 15 }}>
            <Input.Search placeholder='Search...'  allowClear />
          </Col> */}
          <Col span={8} offset={16}>
            <Button onClick={logout} icon={<PoweroffOutlined />} />
          </Col>
        </Row>
      </Header>
    </>
  );
}
