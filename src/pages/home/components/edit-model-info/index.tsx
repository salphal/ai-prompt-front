import React, {useEffect, useImperativeHandle, ForwardRefRenderFunction, Ref, useRef} from "react";
import ConfirmModal from "@/components/confirm-modal";
import PromptForm from "@/components/prompt-form";

export interface EditModalInfoProps {
  [key: string]: any;
}

interface EditModalInfoRef {
  [key: string]: any;
}

const EditModalInfo: ForwardRefRenderFunction<EditModalInfoRef, EditModalInfoProps> = (
  props: EditModalInfoProps,
  ref: Ref<EditModalInfoRef | HTMLDivElement>
) => {

  const {} = props;

  const confirmModal = useRef<any>(null)

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({
    ...confirmModal.current
  }));

  useEffect(() => {}, []);

  return (
    <React.Fragment>

      <ConfirmModal
        ref={confirmModal}
      >
        <PromptForm/>
      </ConfirmModal>

    </React.Fragment>
  );
};

export default React.forwardRef(EditModalInfo);
