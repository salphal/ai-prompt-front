import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle} from "react";
import Styles from "./index.module.scss";
import classNames from "classnames";
import {Button, Form, InputNumber, Select, Slider, Switch} from "antd";
import {useForm} from "antd/es/form/Form";
import {PROMPT_MODEL_KEYS, PROMPT_MODEL_LABELS, PROMPT_MODELS} from "@/constants/prompt.ts";
import {defaultFormData} from "@/components/prompt-form/constant.ts";

const {Option} = Select;

export interface PromptFormProps {
  [key: string]: any;

}

interface PromptFormRef {
  [key: string]: any;
}

const PromptForm: ForwardRefRenderFunction<PromptFormRef, PromptFormProps> = (
  props: PromptFormProps,
  ref: Ref<PromptFormRef | HTMLDivElement>
) => {

  const [form] = useForm();

  const {} = props;

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    form.setFieldsValue(defaultFormData);
  }, []);

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };

  const buttonItemLayout = {wrapperCol: {span: 16, offset: 8}}

  const handlePromptFormEventAspect = (type: string, kwargs: object = {}, ...args: any[]) => {
    const handles: any = {
      confirm: handlePromptFormOnConfirm,
      reset: handlePromptFormOnReset,
      cancel: handlePromptFormOnCancel,
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handlePromptFormOnConfirm = () => {
    const formData = form.getFieldsValue();
    console.log('=>(index.tsx:55) formData', formData);
  };

  const handlePromptFormOnReset = () => {
  };

  const handlePromptFormOnCancel = () => {
  };

  return (
    <React.Fragment>

      <Form
        className={classNames([Styles.promptForm])}
        form={form}
        {...layout}
      >
        <Form.Item
          name={PROMPT_MODEL_KEYS.model}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.model]}
          rules={[{required: true}]}
        >
          <Select
            placeholder=""
            allowClear
          >
            {PROMPT_MODELS.map(v => (
              <Option key={v} value={v}>{v}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.temperature}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.temperature]}
          rules={[{required: true}]}
        >
          <Slider max={1} min={0} step={0.1}/>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.max_tokens}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.max_tokens]}
          rules={[{required: true}]}
        >
          <InputNumber min={1} max={100000} step={100}/>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.presence_penalty}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.presence_penalty]}
          rules={[{required: true}]}
        >
          <Slider max={2} min={-2} step={0.1}/>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.frequency_penalty}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.frequency_penalty]}
          rules={[{required: true}]}
        >
          <Slider max={2} min={-2} step={0.1}/>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.sendMemory}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.sendMemory]}
          rules={[{required: true}]}
        >
          <Switch/>
        </Form.Item>
        <Form.Item
          name={PROMPT_MODEL_KEYS.compressMessageLengthThreshold}
          label={PROMPT_MODEL_LABELS[PROMPT_MODEL_KEYS.compressMessageLengthThreshold]}
          rules={[{required: true}]}
        >
          <InputNumber min={10} max={10000} step={10}/>
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button className={'mr-3'} onClick={() => handlePromptFormEventAspect('cancel')}>取消</Button>
          <Button onClick={() => handlePromptFormEventAspect('confirm')}>确认</Button>
        </Form.Item>
      </Form>

    </React.Fragment>
  );
};

export default React.forwardRef(PromptForm);
