import * as React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { useControlledState } from '../src';

interface Props {
  onChange?: (value: boolean) => void;
  value?: boolean;
}

afterEach(cleanup);

function TestComponent({ value, onChange }: Props) {
  const [isToggled, setState] = useControlledState(value, onChange);

  return (
    <>
      <button onClick={() => setState(val => !val)}>
        Toggle with callback
      </button>
      <button onClick={() => setState(!isToggled)}>Toggle with value</button>
      {isToggled ? <span>Toggle is on</span> : <span>Toggle is off</span>}
    </>
  );
}

describe('useControlledState', () => {
  const assertState = (ui: React.ReactElement) => {
    const { queryByText, getByText } = render(ui);

    expect(queryByText('Toggle is off')).not.toBeNull();

    fireEvent.click(getByText('Toggle with callback'));

    expect(queryByText('Toggle is on')).not.toBeNull();

    fireEvent.click(getByText('Toggle with value'));

    expect(queryByText('Toggle is off')).not.toBeNull();
  };

  test('Works for uncontrolled components', () => {
    assertState(<TestComponent />);
  });

  test('Works for controlled components with callback', () => {
    const ControlledComponent = () => {
      const [state, setState] = React.useState(false);

      return (
        <TestComponent
          value={state}
          onChange={() => setState(isOpen => !isOpen)}
        />
      );
    };

    assertState(<ControlledComponent />);
  });

  test('Works for controlled components with value', () => {
    const ControlledComponent = () => {
      const [state, setState] = React.useState(false);

      return <TestComponent value={state} onChange={() => setState(!state)} />;
    };

    assertState(<ControlledComponent />);
  });

  test('retrieves the correct next value from the component', () => {
    const ControlledComponent = () => {
      const [state, setState] = React.useState(false);

      return (
        <TestComponent
          value={state}
          onChange={nextValue => setState(nextValue)}
        />
      );
    };

    assertState(<ControlledComponent />);
  });

  test('Works with default value', () => {
    const { queryByText } = render(<TestComponent value={true} />);

    expect(queryByText('Toggle is on')).not.toBeNull();
  });
});
