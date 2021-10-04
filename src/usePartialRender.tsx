import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  MutableRefObject,
} from 'react';

export interface IUsePartialRenderProps {
  ref?: MutableRefObject<null>;
  elementSize: number;
  direction?: 'vertical' | 'horizontal';
  horizontalRef?: MutableRefObject<null>;
  verticalRef?: MutableRefObject<null>;
}

export const usePartialRender = ({
  ref,
  elementSize,
  direction = 'vertical',
  horizontalRef,
  verticalRef,
}: IUsePartialRenderProps) => {
  const [shift, setShift] = useState(0);
  const [containerSize, setContainerSize] = useState(0);

  useEffect(() => {
    const container = ref?.current as Element | null;

    if (container) {
      const size =
        direction === 'vertical'
          ? container.clientHeight
          : container.clientWidth;

      setContainerSize(size);
    }
  }, [ref, direction]);

  const ratio = useMemo(
    () => elementSize / containerSize,
    [elementSize, containerSize]
  );
  const itemsCount = useMemo(
    () => Math.floor((containerSize / elementSize) * (1.4 + ratio)),
    [containerSize, elementSize, ratio]
  );
  const scrollSize = useMemo(
    () => elementSize * itemsCount - containerSize,
    [elementSize, itemsCount, containerSize]
  );
  const scrollDownBrakePoint = useMemo(
    () => scrollSize * (1 - ratio * 0.4),
    [scrollSize, ratio]
  );
  const scrollUpBrakePoint = useMemo(
    () => scrollSize - scrollDownBrakePoint,
    [scrollSize, scrollDownBrakePoint]
  );

  const updateVerticalContainer = useCallback(() => {
    const container = ref?.current as Element | null;
    const verticalContainer = verticalRef?.current as Element | null;

    if (container && verticalContainer) {
      verticalContainer.scrollTop = container.scrollTop + shift * elementSize;
    }
  }, [ref, verticalRef, elementSize, shift]);

  const updateHorizontalContainer = useCallback(() => {
    const container = ref?.current as Element | null;
    const horizonalContainer = horizontalRef?.current as Element | null;

    if (container && horizonalContainer) {
      horizonalContainer.scrollLeft =
        container.scrollLeft + shift * elementSize;
    }
  }, [ref, horizontalRef, elementSize, shift]);

  const handleScroll = useCallback(() => {
    const container = ref?.current as Element | null;

    if (container) {
      const scrollPosition =
        direction === 'vertical' ? container.scrollTop : container.scrollLeft;

      if (scrollPosition < scrollUpBrakePoint && shift > 0) {
        if (direction === 'vertical') {
          container.scrollTop += elementSize;
          updateVerticalContainer();
        } else {
          container.scrollLeft += elementSize;
          updateHorizontalContainer();
        }

        setShift((prev) => prev - 1);
      } else if (scrollPosition > scrollDownBrakePoint) {
        if (direction === 'vertical') {
          container.scrollTop -= elementSize;
          updateVerticalContainer();
        } else {
          container.scrollLeft -= elementSize;
          updateHorizontalContainer();
        }

        setShift((prev) => prev + 1);
      }

      updateVerticalContainer();
      updateHorizontalContainer();
    }
  }, [
    shift,
    scrollDownBrakePoint,
    scrollUpBrakePoint,
    elementSize,
    direction,
    ref,
    updateHorizontalContainer,
    updateVerticalContainer,
  ]);

  useEffect(() => {
    const container = ref?.current as Element | null;

    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ref, direction]);

  return {
    from: shift,
    to: shift + itemsCount,
    size: elementSize * itemsCount,
    itemsCount,
  };
};
