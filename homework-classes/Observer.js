'use strict';

{
  class Observer {
    constructor(subject) {
      subject.register(this);
    }
  }

  window.Observer = Observer;
}
