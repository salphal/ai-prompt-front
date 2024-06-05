import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Popover } from 'antd';

import useClientRect from '@/hooks/useClientRect.ts';

const singleLineStyle = (width: number | string = 'auto'): any => ({
  display: 'inline-block',
  maxWidth: width,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const multiLineStyle = (width: number | string = 'auto', total: number): any => ({
  maxWidth: width,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: total as number,
});

export interface TextOverflowTipProps {
  [key: string]: any;

  /** 多行模式 */
  multiLine?: boolean;
  /** 总共多少行 */
  multiNumber: number;
  /** 文本内容 */
  children?: any;

  /** 宽度 */
  width?: number;
  /** 弹窗背景色 */
  color?: string;

  /** 鼠标移入后延时多少才显示 */
  mouseEnterDelay: number;
  /** 鼠标移出后延时多少才隐藏 */
  mouseLeaveDelay: number;
  /** 触发方式 */
  trigger?: 'hover' | 'focus' | 'click';

  /** 弹出内容的渲染 */
  popRender: (...args: any[]) => void;
  /** 是否弹出提示 */
  popAble: boolean;

  /** 显示隐藏的回调 */
  onOpenChange?: (open: boolean) => void;
}

interface TextOverflowTipRef {
  [key: string]: any;
}

const TextOverflowTip: ForwardRefRenderFunction<TextOverflowTipRef, TextOverflowTipProps> = (
  props: TextOverflowTipProps,
  ref: Ref<TextOverflowTipRef | HTMLDivElement>,
) => {
  const {
    children,

    width: originalWidth = 200,
    color = 'white',
    trigger = 'hover',

    mouseEnterDelay = 0.3,
    mouseLeaveDelay = 0.3,

    multiLine = false,
    multiNumber = 1,

    popAble = true,
    popRender,

    ...resetProps
  } = props;

  const [isOverflow, setIsOverflow] = useState<any>(false);

  const contentRef = useRef(null);
  const { width: realWidth } = useClientRect({ domRef: contentRef });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!realWidth) return;
    setIsOverflow(originalWidth <= realWidth);
  }, [children, originalWidth, realWidth]);

  const overflowContent = useMemo(
    () => () => {
      return (
        <span
          ref={contentRef}
          style={
            multiLine ? multiLineStyle(originalWidth, multiNumber) : singleLineStyle(originalWidth)
          }
        >
          {children}
        </span>
      );
    },
    [multiLine],
  );

  const content = typeof children === 'function' ? children(props) : children;

  const popoverContent = typeof popRender === 'function' ? popRender(props) : content;

  return (
    <React.Fragment>
      {popAble && isOverflow ? (
        <Popover content={popoverContent} trigger={trigger} autoAdjustOverflow {...resetProps}>
          {overflowContent()}
        </Popover>
      ) : (
        overflowContent()
      )}
    </React.Fragment>
  );
};

export default React.forwardRef(TextOverflowTip);
