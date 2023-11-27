import mount from 'utils/mount';

import AutoCompleteField from './components/controls/AutoCompleteField.vue';
import CheckBoxField from './components/controls/CheckBoxField.vue';
import ClockDisplayFormatField from './components/controls/ClockDisplayFormatField.vue';
import Datetime from './components/controls/DatetimeField.vue';
import FileInput from './components/controls/FileInput.vue';
import Locator from './components/controls/LocatorField.vue';
import NumberField from './components/controls/NumberField.vue';
import SelectField from './components/controls/SelectField.vue';
import TextAreaField from './components/controls/TextAreaField.vue';
import TextField from './components/controls/TextField.vue';
import ToggleSwitchField from './components/controls/ToggleSwitchField.vue';
export const DEFAULT_CONTROLS_MAP = {
  autocomplete: AutoCompleteField,
  checkbox: CheckBoxField,
  composite: ClockDisplayFormatField,
  datetime: Datetime,
  'file-input': FileInput,
  locator: Locator,
  numberfield: NumberField,
  select: SelectField,
  textarea: TextAreaField,
  textfield: TextField,
  toggleSwitch: ToggleSwitchField
};

export default class FormControl {
  constructor(openmct) {
    this.openmct = openmct;
    this.controls = {};

    this._addDefaultFormControls();
  }

  addControl(controlName, controlViewProvider) {
    const control = this.controls[controlName];
    if (control) {
      console.warn(`Error: provided form control '${controlName}', already exists`);

      return;
    }

    this.controls[controlName] = controlViewProvider;
  }

  getControl(controlName) {
    const control = this.controls[controlName];
    if (!control) {
      console.error(`Error: form control '${controlName}', does not exist`);
    }

    return control;
  }

  /**
   * @private
   */
  _addDefaultFormControls() {
    Object.keys(DEFAULT_CONTROLS_MAP).forEach((control) => {
      const controlViewProvider = this._getControlViewProvider(control);
      this.addControl(control, controlViewProvider);
    });
  }

  /**
   * @private
   */
  _getControlViewProvider(control) {
    const self = this;
    let _destroy = null;

    return {
      show(element, model, onChange) {
        const { vNode, destroy } = mount(
          {
            el: element,
            components: {
              FormControlComponent: DEFAULT_CONTROLS_MAP[control]
            },
            provide: {
              openmct: self.openmct
            },
            data() {
              return {
                model,
                onChange
              };
            },
            template: `<FormControlComponent :model="model" @on-change="onChange"></FormControlComponent>`
          },
          {
            element,
            app: self.openmct.app
          }
        );
        _destroy = destroy;

        return vNode;
      },
      destroy() {
        if (_destroy) {
          _destroy();
        }
      }
    };
  }
}
