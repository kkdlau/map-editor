export enum KeyAction {
  PRESS,
  DOWN,
  RELEASE
}

interface ShortcutEvent {
  keyCode: number[],
  callback: () => void,
  action: KeyAction
}

export class ShortcutManager {
  private _registeredEvent = {} as ShortcutEvent;
  private _triggerHistory = {} as boolean;
  private _keyCollection = {};
  private _keyActionHistory = {};

  constructor() {
    document.addEventListener('keypress', (e) => {
      if (e.keyCode in this._keyCollection) {
        this._keyActionHistory[e.keyCode] = true;
        e.preventDefault();
        outter: for (let code in this._registeredEvent) {
          let event: ShortcutEvent = this._registeredEvent[code];
          for (let keyid of event.keyCode) {
            if (!this._keyActionHistory[keyid]) {
              this._triggerHistory[code] = false;
              continue outter;
            }
          }
          if (event.action === KeyAction.PRESS && this._triggerHistory[code])
            continue;
          this._triggerHistory[code] = true;
          event.callback();
        }
      }
    });

    document.addEventListener('keyup', e => {
      delete this._keyActionHistory[e.keyCode];
    });
  }

  public on(code: string, keyCode: number[], callback: () => void, action: KeyAction = KeyAction.DOWN): string {
    keyCode.forEach((e, i) => {
      if (e in this._keyCollection)
        this._keyCollection[e]++;
      else
        this._keyCollection[e] = 1;
    });

    this._registeredEvent[code] = {
      keyCode: keyCode,
      callback: callback,
      action: action
    }
    this._triggerHistory[code] = false;
    return code;
  }

  public off(code: string): void {
    this._registeredEvent[code].keyCode.forEach((e, i) => {
      if (this._keyCollection[e] === 1)
        delete this._keyCollection[e];
      else
        this._keyCollection[e]--;
    });
    delete this._registeredEvent[code];
    delete this._triggerHistory[code];
  }
}

export const shortcutManager: ShortcutManager = new ShortcutManager();