/** @jsxImportSource @emotion/react */
import React, {
  ForwardRefRenderFunction,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';

const draggableItemStyle = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const draggableItemDragIconStyle: any = css`
  &:active {
    cursor: grab;
  }
`;

const draggableItemContentStyle = {
  flex: 1,
};

export type TDraggableItemRender = (...record: any[]) => ReactNode;

export interface IDraggableItem {
  id?: string;
  render: ReactNode | TDraggableItemRender;

  [key: string]: any;
}

export interface DraggableItemProps {
  id: string;
  index: number;
  onSwapPlaces: (dragIndex: number, hoverIndex: number) => void;

  [key: string]: any;
}

interface DraggableItemRef {
  [key: string]: any;
}

const DraggableItem: ForwardRefRenderFunction<DraggableItemRef, DraggableItemProps> = (
  props: DraggableItemProps,
  ref: Ref<DraggableItemRef | HTMLDivElement>,
) => {
  const { id, render, index, onSwapPlaces } = props;

  const draggableItemRef = useRef(null);

  // 因为没有定义收集函数，所以返回值数组第一项不要
  const [, drop] = useDrop({
    accept: 'DraggableItem',
    hover: (item: any) => {
      if (!draggableItemRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return; // 如果回到自己的坑，那就什么都不做
      onSwapPlaces(+dragIndex, +hoverIndex); // 调用传入的方法完成交换
      item.index = hoverIndex; // 将当前当前移动到Box的index赋值给当前拖动的box，不然会出现两个盒子疯狂抖动！
    },
    drop: () => {},
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'DraggableItem',
    item: { id, index },
    end: () => {},
    isDragging: (monitor) => {
      return index === monitor.getItem().index;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <div
        className={classNames([])}
        ref={drag(drop(draggableItemRef)) as any} // 这样写可以让它即接收拖拽又实现拖拽
        style={{
          opacity: isDragging ? 0.3 : 1,
          ...draggableItemStyle,
        }}
      >
        <HolderOutlined css={draggableItemDragIconStyle} />
        <div style={draggableItemContentStyle}>
          {typeof render === 'function' ? render(props) : render}
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(DraggableItem);
