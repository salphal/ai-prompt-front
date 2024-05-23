import React, {useState} from "react";
import JsonEditor from "@/components/json-editor";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Flex} from "antd";
import classNames from "classnames";
import qs from "query-string";

export interface EditJsonProps {
  [key: string]: any;
}

const EditJson: React.FC<EditJsonProps> = (props: EditJsonProps) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [content, setContent] = useState<any>({});

  const handleBackOnClick = () => {
    navigate('/home');
  };

  const handleSaveOnClick = () => {
    const paramsString = location.search.slice(1);
    const {id} = qs.parse(paramsString);
  };

  const jsonEditorOnChange = (changedContent: any, prevContent: any) => {
    if (changedContent.json) setContent(changedContent.json);
  };

  return (
    <React.Fragment>

      <div className={classNames(['h-full'])}>
        <JsonEditor
          content={{
            json: location.state,
            text: undefined
          }}
          onChange={jsonEditorOnChange}
          height={"calc(100% - 80px)"}
        />
        <Flex className={classNames(['h-20'])} justify={'center'} align={'center'}>
          <Button className={'mr-3'} onClick={handleBackOnClick}>Back</Button>
          <Button type={'primary'} onClick={handleSaveOnClick}>Save</Button>
        </Flex>
      </div>

    </React.Fragment>
  );
};

export default React.memo(EditJson);
