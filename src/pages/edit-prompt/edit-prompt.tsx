import React, {useEffect, useMemo, useState} from "react";
import PromptMessage from "@/components/prompt-message";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Form, Row, Select} from "antd";
import usePromptStore, {setContextData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {PROMPT_FORM_KEYS, PROMPT_FORM_LABELS} from "@/pages/edit-prompt/constants/form.ts";
import {selectFilterOption} from "@/utils/antd/select.ts";
import useEditPromptStore, {setPromptFormData} from "@/pages/edit-prompt/store.ts";
import DraggableList from "@/components/draggable-list";
import {CloseOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined} from '@ant-design/icons';
import classNames from "classnames";
import {v4 as uuidv4} from 'uuid';
import useScroll from "@/hooks/useScroll.ts";


export interface EditPromptProps {
  [key: string]: any;
}

const EditPrompt: React.FC<EditPromptProps> = (props: EditPromptProps) => {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    columnKeysOptions,
    contextKeysOptions,
    contextData
  } = usePromptStore(useShallow((state: any) => state));

  const {
    promptFormData
  } = useEditPromptStore(useShallow((state: any) => state));

  const {scrollToBottom} = useScroll({querySelector: '#draggable-list', isShow: true})

  const [form] = Form.useForm();

  const [contextList, setContextList] = useState<Array<any>>([]);

  useEffect(() => {
    form.setFieldsValue(promptFormData);
  }, [promptFormData]);

  useEffect(() => {
    if (Array.isArray(contextData)) setContextList(contextData.map(v => ({...v, id: uuidv4()})));
  }, []);

  const promptList = useMemo(() => () => {
    if (!Array.isArray(contextList)) return [];
    return contextList.map((v: any, i: number) => {
      const id = v.id || i;
      return {
        id,
        ...v,
        render: () => (
          <div
            key={`prompt-message-${i}`}
            className={classNames(['flex', 'justify-between'])}
          >
            <div className={classNames(['flex-1'])}>
              <PromptMessage
                value={v}
                onChange={(val: any) => promptMessageOnChange(val, id)}
              />
            </div>
            <div className={classNames(['pt-9', 'pb-5', 'flex', 'flex-col', 'justify-between', 'w-6'])}>
              {[
                [<CloseOutlined className={classNames(['text-red-300'])}/>, 'remove'],
                [<VerticalAlignTopOutlined className={classNames(['text-blue-500'])}/>, 'moveToPrev'],
                [<VerticalAlignBottomOutlined className={classNames(['text-blue-500'])}/>, 'moveToNext']
              ].map(([icon, type], i) => (
                <div
                  key={id + i}
                  className={classNames(['flex-1', 'flex', 'justify-center', 'items-center', 'cursor-cursor', 'hover:bg-gray-200'])}
                  onClick={() => handleEditPromptEventAspect(type as string, id)}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        ),
      }
    });
  }, [contextList]);

  const handleEditPromptEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      add: handleEditPromptOnAdd,
      remove: handleEditPromptOnRemove,
      moveToPrev: handleEditPromptOnMoveToPrev,
      moveToNext: handleEditPromptOnMoveToNext,
      back: handleEditPromptOnMoveToBack,
    };
    args = (Object.keys(kwargs).length || typeof kwargs !== 'object') ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handleEditPromptOnAdd = () => {
    const message = {
      id: uuidv4(),
      role: "user",
      data: "",
      content: ""
    };
    setContextList(prev => [...prev, message]);
    scrollToBottom();
  };

  const handleEditPromptOnRemove = (id: number) => {
    setContextList(prev => prev.filter((v, i) => v.id !== id));
  };

  const handleEditPromptOnMoveToPrev = (id: number) => {
    const index = contextList.findIndex(v => v.id === id);
    if (index === -1 || index === 0) return;
    setContextList(prev => prev.map((v, i, arr) => {
      if (i === index - 1) return arr[index];
      if (i === index) return arr[index - 1];
      return v;
    }));
  };

  const handleEditPromptOnMoveToNext = (id: number) => {
    const index = contextList.findIndex(v => v.id === id);
    if (index === -1 || index >= contextList.length) return;
    setContextList(prev => prev.map((v, i, arr) => {
      if (i === index + 1) return arr[index];
      if (i === index) return arr[index + 1];
      return v;
    }));
  };

  const handleEditPromptOnMoveToBack = () => {
    navigate('/home');
  }

  const promptMessageOnChange = (val: any, i: string | number) => {
  }

  const contextSelectOnChange = (value: string) => {
    setContextData(location.state[value]);
  };

  const formOnValueChange = (changedValues: any, allValues: any) => {
    setPromptFormData(allValues);
  };

  return (
    <React.Fragment>

      <div className={classNames(['h-full', 'flex', 'flex-col', 'flex-nowrap'])}>

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
          dataSource={promptList()}
          setDataSource={setContextList}
        />

        <div className={classNames(['pr-16', 'h-20', 'flex', 'flex-row', 'justify-center', 'items-center'])}>
          <Button
            className={classNames(['mr-3'])}
            onClick={() => handleEditPromptEventAspect('back')}
          >Back</Button>
          <Button
            className={classNames(['mr-3'])}
            type={'primary'}
            onClick={() => handleEditPromptEventAspect('add')}
          >Add</Button>
          <Button type={'primary'} onClick={() => handleEditPromptEventAspect('add')}>Save</Button>
        </div>

      </div>

    </React.Fragment>
  );
};

export default React.memo(EditPrompt);
