import * as React from 'react';
import usePrevious from '../hooks/usePrevious';
import IntersectionObserver from 'inteobs';

export type VisibilityTriggerProps = {
  children?: React.ReactNode;
  onVisible?: () => any;
  onHidden?: () => any;
};

export function VisibilityTrigger({
  onVisible,
  onHidden,
  ...rest
}: VisibilityTriggerProps) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const wasVisible = usePrevious(isVisible);

  React.useEffect(() => {
    if (!!wasVisible !== isVisible) {
      if (isVisible) {
        onVisible?.();
      } else {
        onHidden?.();
      }
    }
  }, [wasVisible, isVisible, onHidden, onVisible]);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const { current } = elementRef;

    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    });

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return <div ref={elementRef} {...rest} />;
}
