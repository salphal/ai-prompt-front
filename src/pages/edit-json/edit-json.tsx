import React, {useEffect, useState} from "react";
import JsonEditor from "@/components/json-editor";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Flex} from "antd";
import classNames from "classnames";
import qs from "query-string";
import {setPromptDataById} from "@/store/prompt.ts";

export interface EditJsonProps {
  [key: string]: any;
}

const EditJson: React.FC<EditJsonProps> = (props: EditJsonProps) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [json, setJson] = useState<any>({});

  useEffect(() => {
    setJson(location.state)
  }, [location.state]);

  const handleBackOnClick = () => {
    navigate('/home');
  };

  const handleSaveOnClick = () => {
    const paramsString = location.search.slice(1);
    const {id} = qs.parse(paramsString);
    setPromptDataById(id, json);
    navigate('/home');
  };

  const jsonEditorOnChange = (changedContent: any, prevContent: any) => {
    setJson(changedContent.json);
  };

  return (
    <React.Fragment>

      <div className={classNames(['h-full'])}>
        <JsonEditor
          content={{
            json: json,
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
