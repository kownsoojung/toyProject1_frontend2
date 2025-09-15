import { Card, Col, Form, Row, Button, message } from "antd";
import Title from "antd/es/typography/Title";
import AFormItem from "@/components/AFormItem/AFormItem";
import styles from "@/components/AFormItem/AFormItem.module.css";
import { useRef } from "react";

const errorKey = "form-error";

export default function AdminForm() {
  const [form] = Form.useForm();
  const isSubmitting = useRef(false);

  const fieldsConfig = [
    { name: "username", label: "아이디", required: true, minLength: 3, pattern: "numalpha", placeholder: "아이디 입력" },
    { name: "password", label: "비밀번호", type: "password", required: true, minLength: 6, pattern: "numalpha", placeholder: "비밀번호 입력" },
    { name: "email", label: "이메일", required: true, pattern: "email", placeholder: "aaa@bbb.ccc" },
    { name: "phone", label: "연락처", pattern: "phone", placeholder: "010-1234-5678" },
    { name: "company", label: "회사명", placeholder: "회사명 입력" },
    { name: "department", label: "부서", placeholder: "부서 입력" },
    { name: "position", label: "직급", placeholder: "직급 입력" },
    { name: "remarks", label: "비고", placeholder: "비고 입력" },
  ];

  const showError = (text: string) => {
    message.open({
      content: text,
      type: "error",
      duration: 2,
      key: errorKey,
    });
  };

  const onSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const values = await form.validateFields();
      console.log("폼 제출 성공:", values);
      message.success({ content: "폼이 정상적으로 제출되었습니다.", duration: 2 });
    } catch (errorInfo: any) {
      if (errorInfo.errorFields?.length > 0) {
        const firstError = errorInfo.errorFields[0].errors[0];
        showError(firstError);
      }
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: 600,
          padding: "32px 24px",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          관리자 폼
        </Title>

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <div
            className={styles["aform-layout"]}
            style={{ "--label-width": "120px" } as React.CSSProperties}
          >
            <Row gutter={16}>
              {fieldsConfig.map(field => (
                <Col span={24} key={field.name}>
                  <AFormItem {...field} />
                </Col>
              ))}

              <Col span={24} style={{ textAlign: "center", marginTop: 16 }}>
                <Button type="primary" onClick={onSubmit}>
                  제출
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>
    </div>
  );
}
