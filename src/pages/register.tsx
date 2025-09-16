import { Card, Form, Button, message } from "antd";
import Title from "antd/es/typography/Title";
import AFormItem from "@/components/AFormItem/AFormItem";
import { useRef } from "react";

const errorKey = "form-error";

export default function Register() {
  const [form] = Form.useForm();
  const isSubmitting = useRef(false);

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

        <Form form={form} layout="horizontal">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <colgroup>
              <col style={{ width: 100 }} /> {/* 첫 번째 컬럼: label */}
              <col style={{ width: "auto" }} /> {/* 두 번째 컬럼: input */}
              <col style={{ width: 100 }} /> {/* 첫 번째 컬럼: label */}
              <col style={{ width: "auto" }} /> {/* 두 번째 컬럼: input */}
            </colgroup>
            <tbody>
              {/* 1번째 row: 아이디 / 비밀번호 */}
              <tr>
                <AFormItem
                  name="username"
                  label="아이디"
                  required
                  minLength={3}
                  pattern="numalpha"
                />
                <AFormItem
                  name="password"
                  label="비밀번호"
                  type="password"
                  required
                  minLength={6}
                  pattern="numalpha"
                />
              </tr>

              {/* 2번째 row: 이메일 */}
              <tr>
                <AFormItem
                  name="email"
                  label="이메일"
                  required
                  pattern="email"
                  colspan={3} // 한 줄 전체 차지
                />
              </tr>

              {/* 3번째 row: 연락처 */}
              <tr>
                <AFormItem
                  name="phone"
                  label="연락처"
                  pattern="phone"
                  colspan={3}
                />
              </tr>

              {/* 4번째 row: 회사명 / 부서 */}
              <tr>
                <AFormItem
                  name="company"
                  label="회사명"
                />
                <AFormItem
                  name="department"
                  label="부서"
                />
              </tr>

              {/* 5번째 row: 직급 / 비고 */}
              <tr>
                <AFormItem
                  name="position"
                  label="직급"
                />
                <AFormItem
                  name="remarks"
                  label="비고"
                />
              </tr>

              {/* 마지막 row: 제출 버튼 */}
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                  <Button type="primary" onClick={onSubmit}>
                    제출
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Card>
    </div>
  );
}
