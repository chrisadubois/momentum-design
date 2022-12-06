/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

import { CONSTANTS } from '../constants';
import type { Asset, Config } from '../types';
import { normaliseObject } from '../utils/object';

type ReplacementMap = { [key: string]: string | undefined }

class Component {
  node: ComponentNode;

  destination: string;

  config: Config;

  variants: Record<string, string>;

  constructor(node: ComponentNode, destination: string, config: Config) {
    this.node = node;
    this.destination = destination;
    this.config = config;
    this.variants = normaliseObject(this.node.variantProperties);
  }

  get replacementMap(): ReplacementMap {
    const setOrComponentName = this.node.parent?.type === 'COMPONENT_SET' ? this.node.parent.name : this.node.name;
    const rtl = this.variants?.[CONSTANTS.FIGMA_VARIANTS.RTL] === 'true' ? 'rtl' : undefined;
    const sf = this.variants?.[CONSTANTS.FIGMA_VARIANTS.SF_ALTERNATIVE] === 'true' ? 'sf' : undefined;

    return {
      [CONSTANTS.REPLACE_TERMS.COMPONENT_NAME]: this.node.name,
      [CONSTANTS.REPLACE_TERMS.PARENT_NAME]: this.node.parent?.name,
      [CONSTANTS.REPLACE_TERMS.SET_OR_COMPONENT_NAME]: setOrComponentName,
      [CONSTANTS.REPLACE_TERMS.WEIGHT]: this.variants?.[CONSTANTS.FIGMA_VARIANTS.WEIGHT],
      [CONSTANTS.REPLACE_TERMS.RTL]: rtl,
      [CONSTANTS.REPLACE_TERMS.SF_ALTERNATIVE]: sf,
    };
  }

  get assetName() {
    let name = '';
    const nameParts = this.config.fileName.parts.reduce((filtered: Array<string>, part) => {
      const namePart = this.replacementMap[part];
      if (namePart) {
        filtered.push(namePart);
      }

      return filtered;
    }, []);

    name += nameParts.join(this.config.fileName.separator);
    name += '.';
    name += this.config.exportSettings.format.toLowerCase();
    return name;
  }

  get asset(): Promise<Asset> {
    return new Promise((resolve, reject) => {
      this.node
        .exportAsync(this.config.exportSettings)
        .then((uint8Array: Uint8Array) => {
          resolve({
            path: `${this.destination}/${this.assetName}`,
            data: String.fromCharCode.apply(null, uint8Array as any),
          });
        })
        .catch((err) => {
          figma.notify(err, { error: true });
          reject(err);
        });
    });
  }
}

export default Component;
