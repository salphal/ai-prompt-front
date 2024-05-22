import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle, useMemo} from "react";
import Styles from "./index.module.scss";

import classNames from "classnames";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableItem, {IDraggableItem} from "./components/draggable-item";

/**
 * "react-dnd": "^16.0.1",
 * "react-dnd-html5-backend": "^16.0.1",
 * https://github.com/AdolescentJou/react-dnd-demo
 */
export interface DraggableListProps {
  dataSource: Array<IDraggableItem>;
  setDataSource: (dataList: Array<IDraggableItem>) => void;

  [key: string]: any;
}

interface DraggableListRef {
  [key: string]: any;
}

const DraggableList: ForwardRefRenderFunction<DraggableListRef, DraggableListProps> = (
  props: DraggableListProps,
  ref: Ref<DraggableListRef | HTMLDivElement>
) => {

  const {dataSource, setDataSource} = props;

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
  }, []);

  const draggableItemOnSwapPlaces = (dragIndex: number, hoverIndex: number) => {
    const min = 0;
    const max = dataSource.length - 1;
    if (dragIndex < min || dragIndex > max || hoverIndex < min || hoverIndex > max) return;
    const data = dataSource.slice();
    const temp = data[dragIndex];
    // 交换位置
    data[dragIndex] = data[hoverIndex];
    data[hoverIndex] = temp;
    // 更新数据
    setDataSource(data);
  };

  const draggableList = useMemo(() => () => {
    if (!Array.isArray(dataSource) || !dataSource.length) {
      return [];
    }
    return dataSource.map((v: IDraggableItem, i: number) => (
      <DraggableItem
        id={`draggable-item-${i}`}
        key={`draggable-item-${i}`}
        index={i}
        onSwapPlaces={draggableItemOnSwapPlaces}
        {...v}
      />
    ));
  }, [dataSource])

  return (
    <React.Fragment>

      <DndProvider backend={HTML5Backend}>
        <div className={classNames([Styles.draggableList])}>
          {draggableList()}
        </div>
      </DndProvider>

    </React.Fragment>
  );
};

export default React.forwardRef(DraggableList);
