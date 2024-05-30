import React, {ForwardRefRenderFunction, ReactNode, Ref, useImperativeHandle, useMemo, useState} from "react";
import {Button, Modal, Spin} from "antd";
import {Scrollbars} from "react-custom-scrollbars-2";
import {CheckCircleFilled, CloseOutlined, InfoCircleFilled} from "@ant-design/icons";

const modalIconList: any = {
  info: <InfoCircleFilled style={{color: "#0166FF"}}/>,
  success: <CheckCircleFilled style={{color: "#138d49"}}/>,
  danger: <InfoCircleFilled style={{color: "#f31c1c"}}/>
};

const ModalLoading = (props: any) => {
  const {loading = false} = props;
  return loading && (
    <Spin
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 9999,
        transform: "translate(-50%, -50%)"
      }}
    />
  );
}

const ModalMask = (props: any) => {
  const {
    isShow = false,
    onClick = () => {
    }
  } = props;
  return isShow && (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        zIndex: 9998,
        cursor: "not-allowed"
      }}
      onClick={onClick}
    />
  )
};

export interface ModalStyle {
  header: any;
  body: any;
  mask: any;
  footer: any;
  content: any;

  [key: string]: any;
}

export interface ModalContentStyle {
  /** 弹窗内容区那边距 */
  padding?: string | number;

  [key: string]: any;
}

export interface ConfirmModalProps {
  /** 弹窗标题 */
  title?: ReactNode;

  /** 是否在加载 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自动关闭 */
  closedAble?: boolean;
  /** 内容区域是否可以滚动 */
  contentScrollable?: boolean;

  /** 自定义底部控制按钮 */
  footer?: ReactNode;
  /** 弹窗消息内容 */
  message?: string;
  /** 弹窗消息icon类型 */
  messageIconType?: string;

  /** 自定义样式对象 */
  styles?: ModalStyle;
  /** Body 区域样式 */
  contentStyles?: ModalContentStyle;

  /** 确认按钮文字 */
  confirmBtnText?: string;
  /** 取消按钮文字 */
  cancelBtnText?: string;

  /** 确认按钮事件 */
  onConfirm?: () => void;
  /** 取消按钮事件 */
  onCancel?: () => void;
  /** 弹窗关闭事件 */
  onClose?: () => void;
  /** 弹窗销毁后的回掉 */
  onAfterClose?: () => void;
  /** 禁用点击事件 */
  onDisabledClick?: () => void;

  [key: string]: any;
}

interface ConfirmModalRef {
  [key: string]: any;
}

const ConfirmModal: ForwardRefRenderFunction<
  ConfirmModalRef,
  ConfirmModalProps
> = (props: ConfirmModalProps, ref: Ref<ConfirmModalRef | HTMLDivElement>) => {
  const {
    title = "提示",
    footer,

    loading = false,
    disabled = false,
    closedAble = true,
    contentScrollable = false,

    message = "",
    messageIconType = "",

    styles = {
      top: "20%",
      width: 500,
      height: "auto",
    },
    contentStyles = {
      padding: "0 0 20px 0",
      height: "300px"
    },

    confirmBtnText = '确认',
    cancelBtnText = '取消',

    onConfirm,
    onCancel,
    onClose,
    onAfterClose,
    onDisabledClick,

    children = (
      <>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </>
    ),

    ...restProps
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const modalStyles = {
    header: {},
    body: {
      overflow: 'hidden',
      ...contentStyles
    },
    mask: {},
    footer: {
      marginTop: 0
    },
    content: {},
    ...styles
  };

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({
    isOpen,
    setIsOpen,
    showModal: () => handleConfirmModalEventAspect("show"),
    hideModal: () => handleConfirmModalEventAspect("hide")
  }));

  const handleConfirmModalEventAspect = (
    type: string,
    kwargs: object = {},
    ...args: any[]
  ) => {
    const handles: any = {
      confirm: handleConfirmModalOnConfirm,
      cancel: handleConfirmModalOnCancel,
      close: handleConfirmModalOnClose,
      afterClose: handleConfirmModalOnAfterClose,
      show: handleConfirmModalOnShow,
      hide: handleConfirmModalOnHide,
      disabled: handleConfirmModalOnDisabled
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handleConfirmModalOnConfirm = () => {
    typeof onConfirm === "function" && onConfirm();
  };

  const handleConfirmModalOnCancel = () => {
    closedAble && setIsOpen(false);
    typeof onCancel === "function" && onCancel();
  };

  const handleConfirmModalOnClose = () => {
    setIsOpen(false);
    typeof onClose === "function" && onClose();
  };

  const handleConfirmModalOnAfterClose = () => {
    typeof onAfterClose === "function" && onAfterClose();
  };

  const handleConfirmModalOnDisabled = () => {
    typeof onDisabledClick === "function" && onDisabledClick();
  };

  const handleConfirmModalOnShow = () => {
    setIsOpen(true);
  };

  const handleConfirmModalOnHide = () => {
    setIsOpen(false);
  };

  const defaultFooter = (
    <>
      <Button
        type="primary"
        onClick={() => handleConfirmModalEventAspect("confirm")}
        loading={loading}
      >
        {confirmBtnText}
      </Button>
      <Button
        onClick={() => handleConfirmModalEventAspect("cancel")}
        disabled={loading}
      >
        {cancelBtnText}
      </Button>
    </>
  );

  const promptMessage = useMemo(() => {
    let icon: any = null;
    return () => {
      if (Object.keys(modalIconList).includes(messageIconType)) {
        icon = modalIconList[messageIconType];
      }
      return (
        <div
          style={{
            padding: "30px 0 60px 0",
            textAlign: "center",
            fontSize: "18px"
          }}
        >
          {icon && <span style={{marginRight: "8px"}}>{icon}</span>}
          <span>{message}</span>
        </div>
      );
    };
  }, [messageIconType, message]);

  const child = message
    ? promptMessage()
    : typeof children === "function" ? children(props) : children;

  const content = (
    <>
      <ModalLoading loading={loading}/>
      <ModalMask
        isShow={Boolean(loading || disabled)}
        onClick={() => handleConfirmModalEventAspect("disabled")}
      />
      {child}
    </>
  );

  return (
    <React.Fragment>
      {isOpen && (
        <Modal
          title={title}
          open={isOpen}
          footer={footer ? footer : defaultFooter}
          width={styles.width}
          style={{
            top: styles.top,
            height: styles.height
          }}
          styles={modalStyles}
          closeIcon={
            <CloseOutlined
              onClick={() => handleConfirmModalEventAspect("close")}
            />
          }
          onCancel={() => handleConfirmModalEventAspect("cancel")}
          afterClose={() => handleConfirmModalEventAspect("afterClose")}
          {...restProps}
        >
          {contentScrollable ?
            <Scrollbars style={{height: contentStyles.height}} autoHide>
              {content}
            </Scrollbars>
            : content}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default React.forwardRef(ConfirmModal);
