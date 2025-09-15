import { Card, Col, Form, Input, Row, Button, message } from "antd";
import Title from "antd/es/typography/Title";
import AFormItem from "@/components/AFormItem/AFormItem";
import styles from "@/components/AFormItem/AFormItem.module.css";
import { useRef } from "react";


const errorKey = "form-error";

export default function AdminForm() {
  const [form] = Form.useForm();
  const isSubmitting = useRef(false);

   const showError = (text: string) => {
    message.open({
      content: text,
      type: "error",
      duration: 2,
      key: errorKey, // 같은 key면 기존 메시지 삭제 후 새로 표시
    });
  };
  
  const onSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const values = await form.validateFields();
      console.log("폼 제출 성공:", values);
      message.success("폼이 정상적으로 제출되었습니다.", 2);
    } catch (errorInfo: any) {
      if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
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
              {/* 필드 예시 8개 */}
              <Col span={24}>
                <AFormItem name="username" label="아이디" required minLength={3} placeholder="아이디 입력" pattern="numalpha" />
              </Col>
              <Col span={24}>
                <AFormItem name="password" label="비밀번호" type="password" required minLength={6} placeholder="비밀번호 입력" pattern="numalpha" />
              </Col>
              <Col span={24}>
                <AFormItem name="email" label="이메일" required placeholder="aaa@bbb.ccc" pattern="email" />
              </Col>
              <Col span={24}>
                <AFormItem name="phone" label="연락처" placeholder="010-1234-5678" pattern="phone" />
              </Col>
              <Col span={24}>
                <AFormItem name="company" label="회사명" placeholder="회사명 입력" />
              </Col>
              <Col span={24}>
                <AFormItem name="department" label="부서" placeholder="부서 입력" />
              </Col>
              <Col span={24}>
                <AFormItem name="position" label="직급" placeholder="직급 입력" />
              </Col>
              <Col span={24}>
                <AFormItem name="remarks" label="비고" placeholder="비고 입력" />
              </Col>

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
