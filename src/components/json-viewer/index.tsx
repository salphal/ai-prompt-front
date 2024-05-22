import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle} from "react";
import ReactJson, {InteractionProps, ThemeKeys, ThemeObject} from '@microlink/react-json-view';

export type TJsonViewEvent = ((edit: InteractionProps) => false | any) | false;

export interface JsonViewProps {
  /** json 对象 */
  src: any;
  /** 默认值*/
  defaultValue?: any;
  /** 名称*/
  name?: string;
  /** 皮肤样式名称 */
  theme?: ThemeKeys | ThemeObject;
  /** 图标样式名称 */
  iconStyle?: "circle" | "triangle" | "square";
  /** 代码锁进长队*/
  indentWidth?: number;
  /** 展示宽度*/
  width?: string | number;
  /** 是否合并( 默认: 不合并 ) */
  collapsed?: boolean
  /** 编辑事件 */
  onEdit?: TJsonViewEvent;
  /** 新增事件 */
  onAdd?: TJsonViewEvent;
  /** 删除事件 */
  onDelete?: TJsonViewEvent;
  /** 点击事件*/
  onSelect?: TJsonViewEvent;

  [key: string]: any;
}

interface JsonViewRef {
  [key: string]: any;
}

/**
 * https://github.com/microlinkhq/react-json-view
 */
const JsonViewer: ForwardRefRenderFunction<JsonViewRef, JsonViewProps> = (
  props: JsonViewProps,
  ref: Ref<JsonViewRef | HTMLDivElement>
) => {

  const {
    src = "",
    name = "json view",
    theme = "rjv-default",
    iconStyle = "circle",
    indentWidth = 2,
    width = 'auto',
    collapsed = false,

    onEdit = false,
    onAdd = false,
    onDelete = false,
    onSelect = false,

    style = {}
  } = props;

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
  }, []);

  const handleJsonViewerEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      edit: handleJsonViewerOnEdit,
      add: handleJsonViewerOnAdd,
      delete: handleJsonViewerOnDelete,
      select: handleJsonViewerOnSelect,
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handleJsonViewerOnEdit = (edit: InteractionProps) => {
    typeof onEdit === 'function' && onEdit(edit);
  };

  const handleJsonViewerOnAdd = (edit: InteractionProps) => {
    typeof onAdd === 'function' && onAdd(edit);
  };

  const handleJsonViewerOnDelete = (edit: InteractionProps) => {
    typeof onDelete === 'function' && onDelete(edit);
  };

  const handleJsonViewerOnSelect = (edit: InteractionProps) => {
    typeof onSelect === 'function' && onSelect(edit);
  };

  return (
    <React.Fragment>

      <ReactJson
        src={JSON.parse(JSON.stringify(src))}
        defaultValue={{
          "say": "hello world"
        }}
        name={name}
        theme={theme}
        iconStyle={iconStyle}
        indentWidth={indentWidth}
        style={{...style, width}}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        collapsed={collapsed}
        onEdit={onEdit ? (...args) => handleJsonViewerEventAspect('edit', ...args) : false}
        onAdd={onAdd ? (...args) => handleJsonViewerEventAspect('edit', ...args) : false}
        onDelete={onDelete ? (...args) => handleJsonViewerEventAspect('edit', ...args) : false}
        onSelect={onSelect ? (...args) => handleJsonViewerEventAspect('edit', ...args) : false}
      />

    </React.Fragment>
  );
};

export default React.forwardRef(JsonViewer);
