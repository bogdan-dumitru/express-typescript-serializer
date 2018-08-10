import * as glob from "glob";
import * as path from "path";

function isImportable(file: string): boolean {
  const filePart = file.slice(-3);
  return (
    filePart === ".js" || (filePart === ".ts" && file.slice(-5) !== ".d.ts")
  );
}

function filePathWithoutExtension(file: string): string {
  const parsedFile = path.parse(file);
  return path.join(parsedFile.dir, parsedFile.name);
}

export const requireGlob = (dependencies: string) => {
  glob
    .sync(dependencies)
    .filter(isImportable)
    .map(filePathWithoutExtension)
    .map(require);
};
