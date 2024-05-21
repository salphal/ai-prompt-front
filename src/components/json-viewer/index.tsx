import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle} from "react";
import ReactJson from 'react-json-view'

export interface JsonViewProps {
  [key: string]: any;
}

interface JsonViewRef {
  /** json 对象 */
  src: any;
  /** 默认值*/
  defaultValue?: any;
  /** 名称*/
  name?: string;
  /** 皮肤样式名称 */
  theme?: string;
  /** 图标样式名称 */
  iconStyle?: string;
  /** 代码锁进长队*/
  indentWidth?: number;
  /** 展示宽度*/
  width?: string | number;
  /** 是否合并( 默认: 不合并 ) */
  collapsed?: boolean

  /** 编辑事件 */
  onEdit?: (content: any) => boolean;
  /** 新增事件 */
  onAdd?: (content: any) => boolean;
  /** 删除事件 */
  onDelete?: (content: any) => void;
  /** 点击事件*/
  onSelect?: (content: any) => void;

  [key: string]: any;

}

/**
 * https://github.com/mac-s-g/react-json-view?tab=readme-ov-file
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

    onEdit,
    onAdd,
    onDelete,
    onSelect,

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

  const handleJsonViewerOnEdit = () => {
    typeof onEdit === 'function' && onEdit();
  };

  const handleJsonViewerOnAdd = () => {
    typeof onAdd === 'function' && onAdd();
  };

  const handleJsonViewerOnDelete = () => {
    typeof onDelete === 'function' && onDelete();
  };

  const handleJsonViewerOnSelect = () => {
    typeof onSelect === 'function' && onSelect();
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
        onEdit={(...args) => handleJsonViewerEventAspect('edit', ...args)}
        onAdd={(...args) => handleJsonViewerEventAspect('add', ...args)}
        onDelete={(...args) => handleJsonViewerEventAspect('delete', ...args)}
        onSelect={(...args) => handleJsonViewerEventAspect('select', ...args)}
      />

    </React.Fragment>
  );
};

export default React.forwardRef(JsonViewer);
