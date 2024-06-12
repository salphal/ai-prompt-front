import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

export interface SortableTableProps {
  [key: string]: any;
}

interface SortableTableRef {
  [key: string]: any;
}

/**
 * https://ant-design.antgroup.com/components/table-cn#components-table-demo-drag-sorting
 *
 * 注意: id 必须唯一
 * 注意: id 必须唯一
 * 注意: id 必须唯一
 */
const SortableTable: ForwardRefRenderFunction<SortableTableRef, SortableTableProps> = (
  props: SortableTableProps,
  ref: Ref<SortableTableRef | HTMLDivElement>,
) => {
  const { columns = [], dataSource = [], setDataSource, ...restProps } = props;

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {}, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id && typeof setDataSource === 'function') {
      setDataSource((prev: any) => {
        const activeIndex = prev.findIndex((v: any) => v.id === active.id);
        const overIndex = prev.findIndex((v: any) => v.id === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  return (
    <React.Fragment>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={dataSource.map((v: any) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            // rowKey="key"
            columns={columns}
            dataSource={dataSource}
            {...restProps}
          />
        </SortableContext>
      </DndContext>
    </React.Fragment>
  );
};

export default React.forwardRef(SortableTable);
