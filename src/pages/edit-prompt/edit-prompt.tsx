import React, {useEffect, useState} from "react";
import PromptMessage from "@/components/prompt-message";
import {useLocation} from "react-router-dom";
import {Button, Col, Form, Row, Select} from "antd";
import usePromptStore, {setContextData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {PROMPT_FORM_KEYS, PROMPT_FORM_LABELS} from "@/pages/edit-prompt/constants/form.ts";
import {selectFilterOption} from "@/utils/antd/select.ts";
import useEditPromptStore, {setPromptFormData} from "@/pages/edit-prompt/store.ts";
import DraggableList from "@/components/draggable-list";
import {CloseOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined} from '@ant-design/icons';
import classNames from "classnames";

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

  const [form] = Form.useForm();

  const [messageContext, setMessageContext] = useState<Array<any>>([]);

  useEffect(() => {
    form.setFieldsValue(promptFormData);
  }, [promptFormData]);

  useEffect(() => {
    if (Array.isArray(contextData) && contextData.length) {
      const messages = contextData.map((v, i) => ({
        ...v,
        id: i,
        render: () => (
          <div className={classNames(['flex', 'justify-between'])}>
            <div className={classNames(['flex-1'])}>
              <PromptMessage
                key={`prompt-${i}`}
                value={v}
                onChange={(val: any) => promptMessageOnChange(val, i)}
              />
            </div>
            <div className={classNames(['pt-12', 'pb-4', 'flex', 'flex-col', 'justify-between', 'w-10'])}>
              <div className={classNames(['flex-1', 'justify-center', 'items-center'])}>
                <CloseOutlined/>
              </div>
              <div className={classNames(['flex-1', 'justify-center', 'items-center'])}>
                <VerticalAlignTopOutlined/>
              </div>
              <div className={classNames(['flex-1', 'justify-center', 'items-center'])}>
                <VerticalAlignBottomOutlined/>
              </div>
            </div>
          </div>
        ),
      }))
      setMessageContext(messages);
    }
  }, [contextData]);

  const promptMessageOnChange = (val: any, i: number) => {
  }

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
        <Row className={classNames(['pl-5'])} gutter={24} justify="start">
          <Col span={5}>
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


      <DraggableList
        dataSource={messageContext}
        setDataSource={setMessageContext}
      />

      <div className={classNames(['pl-5', 'h-20', 'flex', 'flex-row', 'justify-center', 'items-center'])}>
        <Button type={'primary'}>Add Message</Button>
      </div>

    </React.Fragment>
  );
};

export default React.memo(EditPrompt);
