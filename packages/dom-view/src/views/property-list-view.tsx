import { View } from "../view-core/index";

import {
  Schema,
  BlockConfiguration,
  AnyAction,
  IActionHandler
} from "@cryptographix/core";

import { PropertyView, PropertyValueChanged } from "./property-view";

export class PropertyListView extends View implements IActionHandler {
  _bs: BlockConfiguration;

  constructor(bs: BlockConfiguration) {
    super();
    this._bs = bs;

    this.updatePropertyViews(bs);
  }

  handleAction(action: AnyAction) {
    let act = action as PropertyValueChanged;
    switch (act.action) {
      case "property-value-changed": {
        console.log("changed: ", act.key, " to ", this._bs[act.key]);
      }
    }

    return null;
  }

  dumpProps() {
    console.log(this._bs);
  }
  render() {
    return (
      <div style="border: 1px solid #e3e8ec">
        {this.renderChildViews()}
        <div>
          <a class="inspect" onClick={this.dumpProps.bind(this)}>
            Button
          </a>
        </div>
      </div>
    );
  }

  /*
   * Update (or add) propertyView to children
   * - insert in order (as per schema)
   */
  updatePropertyView(obj: object, view: PropertyView) {
    const schema = Schema.getSchemaForObject(obj);
    let keys = Object.keys(schema.properties);

    const propViews = this.children.filter(
      view => view instanceof PropertyView
    ) as PropertyView[];

    const curIndex = propViews.findIndex(pv => pv.key == view.key);

    if (curIndex < 0) propViews.push(view);

    // Maintain the order of properties
    propViews.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));

    const index = propViews.indexOf(view);
    if (curIndex != index) {
      const nextView =
        index < propViews.length - 1 ? propViews[index + 1] : null;

      this.addChildView(view, nextView);
    }

    //view.triggerUpdate();

    /*
      // Determine for each setting view wether it appears first in a row
      let columns = 0;
      fieldViews.forEach(settingView => {
        const width = settingView.getModel().getWidth();
        columns += width;
        if (columns === width || columns > 12) {
          columns = width;
          settingView.setFirst(true);
        } else {
          settingView.setFirst(false);
        }
      });
      return this;
    }*/
  }

  updatePropertyViews(obj: object) {
    let properties = Schema.getPropertiesForObject(obj);

    properties.forEach((propType, key) => {
      const ref = {
        target: this._bs,
        key,
        propertyType: propType
      };
      let newView = new PropertyView(this, ref);

      this.updatePropertyView(obj, newView);
    });
  }
}
