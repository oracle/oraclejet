/**
 * Validates that a value is safe to use as a single filename segment.
 *
 * @param value The value to validate.
 * @param description A human-readable description used in the error message.
 * @returns The original value when it is safe to use as a filename segment.
 * @throws Error if the value is empty, trimmed, a path traversal segment, or contains path separators or unsafe filename characters.
 */
export declare function validateFileNameSegment(value: string, description: string): string;
/**
 * Builds a JSON file path under the specified output directory using a validated filename base.
 *
 * @param outputDir The directory where the JSON file should be written.
 * @param fileNameBase The filename without the `.json` extension.
 * @param description A human-readable description used in validation errors.
 * @returns The path to the JSON file.
 * @throws Error if the filename base is not a safe single filename segment.
 */
export declare function getSafeJsonFilePath(outputDir: string, fileNameBase: string, description: string): string;
/**
 * Resolves path segments under a base directory and verifies the result stays contained within that directory.
 *
 * @param baseDir The directory that must contain the resolved path.
 * @param pathSegments Additional path segments to resolve under the base directory.
 * @returns The resolved contained path.
 * @throws Error if the resolved path escapes the base directory.
 */
export declare function getContainedPath(baseDir: string, ...pathSegments: string[]): string;
