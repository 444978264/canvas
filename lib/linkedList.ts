interface ElementNode<T> {
  $linkedList?: LinkedList<any>;
  $zIndex?: number;
  prev?: T;
  next?: T;
  zIndex: number;
}

export class LinkedList<T extends ElementNode<T>> {
  childrenList = new Set<T>();
  first?: T;
  last?: T;
  constructor() {}

  private insert(node: T) {
    if (!this.childrenList.size) {
      this.last = this.first = node;
    } else {
      let _node: T | undefined = this.last!;
      while (_node) {
        if (_node.zIndex <= node.zIndex) {
          node.next = _node.next;
          _node.next = node;
          node.prev = _node;
          this.last = node;
          break;
        } else if (_node.prev) {
          _node = _node.prev;
        } else {
          node.prev = _node.prev;
          _node.prev = node;
          node.next = _node;
          this.first = node;
          break;
        }
      }
    }
    node.$linkedList = this;
    this.childrenList.add(node);
  }

  append(node: T) {
    this.insert(node);
    if (!Reflect.has(node, "$zIndex")) {
      node.$zIndex = node.zIndex;
      Object.defineProperty(node, "zIndex", {
        get() {
          return this.$zIndex;
        },
        set(val) {
          if (val === this.zIndex) return;
          this.$zIndex = val;
          this.$linkedList.reflow(node);
        },
      });
    }
    return this;
  }
  // 移除节点
  remove(node: T) {
    if (this.childrenList.has(node) && this.childrenList.delete(node)) {
      node.$linkedList = undefined;
      // 如果是第一个
      if (this.first === node && node.next) {
        node.next.prev = undefined;
        this.first = node.next;
      } else if (this.last === node && node.prev) {
        node.prev.next = undefined;
        this.last = node.prev;
      }

      if (node.prev && node.next) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
      }

      if (!this.childrenList.size) {
        this.first = this.last = undefined;
      }
      return true;
    }

    return false;
  }

  removeAll(cbk?: (d: T) => void) {
    this.forEach((item) => {
      item.next = item.prev = undefined;
      item.$linkedList = undefined;
      cbk && cbk(item);
    });
    this.clear();
  }

  forEach(cbk: (d: T) => void) {
    if (this.childrenList.size) {
      let node = this.first;
      while (node) {
        const { next } = node;
        cbk(node);
        node = next;
      }
    }
  }

  size() {
    return this.childrenList.size;
  }

  clear() {
    this.childrenList.clear();
  }
  // 重排
  reflow(node: T) {
    if (this.remove(node)) {
      this.insert(node);
    }
  }

  *[Symbol.iterator]() {
    let node = this.first;
    while (node) {
      yield node;
      node = node.next;
    }
  }
}
