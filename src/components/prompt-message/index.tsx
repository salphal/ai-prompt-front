import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Radio } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';

import { ERole } from '../../../typings/prompt.ts';
import MarkdownEditor from '@/components/markdown-editor';
import { PROMPT_ROLES } from '@/constants/prompt.ts';

export interface IPromptMessageForm {
  role: ERole.user | ERole.system | ERole.assistant; // 角色: system: 输入, user: 输出, assistant: 上下文
  content: string; // 内容: 上下文的具体内容
  data?: string; // 辅助信息: 影响对话中的功能和决策
}

export interface PromptMessageProps {
  value?: IPromptMessageForm;
  onClose?: () => void;
  onChange?: (values: any) => void;
  height?: number;

  [key: string]: any;
}

interface PromptMessageRef {
  [key: string]: any;
}

const PromptMessage: ForwardRefRenderFunction<PromptMessageRef, PromptMessageProps> = (
  props: PromptMessageProps,
  ref: Ref<PromptMessageRef | HTMLDivElement>,
) => {
  const { value, onChange, height = 240 } = props;

  const [formData, setFormData] = useState<IPromptMessageForm>({
    role: ERole.user,
    content: '',
  });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!_.isObject(value)) return;
    const isDiff = diffFormData(value, formData);
    isDiff && setFormData(value);
  }, [value]);

  const roleOnChange = (value: ERole) => {
    setFormData((prev) => ({ ...prev, role: value }));
    typeof onChange === 'function' && onChange({ ...formData, role: value });
  };

  const contentOnChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
    typeof onChange === 'function' && onChange({ ...formData, content: value });
  };

  const diffFormData = (data: any, formData: IPromptMessageForm) => {
    if (!_.isObject(data) || !_.isObject(formData) || !('role' in data) || !('content' in data))
      return;
    return data.role !== formData.role || data.content !== formData.content;
  };

  return (
    <React.Fragment>
      <div
        className={classNames([
          'flex',
          'flex-col',
          'p-1',
          'pb-4',
          'overflow-hidden',
          'cursor-grab',
        ])}
        style={{ height }}
      >
        <div className={classNames(['flex', 'justify-between'])}>
          <Radio.Group
            className={classNames([])}
            value={formData.role}
            onChange={(e) => roleOnChange(e.target.value)}
          >
            {PROMPT_ROLES.map((v, i) => (
              <Radio.Button
                key={v}
                value={v}
                style={
                  i === 0
                    ? {
                        borderRadius: '3px 3px 0 0',
                      }
                    : i === PROMPT_ROLES.length - 1
                      ? {
                          borderRadius: '0 3px 0 0',
                        }
                      : {}
                }
              >
                {v}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className={classNames(['flex-1'])}>
          <MarkdownEditor value={formData.content} onChange={contentOnChange} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(PromptMessage);
