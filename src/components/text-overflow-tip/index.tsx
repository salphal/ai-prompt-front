import React, {useEffect, useImperativeHandle, ForwardRefRenderFunction, Ref, useRef, useState, ReactNode} from "react";
import {Tooltip} from "antd";
import useClientRect from "@/hooks/useClientRect.ts";

const singleLineStyle = (width: number) => ({
  width,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
});

const multiLineStyle = (width: number, total: number) => ({
  width,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical' as const,
  WebkitLineClamp: total as number
});

export interface TextOverflowTipProps {
  [key: string]: any;

  /** 多行模式 */
  multiLine?: boolean;
  /** 总共多少行 */
  multiNumber: number;
  /** 文本内容 */
  children?: ReactNode;
  /** 宽度 */
  width?: number;
  /** 触发方式 */
  trigger?: 'hover' | 'focus' | 'click' | 'contextMenu';
}

interface TextOverflowTipRef {
  [key: string]: any;

}

const TextOverflowTip: ForwardRefRenderFunction<TextOverflowTipRef, TextOverflowTipProps> = (
  props: TextOverflowTipProps,
  ref: Ref<TextOverflowTipRef | HTMLDivElement>
) => {

  const {
    children,
    width: originalWidth = 200,
    trigger = 'hover',
    multiLine = false,
    multiNumber = 1,
    ...resetProps
  } = props;

  const [tip, setTip] = useState('');

  const contentRef = useRef(null);
  const {width: realWidth} = useClientRect({domRef: contentRef});

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!realWidth || !children || typeof children !== 'string') {
      setTip('');
      return;
    }
    originalWidth - 1 >= realWidth ? setTip('') : setTip(children);
  }, [children, originalWidth, realWidth]);

  return (
    <React.Fragment>

      {typeof children === 'string'
        ? <Tooltip title={tip} {...resetProps} autoAdjustOverflow>
        <span
          ref={contentRef}
          style={
            multiLine ?
              multiLineStyle(originalWidth, multiNumber) :
              singleLineStyle(originalWidth)
          }
        >{children}</span>
        </Tooltip>
        : children
      }

    </React.Fragment>
  );
};

export default React.forwardRef(TextOverflowTip);
