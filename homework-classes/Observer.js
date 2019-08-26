'use strict';

{
  class Observer {
    constructor(Observable) {
      Observable.subscribe(this);
    }

    update() {
      throw new Error('Observer: the `update` method should be overridden.');
    }
  }

  window.Observer = Observer;
}
