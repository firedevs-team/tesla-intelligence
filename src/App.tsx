import { GithubOutlined } from "@ant-design/icons";
import { ConfigProvider, Layout, theme } from "antd";
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
        <Header className={styles.header}>
          <Link to="/">
            <img
              src={logo}
              alt="Tesla Intelligence Logo"
              className={styles.logo}
            />
          </Link>
          <div style={{ flex: 1 }} />

          {/* TODO: cambiar por un menu cuando haga falta */}
          <a
            href="https://github.com/firedevs-team/tesla-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            <GithubOutlined style={{ fontSize: "24px", color: "white" }} />
          </a>
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
