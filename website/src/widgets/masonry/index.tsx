import * as React from 'react';

export default function getMasonry(widgets: JSX.Element[]) {
  let uniqueKey = 1;

  let breakElements = [
    () => <React.Fragment key={uniqueKey++} />,
    () => (
      <div className="block break-before-column lx:hidden" key={uniqueKey++} />
    ),
    () => (
      <div className="hidden break-before-column lx:block" key={uniqueKey++} />
    ),
  ];

  let columnLayouts = [1, 2, 3];
  // Remaining elements after all other elements are evenly distributed
  let columnRests = columnLayouts.map((cols) => widgets.length % cols);

  let recalculateColumnLeftElements = (i: number) => {
    let left = Math.floor(widgets.length / columnLayouts[i]);

    if (columnRests[i]) {
      left += 1;
      columnRests[i] -= 1;
    }

    return left;
  };

  let columnLeftElements = columnLayouts.map((_1, i) =>
    recalculateColumnLeftElements(i),
  );

  let elements = [];

  for (let i = 0; i < widgets.length; ++i) {
    columnLeftElements = columnLeftElements.map((left, i) => {
      if (left === 0) {
        elements.push(breakElements[i]());
        return recalculateColumnLeftElements(i) - 1;
      } else {
        return left - 1;
      }
    });

    if (i < widgets.length) elements.push(widgets[i]);
  }

  return (
    <div
      className="gap-3 px-[10px] pb-[24px] pt-1 sm:columns-2 sm:px-[24px] sm:pt-[24px]
        lx:columns-3">
      {elements}
    </div>
  );
}
