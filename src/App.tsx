import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Link, Navigate, Route, Routes } from "react-router";
import styles from "./App.module.css";
import logo from "./assets/logo.svg";
import { HomePage } from "./pages";
const { Header } = Layout;

const App: React.FC = () => {
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
              src={logo}
              alt="Tesla Intelligence Logo"
              className={styles.logo}
            />
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={[]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Layout>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
