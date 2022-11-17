const FILE_ENCODING: BufferEncoding = 'utf-8';

const SD_FORMATS = {
  CSS_VARIABLES: {
    EXTENSION: 'css',
    FORMAT: 'css/variables',
    GROUP: 'css',
    NAME: 'css/variables',
    PATH: './css/',
  },
  SCSS_VARIABLES: {
    EXTENSION: 'scss',
    FORMAT: 'scss/variables',
    GROUP: 'scss',
    NAME: 'scss/variables',
    PATH: './scss/',
  },
  WEB_JSON: {
    EXTENSION: 'json',
    FORMAT: 'json',
    GROUP: 'web',
    NAME: 'web/json',
    PATH: './json/',
  },
};

const FORMATS = {
  ...SD_FORMATS,
};

const SD_TRANSFORMS = {
  ATTRIBUTE_CTI: 'attribute/cti',
  NAME_CTI_KABAB: 'name/cti/kebab',
};

const LOCAL_TRANSFORMS = {
  MD_ELEVATION: 'md/elevation',
};

const TRANSFORMS = {
  ...SD_TRANSFORMS,
  ...LOCAL_TRANSFORMS,
};

const CONSTANTS = {
  FILE_ENCODING,
  FORMATS,
  LOCAL_TRANSFORMS,
  SD_FORMATS,
  SD_TRANSFORMS,
  TRANSFORMS,
};

export default CONSTANTS;
