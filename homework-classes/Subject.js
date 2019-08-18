'use strict';

{
  class Subject {
    constructor() {
      this.observers = new Set();
    }

    register(observer = {}) {
      if (!(typeof observer.update === 'function')) {
        throw new Error(`Observer must implement an 'update' method.`);
      }
      this.observers.add(observer);
      return () => this.observers.delete(observer);
    }

    notify(payload) {
      this.observers.forEach(observer => observer.update(payload));
    }
  }

  window.Subject = Subject;
}
