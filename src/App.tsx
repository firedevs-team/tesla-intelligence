import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Link, Route, Routes, useNavigate } from "react-router";
import { ChinaPage, EuropePage, HomePage } from "./pages";
import styles from "./App.module.css";
const { Header, Footer } = Layout;

const App: React.FC = () => {
  let navigate = useNavigate();

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <img
              src="/src/assets/logo.svg"
              alt="Tesla Intelligence Logo"
              className={styles.logo}
            />
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={[
              {
                key: "home",
                label: "Home",
                onClick: () => {
                  navigate("/");
                },
              },
              {
                key: "china",
                label: "China",
                onClick: () => {
                  navigate("/china");
                },
              },
              {
                key: "europe",
                label: "Europe",
                onClick: () => {
                  navigate("/europe");
                },
              },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Layout>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="china" element={<ChinaPage />} />
            <Route path="europe" element={<EuropePage />} />
          </Routes>
        </Layout>
        <Footer style={{ textAlign: "center" }}>
          Create with ❤️ by{" "}
          <a href="https://github.com/firedevs-team">Firedevs</a>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
