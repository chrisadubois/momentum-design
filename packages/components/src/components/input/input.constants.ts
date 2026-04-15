import utils from '../../utils/tag-name';
import { BUTTON_VARIANTS, ICON_BUTTON_SIZES } from '../button/button.constants';
import { VALIDATION } from '../formfieldwrapper/formfieldwrapper.constants';
import type { IconNames } from '../icon/icon.types';
import { TYPE, VALID_TEXT_TAGS } from '../text/text.constants';

const TAG_NAME = utils.constructTagName('input');

const AUTO_CAPITALIZE = {
  OFF: 'off',
  NONE: 'none',
  ON: 'on',
  SENTENCES: 'sentences',
  WORDS: 'words',
  CHARACTERS: 'characters',
} as const;

const AUTO_COMPLETE = {
  OFF: 'off',
  ON: 'on',
  NAME: 'name',
  HONORIFIC_PREFIX: 'honorific-prefix',
  GIVEN_NAME: 'given-name',
  ADDITIONAL_NAME: 'additional-name',
  FAMILY_NAME: 'family-name',
  HONORIFIC_SUFFIX: 'honorific-suffix',
  NICKNAME: 'nickname',
  EMAIL: 'email',
  USERNAME: 'username',
  NEW_PASSWORD: 'new-password',
  CURRENT_PASSWORD: 'current-password',
  ONE_TIME_CODE: 'one-time-code',
  ORGANIZATION_TITLE: 'organization-title',
  ORGANIZATION: 'organization',
  STREET_ADDRESS: 'street-address',
  COUNTRY: 'country',
  COUNTRY_NAME: 'country-name',
  POSTAL_CODE: 'postal-code',
  TEL: 'tel',
  TEL_COUNTRY_CODE: 'tel-country-code',
  TEL_NATIONAL: 'tel-national',
  TEL_LOCAL: 'tel-local',
  URL: 'url',
  BDAY: 'bday',
  SEX: 'sex',
} as const;

const INPUT_TYPE = {
  PASSWORD: 'password',
  TEXT: 'text',
  SEARCH: 'search',
} as const;

const PREFIX_TEXT_OPTIONS = {
  MAX_LENGTH: 10,
  VALIDATION: VALIDATION.ERROR,
};

const DEFAULTS = {
  VALIDATION: VALIDATION.DEFAULT,
  ICON_SIZE_VALUE: 1,
  ICON_SIZE_UNIT: 'rem',
  CLEAR_BUTTON_ICON: 'cancel-bold' as Extract<IconNames, 'cancel-bold'>,
  CLEAR_BUTTON_VARIANT: BUTTON_VARIANTS.TERTIARY,
  CLEAR_BUTTON_SIZE: ICON_BUTTON_SIZES[20],
  PREFIX_TEXT_TYPE: TYPE.BODY_MIDSIZE_REGULAR,
  PREFIX_TEXT_TAG: VALID_TEXT_TAGS.SPAN,
  AUTO_COMPLETE: AUTO_COMPLETE.OFF,
  INPUT_TYPE: INPUT_TYPE.TEXT,
} as const;

export { TAG_NAME, PREFIX_TEXT_OPTIONS, AUTO_CAPITALIZE, AUTO_COMPLETE, INPUT_TYPE, DEFAULTS };
