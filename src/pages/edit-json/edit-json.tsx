import React, {useEffect} from "react";
import JsonEditor from "@/components/json-editor";
import {useLocation} from "react-router-dom";

export interface EditJsonProps {
  [key: string]: any;
}

const EditJson: React.FC<EditJsonProps> = (props: EditJsonProps) => {

  const location = useLocation();

  const {} = props

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>

      <JsonEditor
        content={{
          json: location.state,
          text: undefined
        }}
      />

    </React.Fragment>
  );
};

export default React.memo(EditJson);
