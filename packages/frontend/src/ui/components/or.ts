
import { helper as buildHelper } from '@ember/component/helper';

export function or(params: any[]/*, hash*/) {
  return params[0] || params[1];
}

export const helper = buildHelper(or);
