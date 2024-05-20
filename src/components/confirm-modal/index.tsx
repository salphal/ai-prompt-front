import React, {
  useEffect,
  useImperativeHandle,
  ForwardRefRenderFunction,
  Ref,
  useState,
  ReactNode,
  useMemo
} from "react";
import {Button, ConfigProvider, Modal, Spin} from "antd";
import {CloseOutlined, InfoCircleFilled, CheckCircleFilled} from '@ant-design/icons';
import {createStyles} from 'antd-style';

const useStyle = createStyles(() => ({
  'confirm-modal-header': {},
  'confirm-modal-body': {
    position: 'relative',
  },
  'confirm-modal-content': {},
  'confirm-modal-footer': {},
  'confirm-modal-mask': {},
}));

const modalIconList: any = {
  info: <InfoCircleFilled/>,
  success: <CheckCircleFilled/>,
  danger: <InfoCircleFilled/>,
};

export interface ConfirmModalProps {
  [key: string]: any;

  /** 弹窗标题 */
  title?: ReactNode;
  /** 是否在加载 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义底部控制按钮 */
  footer?: ReactNode;

  /** 弹窗消息内容 */
  message?: string;
  /** 弹窗消息icon类型 */
  messageIconType?: string;

  /** 弹窗距离顶部的位置 */
  top: string | number;
  /** 弹窗宽度 */
  width?: string | number;
  /** 弹窗高度 */
  height?: string | number;
  /** 弹窗内容区那边距 */
  contentPadding?: string | number;

  /** 自动取消, 关闭Modal */
  closedAble?: boolean;
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
}

interface ConfirmModalRef {
  [key: string]: any;
}

const ConfirmModal: ForwardRefRenderFunction<ConfirmModalRef, ConfirmModalProps> = (
  props: ConfirmModalProps,
  ref: Ref<ConfirmModalRef | HTMLDivElement>
) => {

  const {
    title = '提示',
    loading = false,
    disabled = false,
    footer,

    message = '',
    messageIconType = '',

    top = '20%',
    width = 500,
    height = 'auto',
    contentPadding = '8px 0 12px 0',

    closedAble = false,
    onConfirm,
    onCancel,
    onClose,
    onAfterClose,
    onDisabledClick,

    children = <>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </>,

    ...restProps
  } = props;

  const {styles} = useStyle();

  const [isOpen, setIsOpen] = useState(false);

  const classNames = {
    body: styles['confirm-modal-body'],
    mask: styles['confirm-modal-mask'],
    header: styles['confirm-modal-header'],
    footer: styles['confirm-modal-footer'],
    content: styles['confirm-modal-content'],
  };

  const modalStyles = {
    header: {},
    body: {
      padding: contentPadding
    },
    mask: {},
    footer: {
      marginTop: 0
    },
    content: {},
  };


  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({
    isOpen,
    setIsOpen,
    showModal: () => handleConfirmModalEventAspect('show'),
    hideModal: () => handleConfirmModalEventAspect('hide'),
  }));

  useEffect(() => {
  }, []);

  const handleConfirmModalEventAspect = (type: string, kwargs: object = {}, ...args: any[]) => {
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
    typeof onConfirm === 'function' && onConfirm();
  };

  const handleConfirmModalOnCancel = () => {
    closedAble && setIsOpen(false);
    typeof onCancel === 'function' && onCancel();
  };

  const handleConfirmModalOnClose = () => {
    setIsOpen(false);
    typeof onClose === 'function' && onClose();
  };

  const handleConfirmModalOnAfterClose = () => {
    typeof onAfterClose === 'function' && onAfterClose();
  };

  const handleConfirmModalOnDisabled = () => {
    typeof onDisabledClick === 'function' && onDisabledClick();
  };

  const handleConfirmModalOnShow = () => {
    setIsOpen(true);
  };

  const handleConfirmModalOnHide = () => {
    setIsOpen(false);
  };

  const defaultFooter = <>
    <Button
      type="primary"
      onClick={() => handleConfirmModalEventAspect('confirm')}
      loading={loading}
    >
      确认
    </Button>
    <Button
      onClick={() => handleConfirmModalEventAspect('destroy')}
      disabled={loading}
    >
      取消
    </Button>
  </>;

  const promptMessage = useMemo(() => {
    let icon: any = null;
    return () => {
      if (Object.keys(modalIconList).includes(messageIconType)) {
        icon = modalIconList[messageIconType];
      }
      return (
        <div
          style={{
            padding: '30px 0 60px 0',
            textAlign: 'center',
            fontSize: '18px',
          }}
        >
          {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
          <span>{message}</span>
        </div>
      );
    };
  }, [messageIconType, message]);

  const content = message ?
    promptMessage() :
    typeof children === 'function' ? children(props) : children;

  return (
    <React.Fragment>

      <ConfigProvider
        modal={{
          classNames,
          styles: modalStyles,
        }}
      >
        {isOpen && <Modal
          title={title}
          open={isOpen}
          footer={footer ? footer : defaultFooter}
          width={width}
          style={{top, height}}
          closeIcon={<CloseOutlined onClick={() => handleConfirmModalEventAspect('close')}/>}
          onCancel={() => handleConfirmModalEventAspect('cancel')}
          afterClose={() => handleConfirmModalEventAspect('afterClose')}
          {...restProps}
        >
          {loading && <Spin
            style={{
              position: 'absolute',
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />}
          {loading || disabled && <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              backgroundColor: 'transparent',
              zIndex: 9999,
              cursor: "not-allowed",
            }}
            onClick={() => handleConfirmModalEventAspect('disabled')}
          />}
          {content}
        </Modal>}
      </ConfigProvider>

    </React.Fragment>
  );
};

export default React.forwardRef(ConfirmModal);
