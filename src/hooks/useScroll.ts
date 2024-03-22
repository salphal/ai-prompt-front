import React, { Ref, useEffect, useRef } from 'react';

const isString = (target: any): boolean => typeof target === 'string';

const isFunction = (target: any): boolean => typeof target === 'function';

const isElement = (htmlElement: any): boolean =>
  htmlElement !== null && htmlElement instanceof Element;

const isElementRefObject = <T,>(value: any): value is React.RefObject<T> => {
  return (
    value &&
    typeof value === 'object' &&
    'current' in value &&
    Object.prototype.toString.call(value) === '[object Object]' &&
    isElement(value.current)
  );
};

const getHtmlElement = (
  htmlElement: Ref<Element> | Element | string
): Element | null => {
  let dom: Element | null = null;

  try {
    if (isElementRefObject(htmlElement)) {
      dom = htmlElement!.current as Element;
    } else if (isElement(htmlElement)) {
      dom = htmlElement as Element;
    } else if (isString(htmlElement)) {
      dom = document.querySelector(htmlElement as string);
    } else {
      throw new Error('Please pass the correct parameters element');
    }
  } catch (err: any) {
    console.error(err);
  }

  return dom instanceof Element ? dom : null;
};

const getElementRect = (dom: Element) => {
  const rect = dom.getBoundingClientRect();
  return { rect, scrollTop: dom.scrollTop, scrollHeight: dom.scrollHeight };
};

const useScroll = (kwargs: { [key: string]: any }) => {
  /**
   * @param htmlElement {Element}           HTML元素
   * @param htmlElementRef {Ref<Element>}   useRef<Element>();
   * @param querySelector {String}          用于查询元素的 id/class/tagName
   *
   * @param isShow {boolean}                有且仅当该元素显示的时候才执行( 在弹窗中时 )
   * @param minOffsetHeight {Number}        滚动条到底部的最小偏移量
   *
   * @param onScroll {Function}             元素滚动事件
   * @param onTouchToBottom {Function}      元素滚动条到底部事件
   */
  const {
    htmlElement = null,
    htmlElementRef = null,
    querySelector = '',

    isShow = false,
    minOffsetHeight = 0,

    onScroll = () => {},
    onTouchToBottom = () => {},
  } = kwargs;

  const domRef = useRef<Element | null>(null);
  const domRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!isShow) return;

    const dom = getHtmlElement(htmlElementRef || htmlElement || querySelector);
    if (!isElement(dom)) return;

    domRef.current = dom;
    dom!.addEventListener('scroll', domOnScroll);

    return () => {
      if (isElement(dom)) dom!.removeEventListener('scroll', domOnScroll);
    };
  }, [isShow, htmlElement, htmlElementRef, querySelector]);

  const domOnScroll = () => {
    if (!isElement(domRef.current)) return;

    isFunction(onScroll) && onScroll();

    const { rect, scrollTop, scrollHeight } = getElementRect(
      domRef.current as Element
    );

    const { height } = rect;
    domRectRef.current = rect;

    // The scroll bar touches the bottom
    if (height + scrollTop + minOffsetHeight >= scrollHeight) {
      isFunction(onTouchToBottom) && onTouchToBottom();
    }
  };

  const scrollTo = (x: number, y: number) => {
    if (!(domRef.current instanceof Element)) return;
    try {
      domRef.current.scrollTo({
        left: x || 0,
        top: y || 0,
        behavior: 'smooth',
      });
    } catch (e) {
      console.error('[Illegal Param]: domRef.current is not html element');
    }
  };

  const scrollToTop = () => {
    scrollTo(0, 0);
  };

  const scrollToBottom = () => {
    if (
      domRef.current instanceof Element &&
      domRectRef.current instanceof DOMRect
    ) {
      const y = domRectRef.current.top + domRef.current.scrollTop;
      scrollTo(0, y);
    }
  };

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
};

export default useScroll;
