import useProjectMutation from "../hooks/apis/mutations/useProjectsMutation";
import {
  Button,
  Layout,
  Card,
  Typography,
  Space,
  Spin,
  Result,
  Input,
} from "antd";

import {
  RocketOutlined,
  PlusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { createProject, isSuccess, isError, isPending, error } =
    useProjectMutation();

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setProjectName("");
  };

  const handleCancel = () => {
    setSelectedLanguage(null);
    setProjectName("");
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      const result = await createProject({
        language: selectedLanguage,
        projectName: projectName.trim(),
      });
      console.log("Project created:", result.data);
      if (result?.data?.projectId)
        navigate(`/project/${result.data.projectId}`);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const layoutStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const headerStyle = {
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 48px",
  };

  const contentStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
  };

  const cardStyle = {
    width: 500,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  };

  const footerStyle = {
    background: "transparent",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
  };

  const buttonStyle = {
    height: 50,
    paddingInline: 32,
    fontSize: 16,
    borderRadius: 8,
    border: "none",
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Title level={2} style={{ color: "white", margin: 0 }}>
          <RocketOutlined style={{ marginRight: 12 }} />
          CodeSandBox
        </Title>
      </Header>
      <Content style={contentStyle}>
        <Card style={cardStyle} hoverable>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <RocketOutlined style={{ fontSize: 64, color: "#764ba2" }} />
            <Title level={3}>Create a New Project</Title>
            <Text type="secondary">
              Spin up a new React playground in seconds
            </Text>

            {isPending ? (
              <Spin size="large" tip="Creating your project..." />
            ) : isSuccess ? (
              <Result
                status="success"
                title="Project Created!"
                subTitle="Your playground is ready to go"
              />
            ) : isError ? (
              <Result
                status="error"
                title="Creation Failed"
                subTitle={error?.message || "Something went wrong"}
              />
            ) : selectedLanguage ? (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Text strong>
                  Creating{" "}
                  {selectedLanguage === "ts" ? "TypeScript" : "JavaScript"}{" "}
                  Project
                </Text>
                <Input
                  placeholder="Enter project name (required)"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  size="large"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                  }}
                  status={projectName.trim() === "" ? "error" : ""}
                />
                <Space size="middle">
                  <Button
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    style={{
                      ...buttonStyle,
                      background: "#f5f5f5",
                      color: "#666",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusCircleOutlined />}
                    onClick={handleCreateProject}
                    disabled={!projectName.trim()}
                    style={{
                      ...buttonStyle,
                      background:
                        selectedLanguage === "ts"
                          ? "linear-gradient(135deg, #3178c6 0%, #235a97 100%)"
                          : "linear-gradient(135deg, #f7df1e 0%, #e6c200 100%)",
                      color: selectedLanguage === "ts" ? "#fff" : "#000",
                    }}
                  >
                    Create
                  </Button>
                </Space>
              </Space>
            ) : (
              <Space size="middle">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleLanguageSelect("js")}
                  style={{
                    ...buttonStyle,
                    background:
                      "linear-gradient(135deg, #f7df1e 0%, #e6c200 100%)",
                    color: "#000",
                  }}
                >
                  JavaScript
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleLanguageSelect("ts")}
                  style={{
                    ...buttonStyle,
                    background:
                      "linear-gradient(135deg, #3178c6 0%, #235a97 100%)",
                  }}
                >
                  TypeScript
                </Button>
              </Space>
            )}
          </Space>
        </Card>
      </Content>
      <Footer style={footerStyle}>
        CodeSandBox © 2026 | Build amazing things
      </Footer>
    </Layout>
  );
};

export default CreateProject;
