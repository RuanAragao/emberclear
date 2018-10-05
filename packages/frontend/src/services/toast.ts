import Ember from 'ember';
import Service from '@ember/service';
import { isPresent } from '@ember/utils';

import { toast } from "bulma-toast";


export default class Toast extends Service {
  info(msg: string, title = '', options = {}) {
    this.createToast('info', msg, title, options);
  }

  success(msg: string, title = '', options = {}) {
    this.createToast('success', msg, title, options);
  }

  warning(msg: string, title = '', options = {}) {
    this.createToast('warning', msg, title, options);
  }

  error(msg: string, title = '', options = {}) {
    this.createToast('error', msg, title, options);
  }

  createToast(status: string, msg: string, title: string, options: any) {
    const message = isPresent(title) ? `${title}: ${msg}` : msg;

    toast({
      message,
      type: `is-${status}`,
      dismissable: true,
      duration: Ember.testing ? 10 : 4000000,
      position: 'top-right',
      pauseOnHover: true,
      opacity: 1
    });
  }
}
