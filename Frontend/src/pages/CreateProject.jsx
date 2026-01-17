import useProjectMutation from "../hooks/apis/mutations/useProjectsMutation";
import { Button, Layout, Card, Typography, Space, Spin, Result } from "antd";
import { RocketOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject, isSuccess, isError, isPending, error } =
    useProjectMutation();

  const handleCreateProject = async (language) => {
    try {
      const result = await createProject(language);
      console.log("Project created:", result.data);
      if (result?.data?.projectId) navigate(`/project/${result.data.projectId}`);
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
            ) : (
              <Space size="middle">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleCreateProject("js")}
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
                  onClick={() => handleCreateProject("ts")}
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
