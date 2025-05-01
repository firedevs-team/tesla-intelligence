import React from "react";
import { Button, Layout } from "antd";
import { QuaterlySalesChart } from "../../components";
import { useNavigate } from "react-router";

const { Content } = Layout;

interface WithSeeMoreProps {
  children: React.ReactNode;
  onClick: () => void;
}
const WithSeeMore: React.FC<WithSeeMoreProps> = (props) => {
  const { children, onClick } = props;

  const handleClick = () => {
    onClick();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button
          color="primary"
          variant="link"
          style={{
            position: "relative",
            bottom: "-25px",
          }}
          onClick={handleClick}
        >
          See more
        </Button>
      </div>
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
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
      <WithSeeMore onClick={() => navigate("/europe")}>
        <QuaterlySalesChart title="Europe 🇪🇺 Quarterly Sales" region="EUROPE" />
      </WithSeeMore>
      <br />
      <QuaterlySalesChart title="ROW 🌏 Quarterly Sales" region="ROW" />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Content>
  );
};

export default Home;
