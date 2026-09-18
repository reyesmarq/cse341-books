const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isIsoDateString = (value) => {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
};

const validateBookInput = ({ authorId, title, publicationDate }) => {
  return isNonEmptyString(authorId) && isNonEmptyString(title) && isIsoDateString(publicationDate);
};

const validateAuthorInput = ({ name, birthYear }) => {
  return isNonEmptyString(name) && Number.isInteger(birthYear);
};

export { validateBookInput, validateAuthorInput };
