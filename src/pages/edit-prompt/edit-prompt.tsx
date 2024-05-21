import React, {useEffect} from "react";
import PromptMessage from "@/components/prompt-message";
import {useLocation} from "react-router-dom";
import {Form} from "antd";

export interface EditPromptProps {
  [key: string]: any;
}

const EditPrompt: React.FC<EditPromptProps> = (props: EditPromptProps) => {

  const location = useLocation();
  console.log('=>(edit-prompt.tsx:12) location', location);

  const {} = props;

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>

      <Form>
        
      </Form>
      <PromptMessage/>

    </React.Fragment>
  );
};

export default React.memo(EditPrompt);
