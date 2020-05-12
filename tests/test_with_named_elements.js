class MyComponent extends Component {
  __html__ = `
    <div>
      <span as=count>0</span>
      <div>
        <div>
          <button as=btn class="button">Click me</button>
        </div>
      </div>
    </div>
  `
  foo() {}
}

//----------------------------------------------------

class MyComponent extends Component {
  foo() {}
}

MyComponent.prototype._build_ = function (m, wrap) {
  m.root = wrap(`<div><span>0</span><div><div><button class="button">Click me</button></div></div></div>`);
  m.dom = {
    count: m._lu_([0]),
    btn: m._lu_([1, 0, 0])
  };
};