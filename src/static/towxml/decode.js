const config = require("./config");

Component({
  options: {
    styleIsolation: "apply-shared",
  },
  properties: {
    nodes: {
      type: Object,
      value: {},
    },
  },
  lifetimes: {
    attached: function () {
      const _ts = this;

      config.events.forEach((item) => {
        _ts["_" + item] = function (...arg) {
          if (global._events && typeof global._events[item] === "function") {
            global._events[item](...arg);
          }
        };
      });
    },
  },
  methods: {
    queryHeadings(callback) {
      // 获取所有标题元素的信息，并通过回调返回
      this.createSelectorQuery()
        .selectAll(".h2w__h1, .h2w__h2, .h2w__h3, .h2w__h4, .h2w__h5, .h2w__h6")
        .boundingClientRect((rects) => {
          callback(rects);
        })
        .exec();
    },
  },
});
