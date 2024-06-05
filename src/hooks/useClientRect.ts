import { useEffect, useState } from 'react';

const initialClientRect = {
  top: null,
  right: null,
  bottom: null,
  left: null,
  width: null,
  height: null,
  x: null,
  y: null,
};

export interface IClientRect {
  /** 元素的顶部边界相对于视口( viewport )顶部的距离 */
  top: number | null;
  /** 元素的右侧边界相对于视口左侧的距离 */
  right: number | null;
  /** 元素的底部边界相对于视口顶部的距离 */
  bottom: number | null;
  /** 元素的左侧边界相对于视口左侧的距离 */
  left: number | null;
  /** 元素的宽度 */
  width: number | null;
  /** 元素的高度 */
  height: number | null;
  /** 元素左上角的横坐标，相对于视口左侧 */
  x: number | null;
  /** 元素左上角的纵坐标，相对于视口顶部 */
  y: number | null;
}

export interface IUseClientRectProps {
  [key: string]: any;

  id?: string;
  clazzName?: string;
  domRef?: any;
}

/**
 * Get the clientHeight of the element based on id
 *
 * @param props {Object}
 */
const useClientRect = (props: IUseClientRectProps) => {
  const { id, clazzName, domRef } = props;

  const [rect, setRect] = useState<IClientRect>(initialClientRect);

  useEffect(() => {
    windowOnResize();
    window.addEventListener('resize', windowOnResize);
    return () => {
      window.removeEventListener('resize', windowOnResize);
    };
  }, [id, clazzName, domRef]);

  const windowOnResize = () => {
    let element = null;
    if (domRef) {
      element = domRef.current;
    } else if (id) {
      element = document.getElementById(id);
    } else if (clazzName) {
      element = document.querySelector(clazzName);
    }
    if (element !== null && !!element.getBoundingClientRect && element instanceof HTMLElement) {
      const rect = element.getBoundingClientRect();
      setRect(rect);
    }
  };

  return rect;
};

export default useClientRect;
