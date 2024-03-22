import React, {useEffect, useImperativeHandle, ForwardRefRenderFunction, Ref, useRef} from "react";
import {Content, ContentErrors, JSONEditor, JSONPatchResult} from "vanilla-jsoneditor";
import "./index.scss"

/**
 * "vanilla-jsoneditor": "^0.23.0",
 */

const defaultContent = {
  json: {
    key: "value"
  },
  text: undefined
};

export interface IJsonEditorContent {     // 二者传一个即可
  json: string;                           // JSON 对象
  text: undefined | string;               // JSON 字符串
}

export interface JsonEditorProps {
  [key: string]: any;

  model?: 'text' | 'tree' | 'table';    // 操作模式
  content?: IJsonEditorContent;         // JSON 内容
  readOnly?: boolean;                   // 是否只读
  mainMenuBar?: boolean;                // 是否显示控制条
  navigationBar?: boolean;              // 是否显示 导航栏
  statusBar?: boolean;                  // 是否显示 状态栏
  tabSize?: number;                     // 缩进大小

  onError?: (err: Error) => void;

  onChange?: (content: Content, previousContent: Content, changeStatus: {
    contentErrors: ContentErrors | null,
    patchResult: JSONPatchResult | null
  }) => void;
}

interface JsonEditorRef {
  [key: string]: any;
}

const JsonEditor: ForwardRefRenderFunction<JsonEditorRef, JsonEditorProps> = (
  props: JsonEditorProps,
  ref: Ref<JsonEditorRef | HTMLDivElement>
) => {

  const {} = props;

  const refContainer = useRef<any>(null);
  const refEditor = useRef<any>(null);

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {}
    });
    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      console.log("update props", props);
      refEditor.current.updateProps({
        content: defaultContent,
        ...props
      });
    }
  }, [props]);

  return (
    <React.Fragment>

      <div className="vanilla-jsoneditor-react" ref={refContainer}/>

    </React.Fragment>
  );
};

export default React.forwardRef(JsonEditor);
