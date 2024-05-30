import {RcFile, UploadFileStatus} from "antd/es/upload/interface";
import {message, UploadFile, UploadProps} from "antd";
import {saveAs} from "file-saver";
import {useState} from "react";

export interface IFile {
  name: string,
  size: number,
  type: string,
  content: any
}

export interface IUseUploadProps {
  maxCount?: number;
  defaultProps?: UploadProps;
  onBefore?: (file: RcFile, FileList: RcFile[]) => boolean;
  onChange?: (status: UploadFileStatus | undefined, info: any) => void;
  onParseJson?: (file: IFile) => void;

  [key: string]: any;
}

/**
 * example:
 *
 * <Upload {...uploadProps}>
 *   <Button>导入</Button>
 * </Upload>
 */
const useUpload = (props: IUseUploadProps = {}) => {

  const {
    maxCount = 1,
    defaultProps,
    onBefore,
    onChange,
    onParseJson
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'http://www.baidu.com/xxx.png',
    // },
  ]);
  const [fileContent, setFileContent] = useState<any>({
    name: '',
    size: 0,
    type: 'application/json',
    content: []
  });

  /**
   * 解析上传的 JSON文件内容
   * @param file {RcFile} 上传的文件
   */
  const onImportJson = (file: RcFile) => {

    const {name, size, type} = file;

    // 创建 FileReader 对象读取文件
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      // 获取文件内容
      const result = reader.result;
      const content = typeof result === 'string' ? JSON.parse(result) : result;

      const file = {
        name,
        size,
        type,
        content
      };

      setFileContent(file);

      if (result) {
        typeof onParseJson === 'function' && onParseJson(file);
        message.success(`${name} 解析成功!`)
      } else {
        message.warning(`${name} 解析文件内容为空!`);
      }
    };
  };

  /**
   * 导出文件
   * @param file {any} 包含文件内容的对象
   * @param ext {string} 文件名后缀
   */
  const onExportFile = (file: any, ext: string = 'json') => {

    const {name = 'prompts', type = 'application/json', size, content} = file;

    if (size === 0) {
      message.error("文件内容为空");
      return;
    }

    const blob = new Blob([content], {type});
    const filename = name.indexOf('.') === -1 ? `${name}.${ext}` : name;

    saveAs(blob, filename);
  }

  /**
   * 上传文件之前的钩子
   * @param file {RcFile} 上传的文件
   * @param FileList {RcFile[]} 文件列表
   * @return 若返回 false 则停止上传
   */
  const uploadOnBefore = (file: RcFile, FileList: RcFile[]) => {
    console.log('=>(home.tsx:100) uploadOnBefore', file, FileList);

    /** 解析文件*/
    onImportJson(file);

    /** 判断文件类型*/
    if (typeof onBefore === 'function') {
      return onBefore(file, FileList);
    }

    return true;
  }

  /**
   * 上传文件改变时的回调，上传每个阶段都会触发该事件
   * @param info {UploadChangeParam<UploadFile>>}
   */
  const uploadOnChange: UploadProps['onChange'] = (info) => {

    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

    typeof onChange === 'function' && onChange(info.file.status, info);

    let newFileList = [...info.fileList];

    // 限制上传文件数量, 仅上传最新的一个文件
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const uploadProps: UploadProps = {
    ...defaultProps,
    name: 'file',
    action: '',
    accept: '.json',
    showUploadList: false,
    multiple: maxCount > 1,
    maxCount,
    fileList,
    beforeUpload: uploadOnBefore,
    onChange: uploadOnChange
  };

  return {
    uploadProps,
    fileList,
    setFileList,
    fileContent,
    setFileContent,
    onExportFile,
  }
};

export default useUpload;
