class MyView extends View {
  __html__ = `
    <div>
      <span nest="|.items|TodoView|.getKey"/>
    </div>
  `
}

//----------------------------------------------------

class MyView extends View {}

MyView.prototype.__wq = {
  '': function () {
    return true;
  }
};

MyView.prototype.__wc = {
  '': [function (n, o) {
    this.dom.__1.views(this.dom.__2.getMany(this.items, this, true));
  }]
};

MyView.prototype.__ht = '<div><span></span></div>';

MyView.prototype.__bv = function (view, prototype) {
  view.__bd(prototype, false);
  view.dom = {
    __2: view.__nc(TodoView, this.getKey),
    __1: view.__gw([0])
  };
};
