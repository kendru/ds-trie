# ds-trie

### A dead-simple trie data structure for JavaScript

### Usage:

```
const trie = require('ds-trie');
const assert = require('assert');

const t = new Trie();

t.addElement(['path', 'a'], 'something');
t.addElements(['path', 'b'], ['other', 'stuff']);
t.removeElement(['path', 'b'], 'other');

t.addElement(['path'], 'root');

assert.deepStrictEqual(t.collect(['path', 'b']), ['stuff', 'root']);
```

