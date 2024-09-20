import React, {
  ForwardRefRenderFunction,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ConfigProvider, Flex, Form, Segmented, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';
import classNames from 'classnames';

import ConfirmModal from '@/components/confirm-modal';
import JsonEditor from '@/components/json-editor';
import { TAB_KEYS } from '@/pages/home/components/edit-table-columns/constant.ts';
import HomeContext from '@/pages/home/context.ts';
import { setDataSource } from '@/store/prompt.ts';

export interface EditTableColumnsProps {
  [key: string]: any;
}

interface EditTableColumnsRef {
  [key: string]: any;
}

const EditTableColumns: ForwardRefRenderFunction<EditTableColumnsRef, EditTableColumnsProps> = (
  props: EditTableColumnsProps,
  ref: Ref<EditTableColumnsRef | HTMLDivElement>,
) => {
  const { rowData } = useContext(HomeContext);

  const [form] = useForm();

  const [tabValue, setTabValue] = useState(TAB_KEYS.delete);
  const [json, setJson] = useState<any>({});

  const modalRef = useRef<any>(null);

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({
    ...modalRef.current,
  }));

  useEffect(() => {
    if (rowData) {
      const json: any = {};
      Object.keys(rowData).forEach((k: string) => {
        const v = rowData[k];
        if (typeof v === 'object') {
          if (Array.isArray(v)) {
            json[k] = [];
          } else if (!Array.isArray(v) && v !== null) {
            json[k] = {};
          }
        } else {
          json[k] = v;
        }
      });
      setJson(json);
    }

    if (Object.keys(rowData).length) {
      const formData: any = {};
      const allKeys = Object.keys(rowData);
      allKeys.forEach((key) => (formData[key] = true));
      form.setFieldsValue(formData);
    }
  }, [rowData]);

  const formItems = useMemo(
    () => () => {
      if (Object.keys(rowData).length === 0) return [];
      return Object.entries(rowData).map(([k, v], i) => {
        const valueType = Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
        return (
          <Form.Item
            className={classNames('w-1/3')}
            key={k}
            name={k}
            label={`[ ${k}: ${valueType} ]`}
          >
            <Switch checkedChildren="enable" unCheckedChildren="delete" />
          </Form.Item>
        );
      });
    },
    [rowData],
  );

  const jsonEditorOnChange = (changedContent: any, prevContent: any) => {
    setJson(changedContent.json);
  };

  const modalOnConfirm = () => {
    let columnKeys: any = [];

    if (tabValue === TAB_KEYS.delete) {
      const fromData = form.getFieldsValue();
      for (const key in fromData) {
        const value = fromData[key];
        if (value) columnKeys.push(key);
      }
    } else if (tabValue === TAB_KEYS.edit) {
      columnKeys = Object.keys(json);
    }

    setDataSource((prev: any) => {
      return prev.map((v: any) =>
        Object.fromEntries(Object.entries(v).filter(([k, v]) => columnKeys.includes(k))),
      );
    });

    modalOnCancel();
  };

  const modalOnCancel = () => {
    setTabValue(TAB_KEYS.delete);
    setJson({});
    modalRef.current.hideModal();
  };

  return (
    <React.Fragment>
      <ConfirmModal
        ref={modalRef}
        title={'Edit Table Columns'}
        styles={{
          top: '12%',
          width: '1200px',
          height: '600px',
        }}
        contentStyles={{
          height: '600px',
        }}
        confirmBtnText={'Merge'}
        cancelBtnText={'Cancel'}
        onConfirm={modalOnConfirm}
        onCancel={modalOnCancel}
      >
        <Segmented
          className={classNames('!mt-3', '!mb-5')}
          value={tabValue}
          onChange={(value) => {
            setTabValue(value);
          }}
          options={Object.values(TAB_KEYS)}
          size={'large'}
          block
        />

        <div className={classNames(['h-4/5', 'overflow-y-auto'])}>
          {tabValue === TAB_KEYS.edit && (
            <JsonEditor
              content={{
                json,
                text: undefined,
              }}
              onChange={jsonEditorOnChange}
            />
          )}

          {tabValue === TAB_KEYS.delete && (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#3dae65',
                },
                // components: {
                //   Switch: {
                //     colorPrimary: '#3dae65',
                //   },
                // },
              }}
            >
              <Form
                form={form}
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 8 }}
                labelAlign={'left'}
                // onValuesChange={formOnValueChange}
              >
                <Flex className={classNames('pt-10')} wrap={'wrap'}>
                  {formItems()}
                </Flex>
              </Form>
            </ConfigProvider>
          )}
        </div>
      </ConfirmModal>
    </React.Fragment>
  );
};

export default React.forwardRef(EditTableColumns);
