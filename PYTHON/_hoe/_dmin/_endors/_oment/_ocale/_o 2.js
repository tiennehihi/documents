import * as path from "path";
import * as TryPath from "./try-path";
import * as MappingEntry from "./mapping-entry";
import * as Filesystem from "./filesystem";

/**
 * Function that can match a path async
 */
export interface MatchPathAsync {
  (
    requestedModule: string,
    readJson: Filesystem.ReadJsonAsync | undefined,
    fileExists: Filesystem.FileExistsAsync | undefined,
    extensions: ReadonlyArray<string> | undefined,
    callback: MatchPathAsyncCallback
  ): void;
}

export interface MatchPathAsyncCallback {
  (err?: Error, path?: string): void;
}

/**
 * See the sync version for docs.
 */
export function createMatchPathAsync(
  absoluteBaseUrl: string,
  paths: { [key: string]: Array<string> },
  mainFields: string[] = ["main"],
  addMatchAll: boolean = true
): MatchPathAsync {
  const absolutePaths = MappingEntry.getAbsoluteMappingEntries(
    absoluteBaseUrl,
    paths,
    addMatchAll
  );

  return (
    requestedModule: string,
    readJson: Filesystem.ReadJsonAsync | undefined,
    fileExists: Filesystem.FileExistsAsync | undefined,
    extensions: ReadonlyArray<string> | undefined,
    callback: MatchPathAsyncCallback
  ) =>
    matchFromAbsolutePathsAsync(
      absolutePaths,
      requestedModule,
      readJson,
      fileExists,
      extensions,
      callback,
      mainFields
    );
}

/**
 * See the sync version for docs.
 */
export function matchFromAbsolutePathsAsync(
  absolutePathMappings: ReadonlyArray<MappingEntry.MappingEntry>,
  requestedModule: string,
  readJson: Filesystem.ReadJsonAsync = Filesystem.readJsonFromDiskAsync,
  fileExists: Filesystem.FileExistsAsync = Filesystem.fileExistsAsync,
  extensions: ReadonlyArray<string> = Object.keys(require.extensions),
  callback: MatchPathAsyncCallback,
  mainFields: string[] = ["main"]
): void {
  const tryPaths = TryPath.getPathsToTry(
    extensions,
    absolutePathMappings,
    requestedModule
  );

  if (!tryPaths) {
    return callback();
  }

  findFirstExistingPath(
    tryPaths,
    readJson,
    fileExists,
    callback,
    0,
    mainFields
  );
}

function findFirstExistingMainFieldMappedFile(
