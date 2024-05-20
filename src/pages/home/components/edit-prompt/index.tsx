import React, {useEffect, useImperativeHandle, ForwardRefRenderFunction, Ref, useRef} from "react";
import ConfirmModal from "@/components/confirm-modal";

export interface EditPromptProps {
  [key: string]: any;
}

interface EditPromptRef {
  [key: string]: any;
}

const EditPrompt: ForwardRefRenderFunction<EditPromptRef, EditPromptProps> = (
  props: EditPromptProps,
  ref: Ref<EditPromptRef | HTMLDivElement>
) => {

  const {} = props;

  const confirmModalRef = useRef<any>(null)

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({
    ...confirmModalRef.current
  }));

  useEffect(() => {}, []);

  return (
    <React.Fragment>

      <ConfirmModal ref={confirmModalRef}>

      </ConfirmModal>

    </React.Fragment>
  );
};

export default React.forwardRef(EditPrompt);
