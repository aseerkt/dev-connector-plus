export function cleanObj(obj: Record<string, any>) {
  for (const key in obj) {
    if (
      obj[key] === null ||
      obj[key] === undefined ||
      obj[key] === '' ||
      obj[key].toString() === 'Invalid Date'
    ) {
      delete obj[key];
    }
  }
  console.log(obj);
  return obj;
}
