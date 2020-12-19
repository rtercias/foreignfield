import gql from 'graphql-tag';
import clone from 'lodash/clone';
import { InvalidCongregationError } from '../exceptions/custom-errors';

export const model = gql`fragment CongregationModel on Congregation {
  id
  name
  description
  language
  campaign
  admin_email
  options
}`;

export function validate(_cong, isNew) {
  const cong = clone(_cong);

  if (isNew && cong.id) {
    throw new InvalidCongregationError('Congregation ID must be empty when adding a new congregation');
  }
  if (!cong.name) {
    throw new InvalidCongregationError('Congregation name is required');
  }
  if (!cong.language) {
    throw new InvalidCongregationError('Language is required');
  }
  if (!cong.admin_email) {
    throw new InvalidCongregationError('Admin email is required');
  }

  // convert nullable fields to empty string when null
  if (cong.description === null) {
    cong.description = '';
  }

  if (cong.campaign === null) {
    cong.campaign = 0;
  }

  const unwantedProperties = [
    'territories', 'publishers', 'groups',
  ];

  for (const unwanted of unwantedProperties) {
    if (unwanted in cong) {
      delete cong[unwanted];
    }
  }

  return cong;
}
