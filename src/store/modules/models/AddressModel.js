import gql from 'graphql-tag';
import clone from 'lodash/clone';
import { InvalidAddressError } from '../../exceptions/custom-errors';

export const model = gql`fragment AddressModel on Address {
  congregationId
  territory_id
  id
  addr1
  addr2
  city
  state_province
  postal_code
  phone
  longitude
  latitude
  notes
  status
  sort
  parent_id
  phones {
    id
    phone
    notes
    sort 
  }
}`;

export const ADDRESS_STATUS = {
  Active: 'Active',
  NF: 'NF',
  DNC: 'DNC',
};

export const ACTION_BUTTON_LIST = [
  {
    type: 'fa-icon',
    value: 'START',
    text: '',
    icon: '',
    color: 'success',
  },
  {
    type: 'fa-icon',
    value: 'NH',
    text: 'NH',
    icon: 'circle',
    color: 'warning',
    description: 'Not Home',
  },
  {
    type: 'fa-icon',
    value: 'HOME',
    text: '',
    icon: 'house-user',
    color: 'primary',
    description: 'Home',
  },
  {
    type: 'fa-icon',
    value: 'PH',
    text: '',
    icon: 'phone',
    color: 'info',
    description: 'Phone',
  },
  {
    type: 'fa-icon',
    value: 'LW',
    text: '',
    icon: 'envelope',
    color: 'primary',
    description: 'Letter',
    disabledText: 'Do Not Mail',
  },
  {
    type: 'fa-icon',
    value: 'no number',
    text: '',
    icon: 'phone-slash',
    color: 'danger',
    description: 'No Number',
  },
  {
    type: 'fa-icon',
    value: 'do not mail',
    text: '',
    icon: 'envelope',
    color: 'danger',
    description: 'Do Not Mail',
    slashed: true,
  },
];

export function validate(_address, isNew) {
  const address = clone(_address);

  if (isNew && address.id) {
    throw new InvalidAddressError('Address ID must be empty when adding a new address');
  }
  if (!address.congregationId) {
    throw new InvalidAddressError('Congregation ID is required');
  }
  if (!address.territory_id) {
    throw new InvalidAddressError('Territory ID is required');
  }
  if (!address.addr1) {
    throw new InvalidAddressError('Address 1 is required');
  }
  if (!address.city) {
    throw new InvalidAddressError('City is required');
  }
  if (!address.state_province) {
    throw new InvalidAddressError('State is required');
  }
  if (!Number.isInteger(address.sort)) {
    address.sort = 0;
  }

  // convert nullable fields to empty string when null
  if (address.addr2 === null) {
    address.addr2 = '';
  }

  if (address.postal_code === null) {
    address.postal_code = '';
  }

  if (address.phone === null) {
    address.phone = '';
  }

  if (address.notes === null) {
    address.notes = '';
  }

  const ignoredProperties = [
    'activityLogs', 'lastActivity', 'incomingResponse', 'selectedResponse', 'selectedResponseTS',
    'phones', 'type', 'parent_id', 'isBusy',
  ];

  for (const ignored of ignoredProperties) {
    if (ignored in address) {
      delete address[ignored];
    }
  }

  return address;
}