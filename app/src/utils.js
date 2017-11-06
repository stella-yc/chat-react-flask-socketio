export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

export const doesNotMatch = (criteria, opt1, opt2) => {
  let notMatch;
  if (opt1 === criteria) {
    notMatch = opt2;
  } else {
    notMatch = opt1;
  }
  return notMatch;
}
