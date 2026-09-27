import { builtinModules, createRequire } from "node:module";

if (typeof process !== "undefined") {
  const proc = process as typeof process & {
    getBuiltinModule?: (id: string) => unknown;
  };

  if (typeof proc.getBuiltinModule !== "function") {
    const require = createRequire(import.meta.url);

    proc.getBuiltinModule = (id: string) => {
      const normalizedId = id.startsWith("node:") ? id.slice(5) : id;
      const candidates = [normalizedId, `node:${normalizedId}`];

      const resolvedName = candidates.find((candidate) =>
        builtinModules.includes(candidate),
      );

      if (!resolvedName) {
        return undefined;
      }

      return require(resolvedName);
    };
  }
}
