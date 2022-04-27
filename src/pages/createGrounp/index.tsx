import { reducer } from "@/utils";
import { Input, Form, Select, Button, Modal, Collapse } from "antd";
import React, { useReducer } from "react";
import { useModel } from "umi";
import web3 from "@/assets/js/web3.ts";
import "./style.less";

const options = [2, 3, 4, 5, 6, 7];
const initState = {
  admin: [],
  visible: false,
};

const Index = () => {
  const [form] = Form.useForm();
  const { loginAccount } = useModel("global", ({ loginAccount }) => ({
    loginAccount,
  }));
  console.info("loginAccount", loginAccount);
  const [state, dispatch] = useReducer(reducer, initState);
  const { admin, visible } = state;
  const reset = () => {
    form.resetFields();
    form.setFieldsValue({ enode1: loginAccount.enode });
  };
  const typeChange = (v: number) => {
    let arr = [];
    for (let i = 1; i < v + 1; i++) {
      arr.push(i);
    }
    dispatch({
      admin: arr,
    });
    reset();
  };
  const createGroup = async () => {
    console.info(form.getFieldsValue());
    web3.setProvider(loginAccount.rpc);
    const length = admin.length;
    const res = await web3.smpc.createGroup(
      `${length}/${length}`,
      Object.values(form.getFieldsValue())
    );
    console.info("res", res);
  };
  console.info("admin", admin);
  return (
    <div className="create-grounp">
      <Form
        layout="vertical"
        form={form}
        onFinish={() => dispatch({ visible: true })}
      >
        <Form.Item>
          <Select
            onChange={typeChange}
            options={options.map((i) => ({
              label: `${i}/${i}模式`,
              value: i,
            }))}
          />
        </Form.Item>
        {admin.map((i: number, index: number) => (
          <Form.Item
            name={`enode${i}`}
            label={`管理人${i}`}
            required
            rules={[{ required: true, message: "必填" }]}
          >
            <Input disabled={!index} />
          </Form.Item>
        ))}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            创建共管帐户
          </Button>
          <Button onClick={reset}>重置</Button>
        </Form.Item>
      </Form>
      <Modal
        visible={visible}
        title="创建确认"
        onCancel={() => dispatch({ visible: false })}
        onOk={createGroup}
      >
        <h3>
          模式: {admin.length}/{admin.length}
        </h3>
        <Collapse expandIconPosition="right">
          <Collapse.Panel header="发起者" key={0}>
            {loginAccount.enode}
          </Collapse.Panel>
        </Collapse>
      </Modal>
    </div>
  );
};

export default Index;
