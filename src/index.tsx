import { useState, useCallback } from 'react';

// Either use the callback `setState` signature or just a "void"
type OnChange<T> = (v: React.SetStateAction<T>) => T | void;

export function useControlledState<
  TState,
  TOnChange extends Function = OnChange<TState>
>(value: TState, onChange?: TOnChange): [TState, OnChange<TState>] {
  const [uncontrolledValue, setUncontrolledValue] = useState(value);
  const onControlledChange = useCallback(() => {
    if (onChange) {
      onChange(value);
    }
  }, [onChange, value]);

  if (typeof onChange === 'function') {
    // Controlled version
    return [value, onControlledChange];
  }

  // Uncontrolled version
  return [uncontrolledValue, setUncontrolledValue];
}
