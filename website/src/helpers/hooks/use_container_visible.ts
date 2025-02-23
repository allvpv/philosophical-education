import * as React from 'react';

export default function useContainerVisible(domElement: HTMLElement | null) {
  const [isContainerVisible, setContainerVisible] = React.useState(true);

  React.useEffect(() => {
    if (domElement) {
      let observer = new IntersectionObserver(
        (entries) => {
          setContainerVisible(entries[0].intersectionRatio > 0);
        },
        {
          root: document.body,
          threshold: 0.1,
        },
      );

      observer.observe(domElement);

      return () => observer.disconnect();
    }
  }, [domElement]);

  return isContainerVisible;
}
