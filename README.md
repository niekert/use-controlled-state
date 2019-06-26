# use-controlled-state

Managing controlled / uncontrolled values can be tedious, and maintaining the duplication between stateful and stateless components can be exhausting. `use-controlled-state abstracts` this pain away [into a simple hook](src/index.tsx).

## [See this CodeSandbox for an example](https://codesandbox.io/s/use-controlled-state-qzfz7)

## Why

Consider a `<Collapsible />` component. In most cases you just want a simple collapsible where you don't have to think about managing state where you use the component

```jsx
<Collapsible title="Open collapsible">
  <div>I'm now visible!</div>
</Collapsible>
```

As requirements evolve, the parent component might have to decide when the Collapsible component opens and closes.
You'd have to move state up to a higher component To be able to use it:

```jsx
<>
  <Collapsible
    isOpen={isOpen}
    onChange={() => setState(prevIsOpen => !prevIsOpen)}
  />
  <div>Collapsible is open? {`${isOpen}`}</div>
</>
```

Common solutions you see for this pattern involve calling the `onChange/setState` prop in component lifecyles to keep the state in sync. This hook abstracts away the pains of supporting both APIs

```tsx
import { useControlledState } from 'use-controlled-state';

interface Props {
  onChange?: (isOpen: boolean) => void;
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

function Collapsible({ onChange, isOpen, title, children }: Props) {
  const [isOpenState, setState] = useControlledState(value, onChange);

  return (
    <>
      <button onClick={() => setState(isOpen => !isOpen)}>
        Open the collapsible
      </button>
      {isOpen && children}
    </>
  );
}
```

Now you can use the component with a controlled and uncontrolled API

```jsx
<React.Fragment>
  <Collapsible title="Hello">Content</Collapsible>
  <Collapsible isOpen={isOpen} onChange={nextIsOpen => setState(nextIsOpen)} />
</React.Fragment>
```
