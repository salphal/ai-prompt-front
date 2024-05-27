import React, {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import {useForm} from "antd/es/form/Form";
import {Button, Col, Form, Input, Pagination, Row, Segmented, Select} from "antd";
import usePromptStore from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {TAB_KEYS} from "@/pages/merge-data/constant.ts";
import {v4 as uuidv4} from "uuid";
import JsonEditor from "@/components/json-editor";
import {useNavigate} from "react-router-dom";

const {TextArea} = Input;

export interface MergeDataProps {
  [key: string]: any;
}

const MergeData: React.FC<MergeDataProps> = (props: MergeDataProps) => {

  const navigate = useNavigate();

  const {} = props

  const [form] = useForm();

  const {
    promptData,
  } = usePromptStore(useShallow((state: any) => state));

  const [tabValue, setTabValue] = useState<string>(TAB_KEYS.original);
  const [mergeFormData, setMergeFormData] = useState<any>({});
  const [originalValueKeys, setOriginalValueKeys] = useState<Array<any>>([]);
  const [referenceValueKeys, setReferenceValueKeys] = useState<Array<any>>([]);
  const [allOptionsMap, setAllOptionsMap] = useState<any>({});
  const [referenceRadioValues, setReferenceRadioValues] = useState<any>({});

  useEffect(() => {
    if (!Array.isArray(promptData) || !promptData.length) return;

    const firstRowData = promptData[0];
    const allOptions = getAllOptions(firstRowData);

    setAllOptionsMap(allOptions);
    updateValueKeys(allOptions);

  }, [promptData]);

  useEffect(() => {
    if (!Object.keys(referenceValueKeys).length) return;

    const radioValues: any = {};

    referenceValueKeys.forEach((k) => {
      radioValues[k] = 0
    });

    setReferenceRadioValues(radioValues);

  }, [referenceValueKeys]);

  useEffect(() => {
    if (!Object.keys(referenceRadioValues).length) return;

    const formData: any = {};

    Object.entries(referenceRadioValues).forEach(([k, i]: any) => {
      const optionsList = allOptionsMap[k];
      if (!Array.isArray(optionsList) || !optionsList.length || i < 0 || i > optionsList.length) return;
      formData[k] = optionsList[i] || {};
    });

    setMergeFormData((p: any) => ({...p, ...formData}));

  }, [allOptionsMap, referenceRadioValues]);

  const getAllOptions = (rowData: any) => {

    const allItemKeys: any = Object.keys(rowData);
    const allItemOptions: any = {};

    allItemKeys.forEach((k: any) => {
      allItemOptions[k] = promptData.reduce((p: Array<any>, v: any) => {
        let currentValue = v[k];
        if (typeof currentValue === 'string') currentValue = currentValue.trim();
        return p.findIndex(v => v === currentValue) === -1 && currentValue !== ''
          ? [...p, currentValue]
          : p;
      }, []);
    });

    return allItemOptions;
  };

  const updateValueKeys = (allOptions: any) => {

    if (!Object.keys(allOptions).length) return;

    const originalKeys: any = [];
    const referenceKeys: any = [];

    Object.entries(allOptions).forEach(([key, options]: any) => {
      if (key === 'id' || !Array.isArray(options) || !options.length) return;
      const hasObjItem = options.some((v: any) => typeof v === 'object');
      hasObjItem ? referenceKeys.push(key) : originalKeys.push(key);
    });

    setOriginalValueKeys(originalKeys);
    setReferenceValueKeys(referenceKeys);
  };

  const originalFormItem = useMemo(() => () => {

    if (!Array.isArray(originalValueKeys) || !originalValueKeys.length || !Object.keys(allOptionsMap).length) return [];

    return originalValueKeys.map((k: any) => {
      const options = allOptionsMap[k] || [];
      return (
        <Row gutter={24} key={uuidv4()}>
          <Col span={23}>
            <Form.Item
              name={k}
              label={k}
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

  }, [originalValueKeys, allOptionsMap]);

  const referenceRadioOnChange = (value: any) => {
    setReferenceRadioValues((p: any) => ({...p, ...value}));
  };

  const referenceJsonEditorOnChange = (value: any) => {
    setMergeFormData((p: any) => ({...p, ...value}));
  }

  const referenceItemOnMerge = (key: any) => {
    const data = mergeFormData[key] || {};
    if (!Object.keys(data).length) return;
  }

  const referencesFormItem = useMemo(() => () => {

    return referenceValueKeys.map((k: any) => {
      const id = uuidv4();
      const options = allOptionsMap[k] || [];
      return (
        <Row gutter={24} key={id} className={classNames(['mb-10'])}>
          <Col span={6}>{k}</Col>
          <Col span={17}>
            <div className={classNames(['flex', 'justify-start', 'items-center', 'mb-8'])}>

              {/*<Radio.Group*/}
              {/*  value={referenceRadioValues[k]}*/}
              {/*  onChange={(e) => referenceRadioOnChange({[k]: e.target.value})}*/}
              {/*>*/}
              {/*  {options.map((_: any, i: number) =>*/}
              {/*    <Radio.Button*/}
              {/*      key={id + i}*/}
              {/*      value={i}*/}
              {/*    >{i}</Radio.Button>)}*/}
              {/*</Radio.Group>*/}

              <Pagination
                total={options.length}
                current={referenceRadioValues[k]}
                pageSize={1}
                onChange={(value) => referenceRadioOnChange({[k]: value})}
                showQuickJumper
              />

              <Button
                className={classNames(['ml-8'])}
                onClick={() => referenceItemOnMerge(k)}
                type={'primary'}
              >Merge</Button>
            </div>
            <JsonEditor
              content={{
                json: mergeFormData[k] || {}
              }}
              onChange={(content: any) => referenceJsonEditorOnChange(({[k]: content.json}))}
              height={500}
            />
          </Col>
        </Row>
      );
    });

  }, [
    referenceValueKeys,
    allOptionsMap,
    referenceRadioValues,
    mergeFormData
  ]);

  const formOnValueChange = (changedValues: any, allValues: any) => {
    setMergeFormData(allValues);
  };

  const handleMergeDataEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      back: handleMergeDataOnBack,
      merge: handleMergeDataOnMerge,
    };
    args = (Object.keys(kwargs).length || typeof kwargs !== 'object') ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handleMergeDataOnBack = () => {
    navigate('/home');
  };

  const handleMergeDataOnMerge = () => {
  };

  return (
    <React.Fragment>

      <div className={classNames(['h-full'])}>

        <div className={classNames(['flex', 'justify-center', 'items-center', 'h-24'])}>
          <Segmented<string>
            options={[TAB_KEYS.original, TAB_KEYS.reference]}
            size="large"
            value={tabValue}
            onChange={(value) => {
              setTabValue(value);
            }}
          />
        </div>

        <div
          className={classNames(['overflow-y-auto', 'overflow-x-hidden', 'pb-24'])}
          style={{height: "calc(100% - 200px)"}}
        >
          <Form
            form={form}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            labelAlign={"left"}
            onValuesChange={formOnValueChange}
          >
            {tabValue === TAB_KEYS.original && originalFormItem()}
            {tabValue === TAB_KEYS.reference && referencesFormItem()}
          </Form>

        </div>

        <div className={classNames(['pr-16', 'h-20', 'flex', 'flex-row', 'justify-center', 'items-center'])}>
          <Button
            className={classNames(['mr-3'])}
            onClick={() => handleMergeDataEventAspect('back')}
          >Back</Button>
          {tabValue === TAB_KEYS.original && <Button
            className={classNames(['mr-3'])}
            type={'primary'}
            onClick={() => handleMergeDataEventAspect('merge')}
          >Merge</Button>}
        </div>

      </div>

    </React.Fragment>
  );
};

export default React.memo(MergeData);
