class MyView extends View {
  __html__ = `
    <div>
      <br/>
      <NestedView args=m.obj.test/>
    </div>
  `
  foo() {}
}

//----------------------------------------------------

class MyView extends View {
  foo() {}
}

MyView.prototype.__bv = function (view, wrap) {
  view.root = wrap(`<div><br /><NestedView></NestedView></div>`);
  view.__rn([1], view.nest(NestedView, m.obj.test));
  view.dom = {};
};