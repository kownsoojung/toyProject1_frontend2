export function DefaultValues<T extends object>(model: T): T {
  const result: any = {};
  Object.keys(model).forEach((key) => {
    const type = typeof (model as any)[key];
    if (type === "string") result[key] = "";
    else if (type === "boolean") result[key] = false;
    else result[key] = null;
  });
  return result as T;
}
