import { Button, Card, Form } from "antd";


import { AFormInput } from "@/components/AFormItem";
import AForm from "@/components/AFormItem/AForm";
import React from "react";

export default function Register() {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = React.useState(false);

  const onSubmit = async (values: any) => {
    console.log("폼 제출 성공:", values);
    // API 호출 등 추가 로직
    setSpinning(true);
    let ptg = -10;

  };
  const buttons = [<Button type="primary" htmlType="submit">제출</Button>,<Button type="primary" htmlType="submit">제출2</Button>];
        
  return (
    <Card style={{ width: 800, padding: 32, borderRadius: 8 }}>

      <AForm form={form} type="register" onSubmit={onSubmit} title="회원가입" buttonTop={buttons} messageKey="registerTab" >

        <tr>
          <AFormInput name="username" label="아이디" makeRule={{required:true,}} >
            <Button htmlType="button" onClick={()=> alert(1)} >버튼</Button>
            </AFormInput>
          <AFormInput name="password" label="비밀번호" type="password" makeRule={{required:true,}} />
        </tr>
        <tr>
          <AFormInput name="email" label="이메일" makeRule={{required:true,}} colspan={3} />
        </tr>
        
      </AForm>
    </Card>
  );
}
