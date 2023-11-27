import EventEmitter from 'EventEmitter';
import mount from 'utils/mount';

import OverlayComponent from './components/OverlayComponent.vue';

const cssClasses = {
  large: 'l-overlay-large',
  small: 'l-overlay-small',
  fit: 'l-overlay-fit',
  fullscreen: 'l-overlay-fullscreen',
  dialog: 'l-overlay-dialog'
};

class Overlay extends EventEmitter {
  constructor({
    buttons,
    autoHide = true,
    dismissable = true,
    element,
    onDestroy,
    onDismiss,
    size
  } = {}) {
    super();

    this.container = document.createElement('div');
    this.container.classList.add('l-overlay-wrapper', cssClasses[size]);

    this.autoHide = autoHide;
    this.dismissable = dismissable !== false;

    const { destroy } = mount(
      {
        components: {
          OverlayComponent: OverlayComponent
        },
        provide: {
          dismiss: this.notifyAndDismiss.bind(this),
          element,
          buttons,
          dismissable: this.dismissable
        },
        template: '<overlay-component></overlay-component>'
      },
      {
        element: this.container
      }
    );

    this.destroy = destroy;

    if (onDestroy) {
      this.once('destroy', onDestroy);
    }

    if (onDismiss) {
      this.once('dismiss', onDismiss);
    }
  }

  dismiss() {
    this.emit('destroy');
    document.body.removeChild(this.container);
    this.destroy();
  }

  //Ensures that any callers are notified that the overlay is dismissed
  notifyAndDismiss() {
    this.emit('dismiss');
    this.dismiss();
  }

  /**
   * @private
   **/
  show() {
    document.body.appendChild(this.container);
  }
}

export default Overlay;
