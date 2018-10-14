'use strict';

class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(ul) {
    let li = Util.createEl("li", ul);
    let a = Util.createEl("a", li, { href: this.data.html_url });
    a.setAttribute("target", "_blank");
    Util.createEl("img", a, { src: this.data.avatar_url });
    a.innerHTML += "<p>" + this.data.login + "</p>" + "<span>" + this.data.contributions + "</span>";
  }
}
