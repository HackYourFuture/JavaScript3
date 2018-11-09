'use strick';

class Contributor {
  constructor(data) {
    this.data = data;
  }

  render(ul) {
    let li = Util.createEl("li", ul);
    let a = Util.createEl("a", li, {
      href: this.data.html_url, target: "_blank"
    });
    Util.createEl("img", a, { src: this.data.avatar_url });
    Util.createEl("p", a, { txt: this.data.login });
    Util.createEl("span", a, { txt: this.data.contributions });
  }
}
