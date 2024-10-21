import country from './country.json';

export const countryOptions = Object.entries(country).map(([code, name]) => ({
  value: code,
  label: name,
}));
