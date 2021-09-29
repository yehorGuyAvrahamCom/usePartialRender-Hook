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
}

export const usePartialRender = ({
  ref,
  elementSize,
  direction = 'vertical',
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
  const displayItemsCount = useMemo(
    () => Math.floor((containerSize / elementSize) * (1.4 + ratio)),
    [containerSize, elementSize, ratio]
  );
  const scrollSize = useMemo(
    () => elementSize * displayItemsCount - containerSize,
    [elementSize, displayItemsCount, containerSize]
  );
  const scrollDownBrakePoint = useMemo(
    () => scrollSize * (1 - ratio * 0.4),
    [scrollSize, ratio]
  );
  const scrollUpBrakePoint = useMemo(
    () => scrollSize - scrollDownBrakePoint,
    [scrollSize, scrollDownBrakePoint]
  );

  const handleScroll = useCallback(() => {
    const container = ref?.current as Element | null;

    if (container) {
      const scrollPosition =
        direction === 'vertical' ? container.scrollTop : container.scrollLeft;

      if (scrollPosition < scrollUpBrakePoint && shift > 0) {
        if (direction === 'vertical') {
          container.scrollTop += elementSize;
        } else {
          container.scrollLeft += elementSize;
        }

        setShift((prev) => prev - 1);
      } else if (scrollPosition > scrollDownBrakePoint) {
        if (direction === 'vertical') {
          container.scrollTop -= elementSize;
        } else {
          container.scrollLeft -= elementSize;
        }

        setShift((prev) => prev + 1);
      }
    }
  }, [
    shift,
    scrollDownBrakePoint,
    scrollUpBrakePoint,
    elementSize,
    direction,
    ref,
  ]);

  useEffect(() => {
    const container = ref?.current as Element | null;

    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ref, direction]);

  return { from: shift, to: shift + displayItemsCount };
};
