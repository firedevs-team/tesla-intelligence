import React from "react";
import { Layout } from "antd";
import { QuaterlySalesChart } from "../../components";

const { Content } = Layout;

const Home: React.FC = () => (
  <Content
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <br />
    <br />

    <QuaterlySalesChart title="Global 🌎 Quarterly Sales" region="GLOBAL" />
    <br />
    <QuaterlySalesChart title="China 🇨🇳 Quarterly Sales" region="CHINA" />
    <br />
    <QuaterlySalesChart title="USA 🇺🇸 Quarterly Sales" region="USA" />
    <br />
    <QuaterlySalesChart title="Europe 🇪🇺 Quarterly Sales" region="EUROPE" />
    <br />
    <QuaterlySalesChart title="ROW 🌏 Quarterly Sales" region="ROW" />
    <br />
    <br />
    <br />
    <br />
    <br />
  </Content>
);

export default Home;
