import { ZSanitationInput } from '../models/zsanitation-input.model';

export class ZSanitation {
  static RegEx = {
    name: /^[a-zA-Z '-]+$/,
    userName: /^[0-9a-zA-Z_]+$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    appName: /^[0-9a-zA-Z_ ]+$/,
    // PASSWORD: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\$%\^*])[\w!@#\$%\^*]{2,}$/,
    password: /^[\w!@#\$%\^*]{2,}$/,  // also /^[a-zA-Z0-9$_.\-]+$/;
    link: /[\w:/.]+$/,
    text: /[\w:/.]+$/
  };

  static SANITIZERS = {
    name:     { label: 'name',      minLen: 2, maxLen: 15, regEx: ZSanitation.RegEx.name     },
    userName: { label: 'user name', minLen: 2, maxLen: 15, regEx: ZSanitation.RegEx.userName },
    appName:  { label: 'app name',  minLen: 2, maxLen: 35, regEx: ZSanitation.RegEx.appName  },
    email:    { label: 'email',     minLen: 9, maxLen: 80, regEx: ZSanitation.RegEx.email    },
    link:     { label: 'link',      minLen: 9, maxLen: 80, regEx: ZSanitation.RegEx.link     },
    password: { label: 'password',  minLen: 6, maxLen: 30, regEx: ZSanitation.RegEx.password },
    text:     { label: 'text',      minLen: 0, maxLen: 10000, regEx: ZSanitation.RegEx.text  }
  };

  static sanitize(inputs: ZSanitationInput | ZSanitationInput[]) {
    let msg = '';
    if (Array.isArray(inputs)) {
      for (let i = 0, len = inputs.length; i < len && msg === ''; i++) {
        msg = this.sanitizeInput(inputs[i]);
      }
    } else {
      msg = this.sanitizeInput(inputs);
    }
    return msg;
  }

  static sanitizeInput(input: ZSanitationInput) {
    const sanitizer = this.SANITIZERS[input.name];
    const label = input.label || sanitizer.label;
    input.value = input.value.trim();
    if (!input.value) {
      return input.isRequired === false ? '' : `field '${label}' is empty`;
    } else if (input.value.length < sanitizer.minLen) {
      return `field '${label}' should be at least ${sanitizer.minLen}' characters`;
    } else if (input.value.length > sanitizer.maxLen) {
      return `field '${label}' should be a maximum of ${sanitizer.maxLen}' characters`;
    } else if (sanitizer.regEx && !this.isValidByRegEx(input.value, sanitizer.regEx)) {
      return `field '${label}' is not valid`;
    } else {
      return '';
    }
  }

  static isValidByRegEx(value, regEx): Boolean {
    let isValid = true;
    if (Array.isArray(regEx)) {
      for (let i = 0, len = regEx.length; i < len && isValid; i++) {
        isValid = regEx[i].test(value);
      }
    } else {
      isValid = regEx.test(value);
    }
    return isValid;
  }

  static setSanitationRegEx(name, value) {
    ZSanitation.RegEx[name] = value;
  }
}
