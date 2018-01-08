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
            this.elements = this.elements.concat(elements)
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
}

module.exports = Node
