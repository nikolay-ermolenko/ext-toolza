class ComponentLocator {
  constructor(element) {
    var targetComponent = Ext.Component.fromElement(element);
    var componentStore = [];

    while (targetComponent) {
      componentStore.unshift(this.getComponentInfo(targetComponent));

      targetComponent = this.getParentComponent(targetComponent);
    }

    return {
      componentStore: JSON.stringify(componentStore),
    };
  }

  getComponentInfo(component) {
    return {
      id: component.getId(),
      className: component.$className,
      hasVM: !!component.getViewModel(),
      hasRecord: component.isXType('gridrow') && !!component.getRecord(),
      record: JSON.stringify(
        this.stringify(component.isXType('gridrow') ? component.getRecord() : null, component),
        null,
        2
      ),
      xtypes: component.xtypesChain || [],
      isHidden: component.isHidden(),
      isVisible: component.isVisible(),
      path: `${location.origin}${
        location.pathname
      }/../${Ext.ClassManager.getPath(component.$className || "")}`,
      bind: JSON.stringify(
        this.stringify(component.getBind(), component),
        null,
        2
      ),
      initialConfig: JSON.stringify(
        this.stringify(component.initialConfig, component),
        null,
        2
      ),
      defaultConfig: JSON.stringify(
        this.stringify(component.defaultConfig, component),
        null,
        2
      ),
      viewModel: JSON.stringify(
        this.stringify(component.getViewModel(), component),
        null,
        2
      ),
    };
  }

  getParentComponent(target) {
    if (target.ownerCmp) return target.ownerCmp;

    if (target.ownerCt) return target.ownerCt;

    if (target.isXType("gridcellbase")) {
      return target.getColumn();
    }

    // if (target.isMenuItem) {
    //   return target.parentMenu || target.menu;
    // }

    if (Ext.isFunction(target.getParent)) {
      return target.getParent();
    }
  }

  getBindPath(bind, cmp, key) {
    if (bind.isMultiBinding) {
      return cmp.initialConfig.bind[key];
    }

    if (bind.stub) {
      return bind.stub.linkDescriptor || `{${bind.stub.path}}` || "undefined";
    }

    if (bind.tpl) {
      return bind.tpl.text || "";
    }
    return "undefined";
  }

  stringify(val, cmp, key) {
    if (val === null) return val;
    if (val === undefined) return "undefined";
    if (Ext.isPrimitive(val)) return Ext.htmlEncode(val);
    if (Ext.isArray(val)) return val.map((i) => this.stringify(i, cmp));
    if (Ext.isFunction(val)) return "[Function]";
    if (Ext.isObject(val)) {
      if (val.isBinding || val.$className === 'Ext.app.bind.Binding') {
        return {
          path: this.getBindPath(val, cmp, key),
          value: this.stringify(val.getRawValue(), cmp),
        };
      }

      if (val.isViewModel) {
        return {
          data: this.stringify(val.getData(), cmp, key),
          formulas: this.stringify(val.getFormulas(), cmp),
        };
      }

      if (val.isModel) {
        return this.stringify(val.data, cmp, key);
      }

      if (val.isSession || val.isInstance) {
        return this.stringify(val.initialConfig, cmp, key);
      }

      var res = {};
      Ext.Object.getKeys(val || {}).map((k) => {
        if (["$initParent"].includes(k)) return;
        res[k] = this.stringify(val[k], cmp, k);
      });

      return res;
    }

    if (Ext.isFunction(val.toString)) return val.toString();
    return Ext.toString(val);
  }

  // zzz(obj, xtypesChain = []) {
  //   if (obj === undefined) return obj;

  //   if (Ext.isPrimitive(obj)) return obj;

  //   if (Ext.isArray(obj)) {
  //     return obj.map((i) => this.zzz(i));
  //   }

  //   if (Ext.isObject(obj)) {
  //     if (obj.isStore) {
  //       return this.zzz(obj.initialConfig);
  //     }
  //     var res = {};

  //     Ext.Object.getKeys(obj || {}).map((k) => {
  //       if (k === "grid" && ["gridrow"].includes(obj.xtype)) return;
  //       if (
  //         [
  //           "$initParent",
  //           "ownerGrid",
  //           "headerCt",
  //           "panel",
  //           "ownerCmp",
  //         ].includes(k)
  //       )
  //         return;

  //       if (obj[k] === undefined) {
  //         res[k] = "undefined";
  //         return;
  //       }

  //       if (Ext.isString(obj[k])) {
  //         res[k] = Ext.htmlEncode(obj[k]);
  //         return;
  //       }

  //       if (Ext.isPrimitive(obj[k])) {
  //         res[k] = obj[k];
  //         return;
  //       }

  //       if (Ext.isArray(obj[k])) {
  //         res[k] = this.zzz(obj[k]);
  //         return;
  //       }
  //       // if (Ext.isObject(obj[k]) && obj[k].isModel) {
  //       //  debugger
  //       // }
  //       if (Ext.isObject(obj[k]) && obj[k].isSession) {
  //         res[k] = this.zzz(obj[k].initialConfig);
  //         return;
  //       }

  //       if (Ext.isObject(obj[k]) && obj[k].isModel) {
  //         res[k] = this.zzz(obj[k].data);
  //         return;
  //       }
  //       if (Ext.isObject(obj[k]) && obj[k].isInstance) {
  //         res[k] = this.zzz(obj[k].initialConfig);
  //         return;
  //       }

  //       if (Ext.isObject(obj[k])) {
  //         res[k] = this.zzz(obj[k]);
  //         return;
  //       }
  //     });

  //     return res;
  //   }

  //   console.log("AAA", obj);

  //   //   var res = {};

  //   //   Ext.Object.getKeys(obj || {}).map((k) => {
  //   //     // console.log(k);
  //   //     if (Ext.isPrimitive(obj[k])) {
  //   // // debugger
  //   //       res[k] = Ext.htmlEncode(obj[k]);
  //   //       return;
  //   //     }

  //   //     if (Ext.isArray(obj[k])) {
  //   //       // debugger
  //   //       console.log('ARRAY',obj[k] );
  //   //       res[k] = [this.zzz(res[k][0])]'array'//obj[k].map((v) => this.zzz(v));
  //   //       return;
  //   //     }

  //   //     if (obj[k].isSession) {
  //   //       res[k] = Ext.clone(this.zzz(obj[k].initialConfig));
  //   //       return;
  //   //     }

  //   //     if (obj[k].isModel) {
  //   //       console.log("MODEL", obj[k].getData());
  //   //       res[k] = {data: obj[k].getData()}

  //   //     //   // {data: Ext.clone(this.zzz(Ext.clone(obj[k].getData())))};
  //   //       return;
  //   //     }

  //   //     // if (obj[k].isInstance) {
  //   //     //   console.log("INSTANCE", obj, k);
  //   //     //   res[k] = obj[k].$className;
  //   //     //   return;
  //   //     // }

  //   //     res[k] = k;
  //   //     // res[k] = Ext.clone(this.zzz(obj[k]));
  //   //   });
  //   //   return res;
  // }
}
