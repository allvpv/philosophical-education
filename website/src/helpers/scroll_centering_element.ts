import * as React from 'react';

// For this code to work, `containerRef` should be the first
// *non-statically* positioned ancestor of `activeRef`.
//
// That is, there must not be any absolute, relative, sticky, or fixed
// elements between the `containerRef` and `activeRef` (that have
// different vertical position/dimension than `containerRef`).
//

export function scrollHCenterElement(
  domContainer: HTMLElement,
  domActiveItem: HTMLElement,
  containerInternalTopPadding: number = 0,
  containerInternalBottomPadding: number = 0,
  clipBottomToDocument: boolean = true,
): void {
  const containerRect = domContainer.getBoundingClientRect();
  const activeRect = domActiveItem.getBoundingClientRect();

  const offVisibleScrollTop =
    domContainer.scrollTop + containerInternalTopPadding;

  const containerBottomPos =
    containerRect.bottom - containerInternalBottomPadding;

  const containerVisibleBottomPos = !clipBottomToDocument
    ? containerBottomPos
    : Math.min(containerBottomPos, document.documentElement.clientHeight);

  const containerVisibleHeight =
    containerVisibleBottomPos -
    (containerRect.top + containerInternalTopPadding);

  const offVisibleScrollBottom = offVisibleScrollTop + containerVisibleHeight;

  const offActiveTop = domActiveItem.offsetTop;
  const offActiveBottom = offActiveTop + activeRect.height;

  const notInBoundary =
    offActiveTop < offVisibleScrollTop ||
    offActiveBottom > offVisibleScrollBottom;

  if (notInBoundary) {
    const newPos =
      offActiveTop -
      containerInternalTopPadding -
      containerVisibleHeight / 2 +
      activeRect.height / 2;

    domContainer.scrollTop = newPos;
  }
}

export function scrollHCenterElementAlways(
  domContainer: HTMLElement,
  domActiveItem: HTMLElement,
  containerInternalTopPadding: number = 0,
  containerInternalBottomPadding: number = 0,
  clipBottomToDocument: boolean = true,
): void {
  const containerRect = domContainer.getBoundingClientRect();
  const activeRect = domActiveItem.getBoundingClientRect();

  const offVisibleScrollTop =
    domContainer.scrollTop + containerInternalTopPadding;

  const containerBottomPos =
    containerRect.bottom - containerInternalBottomPadding;

  const containerVisibleBottomPos = !clipBottomToDocument
    ? containerBottomPos
    : Math.min(containerBottomPos, document.documentElement.clientHeight);

  const containerVisibleHeight =
    containerVisibleBottomPos -
    (containerRect.top + containerInternalTopPadding);

  const offVisibleScrollBottom = offVisibleScrollTop + containerVisibleHeight;

  const offActiveTop = domActiveItem.offsetTop;
  const offActiveBottom = offActiveTop + activeRect.height;

  const notInBoundary =
    offActiveTop < offVisibleScrollTop ||
    offActiveBottom > offVisibleScrollBottom;

  if (notInBoundary) {
    const newPos =
      offActiveTop -
      containerInternalTopPadding -
      containerVisibleHeight / 2 +
      activeRect.height / 2;

    domContainer.scrollTop = newPos;
  }
}

export function scrollVCenterElement(
  domContainer: HTMLElement,
  domActiveItem: HTMLElement,
): void {
  const containerRect = domContainer.getBoundingClientRect();
  const activeRect = domActiveItem.getBoundingClientRect();

  const containerWidth = containerRect.right - containerRect.left;
  const offActiveLeft = domActiveItem.offsetLeft;
  const offActiveRight = offActiveLeft + activeRect.width;
  const offScrollRight = domContainer.scrollLeft + containerWidth;

  const notInBoundary =
    offActiveLeft < domContainer.scrollLeft || offActiveRight > offScrollRight;

  if (notInBoundary) {
    const newPos = offActiveLeft - containerWidth / 2 + activeRect.width / 2;

    domContainer.scrollLeft = newPos;
  }
}
