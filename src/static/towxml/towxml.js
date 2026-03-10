Component({
  options: {
    styleIsolation: "shared",
  },
  properties: {
    nodes: {
      type: Object,
      value: {},
    },
  },
  data: {
    someData: {},
  },
  methods: {
    // 暴露给外部查询的方法
    getHeadings(callback) {
      const child = this.selectComponent("#my-decode");
      if (child && typeof child.queryHeadings === "function") {
        child.queryHeadings(callback);
      }
    },
  },
});
