function refEquals(a, b) {
    return a === b
}

class Node {
    constructor(children = {}, elements = []) {
        this.children = children
        this.elements = elements
    }

    addElements(path, elements) {
        if (path.length === 0) {
            this.elements = [...this.elements, ...elements]
        } else {
            const [ first, ...rest ] = path
            let child = this.children[first]
            if (!child) {
                child = new Node()
                this.children[first] = child
            }
            child.addElements(rest, elements)
        }
    }

    addElement(path, element) {
        this.addElements(path, [element])
    }

    isEmpty() {
        return this.elements.length === 0 &&
            Object.keys(this.children).length === 0
    }

    removeElement(path, element, compareWith = refEquals) {
        const { children, elements } = this
        if (path.length === 0) {
            this.elements = elements.filter(e => !compareWith(e, element))
            return
        }

        const [ first, ...rest ] = path
        const nextNode = this.children[first]
        if (this.isEmpty() || !nextNode) {
            return
        }

        nextNode.removeElement(rest, element, compareWith)
        
        // Prune child branch from current node if we just removed all descendant elements
        if (nextNode.isEmpty()) {
            delete this.children[first]
        }
    }

    /**
     * Get the node at the given path
     *
     * @param {Array<string>} path
     * @return {Node|null} Node at the given path. Null if node does not exist
     */
    walk(path) {
        if (path.length === 0) {
            return this
        }

        const [ first, ...rest ] = path
        const nextNode = this.children[first]
        return nextNode ? nextNode.walk(rest) : null
    }

    /**
     * Collect all of the elements stored from the node passed down to the element at path
     * 
     * @param {Array<string>} path
     * @return {Array} Collected elements
     */
    collect(path) {
        if (path.length === 0) {
            return this.elements
        }
        const [ first, ...rest ] = path
        const nextNode = this.children[first]
        if (!nextNode) {
            return this.elements
        }

        return [...nextNode.collect(rest), ...this.elements]
    }

    /**
     * Gets the trie of elements matching the prefix path
     *
     * @param {Array<string>} path
     * @returns {Trie|null}
     */
    subTrie(path) {
        if (path.length === 0) {
            return this
        }
        const [ first, ...rest ] = path
        const nextNode = this.children[first]
        if (!nextNode) {
            return null
        }
        return nextNode.subTrie(rest)
    }

    /**
     * Gets all elements that have a given prefix
     *
     * @param {Array<string>} path
     * @return {Array} All elements who match path as a prefix
     */
    search(path) {
        const sub = this.subTrie(path)
        return sub ? [...sub] : []
    }

    /**
     * Determines if the trie contains a given path
     *
     * @param {Array<string>} path
     * @return {boolean} True if the path, `path`, exists in the trie
     */
    contains(path) {
        return this.search(path).length > 0
    }

    *[Symbol.iterator]() {
        for (let element of this.elements) {
            yield element
        }

        for (let childName in this.children) {
            yield* this.children[childName][Symbol.iterator]()
        }
    }

    entriesIter(path = []) {
        const t = this

        return {
            *[Symbol.iterator]() {
                for (let element of t.elements) {
                    yield [path, element]
                }

                for (let childName in t.children) {
                    yield* t.
                        children[childName].
                        entriesIter(path.concat([childName]))
                        [Symbol.iterator]()
                }
            }
        }
    }
}

module.exports = Node
