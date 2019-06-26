import { useState, useCallback } from 'react';

// Either use the callback `setState` signature or just a "void"
type OnChange<T> = (v: React.SetStateAction<T>) => T | void;
type StateUpdater<T> = (v: T) => T;

export function useControlledState<
  TState,
  TOnChange extends Function = OnChange<TState>
>(value: TState, onChange?: TOnChange): [TState, OnChange<TState>] {
  if (typeof value == 'function') {
    throw new TypeError(
      'Functions are not supported as state values in the `useControlledState` hook.'
    );
  }

  const [uncontrolledValue, setUncontrolledValue] = useState(value);
  const onControlledChange = useCallback(
    (setStateArgument: React.SetStateAction<TState>) => {
      if (onChange) {
        let changeValue: TState | StateUpdater<TState> = setStateArgument;
        if (typeof changeValue === 'function') {
          changeValue = (setStateArgument as StateUpdater<TState>)(value);
        }

        onChange(changeValue);
      }
    },
    [onChange, value]
  );

  if (typeof onChange === 'function') {
    // Controlled version
    return [value, onControlledChange];
  }

  // Uncontrolled version
  return [uncontrolledValue, setUncontrolledValue];
}
