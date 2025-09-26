import { Button, Card, Form, Table } from "antd";


import { AFormInput } from "@/components/AFormItem";
import AForm from "@/components/AFormItem/AForm";
import { AFormSelect } from "@/components/AFormItem/AFormSelect";
import { AFormTextBox } from "@/components/AFormItem/AFormTextBox";
import { AFormCheckbox } from "@/components/AFormItem/AFormCheckbox";
import { AFormDate } from "@/components/AFormItem/AFormDate";
import { AFormDateRange } from "@/components/AFormItem/AFormDateRange";

export default function Register() {
  const [form] = Form.useForm();

  form.focusField
  const onSubmit = async (values: any) => {
    console.log("폼 제출 성공:", values);
  };
  const buttons = [<Button key="submit" type="primary" htmlType="submit">제출</Button>,<Button key="reset" danger onClick={() => form.resetFields()}>초기화</Button>];
        
  return (
    <>
    <Card style={{ width: 700, padding: 0, borderRadius: 8 }}>

      <AForm form={form} type="register" onSubmit={onSubmit} title="회원가입" buttonBottom={buttons} messageKey="registerTab" colCnt={2} labelSize={90} >
        <tr>
          <th className="required">아이디</th>
          <td>
            <div className="contains">
              <AFormInput name="username" label="아이디" makeRule={{required:true,}} />
              <Button htmlType="button" onClick={()=> alert(1)} >버튼</Button>
            </div>
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
          <th>내용</th>
          <td colSpan={3} className="txtShowCount"><AFormTextBox name="textbox" label="내용" showCount={true}/></td>          
        </tr>
        <tr>
          <th>체크박스</th>
          <td><AFormCheckbox name="checkbox" label="체크박스" value="Y"/></td>       
          <th>날짜</th>
          <td><AFormDate name="checkbox" label="체크박스" showTime="min" timeOnly step={5} /></td>       
        </tr>
        <tr>
          <th>날짜시작끝</th>
          <td colSpan={3}>
            <AFormDateRange label="조회일자" name="searchDate" showTime="hour" step={2} minDate="20250501"></AFormDateRange>  
          </td>       
        </tr>
      </AForm>
    </Card>
    <Card style={{ height: 300, display: 'flex', flexDirection: 'column' }}>
      <Table 
        dataSource={[]}
        pagination={{
          total: 10,
          pageSizeOptions : ["10", "20", "50", "100"],
          showSizeChanger: true,
          showQuickJumper: true,
          size: "small",
        }}
        scroll={{ y: 300 - 55 - 40 }} // Header + Pagination 높이 포함
        style={{ flex: 1 }}
        >
        <Table.Column key="age" title="age" dataIndex="age" width={100}/>
        <Table.Column key="name" title="name" dataIndex="name" />
      </Table>
    </Card>
    </>
  );
}
