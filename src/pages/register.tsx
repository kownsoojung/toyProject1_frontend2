import { Card, Col, Form, Input, Row } from "antd";
import Title from "antd/es/typography/Title";
import AFormItem from "@/components/AFormItem/AFormItem";
import styles from "@/components/AFormItem/AFormItem.module.css";

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
          <div
            className={styles["aform-layout"]}
            style={{ "--label-width": "120px" } as React.CSSProperties} // 여기서 변경
          >
            <Row gutter={16}> 
              <Col span={24}> 
                <AFormItem
                  name="id" label="아이디" required minLength={3} maxLengthInput={20} placeholder="아이디 입력"
                  pattern={{
                    regex: /^[A-Za-z0-9]+$/,
                    message: "아이디는 영어/숫자만 가능합니다",
                  }}
                />
              </Col>
              <Col span={24}> 
                <AFormItem
                  name="password" label="패스워드" type="password" required minLength={3} placeholder="비밀번호 입력"
                  pattern={{
                    regex: /^[A-Za-z0-9]+$/,
                    message: "패스워드는 영어/숫자만 가능합니다",
                  }}
                />
              </Col>
            </Row>
         </div>
          
        </Form>
      </Card>
    </div> 
  );
}

export default RegisterPage;