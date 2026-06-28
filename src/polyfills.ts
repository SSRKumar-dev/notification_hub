if (typeof process !== "undefined") {
  const proc = process as any;
  if (typeof proc.getBuiltinModule !== "function") {
    proc.getBuiltinModule = () => undefined;
  }
}
