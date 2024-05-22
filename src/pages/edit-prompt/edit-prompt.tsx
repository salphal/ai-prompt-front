import React, {useEffect} from "react";
import PromptMessage from "@/components/prompt-message";
import {useLocation} from "react-router-dom";
import {Col, Form, Row, Select} from "antd";
import usePromptStore, {setContextData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {PROMPT_FORM_KEYS, PROMPT_FORM_LABELS} from "@/pages/edit-prompt/constants/form.ts";
import {selectFilterOption} from "@/utils/antd/select.ts";
import useEditPromptStore, {setPromptFormData} from "@/pages/edit-prompt/store.ts";

export interface EditPromptProps {
  [key: string]: any;
}

const EditPrompt: React.FC<EditPromptProps> = (props: EditPromptProps) => {

  const location = useLocation();
  const {
    columnKeysOptions,
    contextKeysOptions,
    contextData
  } = usePromptStore(useShallow((state: any) => state));

  const {
    promptFormData
  } = useEditPromptStore(useShallow((state: any) => state));
  console.log("=>(edit-prompt.tsx:27) promptFormData", promptFormData);

  const [form] = Form.useForm();

  const {} = props;

  useEffect(() => {
    form.setFieldsValue(promptFormData);
  }, [promptFormData]);

  const contextSelectOnChange = (value: string) => {
    setContextData(location.state[value]);
  };

  const formOnValueChange = (changedValues: any, allValues: any) => {
    setPromptFormData(allValues);
  };

  return (
    <React.Fragment>

      <Form
        form={form}
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        labelAlign={'left'}
        onValuesChange={formOnValueChange}
      >
        <Row gutter={24} justify="start">
          <Col span={5} >
            <Form.Item name={PROMPT_FORM_KEYS.contextKey} label={PROMPT_FORM_LABELS[PROMPT_FORM_KEYS.contextKey]}>
              <Select
                onChange={contextSelectOnChange}
                options={columnKeysOptions()}
                filterOption={selectFilterOption}
                showSearch
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={PROMPT_FORM_KEYS.roleKey} label={PROMPT_FORM_LABELS[PROMPT_FORM_KEYS.roleKey]}>
              <Select options={contextKeysOptions()} filterOption={selectFilterOption} showSearch allowClear/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={PROMPT_FORM_KEYS.contentKey} label={PROMPT_FORM_LABELS[PROMPT_FORM_KEYS.contentKey]}>
              <Select options={contextKeysOptions()} filterOption={selectFilterOption} showSearch allowClear/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={PROMPT_FORM_KEYS.dataKey} label={PROMPT_FORM_LABELS[PROMPT_FORM_KEYS.dataKey]}>
              <Select options={contextKeysOptions()} filterOption={selectFilterOption} showSearch allowClear/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <PromptMessage/>

    </React.Fragment>
  );
};

export default React.memo(EditPrompt);
