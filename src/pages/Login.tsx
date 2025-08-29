import { Form, Input, Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 로그인 처리
  const handleLogin = (values: { username: string; password: string }) => {
    console.log("로그인 시도:", values);

    // 임시 예시: localStorage 로그인 상태 저장
    localStorage.setItem("isLoggedIn", "true");

    // 로그인 후 메인 페이지 이동
    navigate("/");
  };

  // 회원가입 이동
  const handleJoin = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Title level={2} style={{ marginBottom: 24 }}>
        로그인
      </Title>

      <Form
        form={form}
        layout="vertical"
        style={{ width: 300 }}
        onFinish={handleLogin}
      >
        <Form.Item
          label="아이디"
          name="username"
          rules={[{ required: true, message: "아이디를 입력하세요" }]}
        >
          <Input placeholder="아이디 입력" maxLength={20} />
        </Form.Item>

        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력하세요" }]}
        >
          <Input.Password placeholder="비밀번호 입력" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              로그인
            </Button>
            <Button
              onClick={() => {
                form.resetFields(); // 입력값 초기화
              }}
            >
              초기화
            </Button>
            <Button onClick={handleJoin}>회원가입</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
