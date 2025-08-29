import { Card, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Padding } from "@mui/icons-material";
import Title from "antd/es/typography/Title";
import AFormItem from "@/components/AFormItem";

function RegisterPage() {

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  return ( 
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
        padding: 16,
      }}
    >
      <Card style={{width:400, padding: "32px 24px",  borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}}>
        <Title level={2} style={{textAlign:"center", marginBottom:32}}>
          회원가입
        </Title>
        <Form
          name="complex-form"
          className={"login-form"}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <AFormItem name="id" label="id" required minLength={3} pattern={{ regex: /^[A-Za-z0-9]+$/, message: "아이디는 영어/숫자만 가능합니다" }}>
            <Input prefix={<UserOutlined className={"site-form-item-icon"} maxLength={20}  /> }/>
          </AFormItem>
          

          
        </Form>
      </Card>
    </div> 
  );
}

export default RegisterPage;