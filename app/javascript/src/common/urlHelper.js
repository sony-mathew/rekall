/*
To check if a tsr is a valid URL
ref: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
*/
export const isValidUrl = (str) => {
  // fail fast, not a string and not starting with http
  if (!(typeof str === 'string' && str.slice(0,4) == 'http')) {
    return false;
  }

  let url;
  
  try {
    url = new URL(str);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}