import * as React from 'react';

export default function useOptions(defaultOptions: any) {
  const [options, _setOptions] = React.useState(defaultOptions);

  function setOption(key: any, value: any) {
    _setOptions({ ...options, [key]: value });
  }

  return [options, setOption];
}
