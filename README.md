# ds-trie

### A dead-simple trie data structure for JavaScript

### Usage:

```
const trie = require('ds-trie');

const t = trie();

t.addElement(['path', 'a'], 'something');
t.addElements(['path', 'b'], ['other', 'stuff']);
t.removeElement(['path', 'b'], 'other');

t.addElement(['path'], 'root');

assert(elementsEqual(t.collect(['path', 'b']), ['stuff', 'root']));

const elementsEqual = (xs, ys) => {
  if (xs.length !== ys.length) return false;
  for (let i = 0; i < xs.length; x++) {
    if (xs[i] !== ys[i]) return false;
  }
  return true;
}
```

