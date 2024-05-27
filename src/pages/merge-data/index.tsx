import React, {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import {useForm} from "antd/es/form/Form";
import {Col, Form, Radio, Row, Segmented, Select} from "antd";
import usePromptStore from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import JsonEditor from "@/components/json-editor";
import {TAB_KEYS} from "@/pages/merge-data/constant.ts";

export interface MergeDataProps {
  [key: string]: any;
}

const MergeData: React.FC<MergeDataProps> = (props: MergeDataProps) => {

  const {} = props

  const [form] = useForm();

  const {
    promptData,
    columnKeysOptions,
    selectedRowKeys,
    defaultRowData,
    formData
  } = usePromptStore(useShallow((state: any) => state));

  const [tabValue, setTabValue] = useState(TAB_KEYS.original);

  useEffect(() => {
  }, []);

  const formItems = useMemo<any>(() => () => {
    if (!Array.isArray(promptData) || !promptData.length) return [];

    const firstRowData = promptData[0];
    let allItemKeys: any = Object.keys(firstRowData);
    const itemOptions: any = {};

    allItemKeys.forEach((k: any) => {
      itemOptions[k] = promptData.reduce((p: Array<any>, v: any) => {
        let currentValue = v[k];
        if (typeof currentValue === 'string') currentValue = currentValue.trim();
        return p.findIndex(v => v === currentValue) === -1 && currentValue !== ''
          ? [...p, currentValue]
          : p;
      }, []);
    });

    let strKeys: any = [];
    const objKeys: any = [];

    allItemKeys.forEach((k: any) => {
      const options = itemOptions[k] || [];
      const hasObjItem = options.some((v: any) => typeof v === 'object');
      hasObjItem ? objKeys.push(k) : strKeys.push(k);
    });

    allItemKeys = [...strKeys];
    // allItemKeys = [...strKeys, ...objKeys];

    if ('id' in itemOptions) delete itemOptions.id;
    allItemKeys = allItemKeys.filter((k: any) => k !== 'id');
    strKeys = strKeys.filter((k: any) => k !== 'id');

    const originalFormItems = strKeys.map((k: any) => {
      const options = itemOptions[k] || [];
      return (
        <Row gutter={24}>
          <Col span={23}>
            <Form.Item
              name={k}
              label={k}
              rules={[]}
            >
              <Select
                placeholder=""
                allowClear
                options={options.map((v: any) => ({label: String(v), value: v}))}
              />
            </Form.Item>
          </Col>
        </Row>
      );
    });

    const objectFormItems: any = objKeys.map((k: any) => {

      const options = itemOptions[k] || [];

      return (
        <Row gutter={24}>
          <Col span={23}>
            <Form.Item
              name={k}
              label={k}
              rules={[]}
            >
              <>
                <Radio.Group className={classNames(['mb-3'])}>
                  {options.map((v: any, i: number) => (<Radio value={i}>{i}</Radio>))}
                </Radio.Group>
                <JsonEditor
                  content={{
                    json: options,
                    text: undefined
                  }}
                  // onChange={jsonEditorOnChange}
                  height={500}
                />
              </>
            </Form.Item>
          </Col>
        </Row>
      );
    });

    return {
      originalFormItems,
      objectFormItems
    };

  }, [promptData]);

  const formOnValueChange = (changedValues: any, allValues: any) => {
  };

  return (
    <React.Fragment>

      <div className={classNames(['h-full'])}>

        <div className={classNames(['flex', 'justify-center', 'items-center', 'h-24'])}>
          <Segmented<string>
            options={[TAB_KEYS.original, TAB_KEYS.object]}
            size="large"
            value={tabValue}
            onChange={(value) => {
              setTabValue(value);
            }}
          />
        </div>

        <div className={classNames(['overflow-y-auto', 'h-full', 'pb-5'])}>

          <Form
            form={form}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            labelAlign={"left"}
            onValuesChange={formOnValueChange}
          >
            {tabValue === TAB_KEYS.original && formItems().originalFormItems}
            {tabValue === TAB_KEYS.object && formItems().objectFormItems}
          </Form>

        </div>

      </div>

    </React.Fragment>
  );
};

export default React.memo(MergeData);
