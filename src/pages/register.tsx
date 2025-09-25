import { Button, Card, Form } from "antd";


import { AFormInput } from "@/components/AFormItem";
import AForm from "@/components/AFormItem/AForm";
import { AFormSelect } from "@/components/AFormItem/AFormSelect";

export default function Register() {
  const [form] = Form.useForm();

  form.focusField
  const onSubmit = async (values: any) => {
    console.log("폼 제출 성공:", values);
  };
  const buttons = [<Button key="submit" type="primary" htmlType="submit">제출</Button>,<Button key="reset" danger onClick={() => form.resetFields()}>초기화</Button>];
        
  return (
    <Card style={{ width: 700, padding: 0, borderRadius: 8 }}>

      <AForm form={form} type="search" onSubmit={onSubmit} title="회원가입" buttonBottom={buttons} messageKey="registerTab" colCnt={2} labelSize={90} >
        <tr>
          <th className="required">아이디</th>
          <td>
            <AFormInput name="username" label="아이디" makeRule={{required:true,}} />
            <Button htmlType="button" onClick={()=> alert(1)} >버튼</Button>
          </td>
          <th>패스워드</th>
          <td>
            <AFormInput  name="password" label="비밀번호" type="password" makeRule={{required:true,}} />
          </td>
          
        </tr>

        <tr>
          <th>이메일</th>
          <td colSpan={3}><AFormInput  name="email" label="이메일" makeRule={{required:true,}} /></td>          
        </tr>
        <tr>
          <th>코드조회</th>
          <td colSpan={3}><AFormSelect  name="test" label="TEST" makeRule={{required:true,}} codeParams={{codeName:'206'}} /></td>          
        </tr>
      </AForm>
    </Card>
  );
}
