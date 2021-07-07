const serializeObject = (obj) => {
  if(typeof(obj) === 'string') {
    return obj;
  }
  return JSON.stringify(obj, undefined, 2);
}

const deserializeObject = (str) => {
  if(str && typeof(str) === 'string') {
    return JSON.parse(str);
  }
  return str;
}

export { serializeObject, deserializeObject };