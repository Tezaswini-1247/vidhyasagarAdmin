import type { Package as PackageInterface, NPMPackageVersion } from './types';
import type { Version } from '../version';
export declare class Package implements PackageInterface {
    name: string;
    packageURL: string;
    private npmPackage;
    constructor(name: string);
    get isLoaded(): boolean;
    private assertPackageIsLoaded;
    getVersionsDict(): Record<string, NPMPackageVersion>;
    getVersionsAsList(): NPMPackageVersion[];
    findVersionsInRange(range: Version.Range): NPMPackageVersion[];
    findVersion(version: Version.SemVer): NPMPackageVersion | undefined;
    refresh(): Promise<this>;
    versionExists(version: Version.SemVer): boolean;
}
export declare const npmPackageFactory: (name: string) => Package;
//# sourceMappingURL=package.d.ts.map