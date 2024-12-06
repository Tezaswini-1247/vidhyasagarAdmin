import type { Upgrader as UpgraderInterface, UpgradeReport } from './types';
import type { Version } from '../version';
import type { Logger } from '../logger';
import type { Requirement } from '../requirement';
import type { NPM } from '../npm';
import type { AppProject } from '../project';
import type { ConfirmationCallback } from '../common/types';
export declare class Upgrader implements UpgraderInterface {
    private readonly project;
    private readonly npmPackage;
    private target;
    private codemodsTarget;
    private isDry;
    private logger;
    private requirements;
    private confirmationCallback;
    constructor(project: AppProject, target: Version.SemVer, npmPackage: NPM.Package);
    getNPMPackage(): NPM.Package;
    getProject(): AppProject;
    getTarget(): Version.SemVer;
    setRequirements(requirements: Requirement.Requirement[]): this;
    setTarget(target: Version.SemVer): this;
    syncCodemodsTarget(): this;
    overrideCodemodsTarget(target: Version.SemVer): this;
    setLogger(logger: Logger): this;
    onConfirm(callback: ConfirmationCallback | null): this;
    dry(enabled?: boolean): this;
    addRequirement(requirement: Requirement.Requirement): this;
    upgrade(): Promise<UpgradeReport>;
    confirm(message: string): Promise<boolean>;
    private checkRequirements;
    private onSuccessfulRequirement;
    private onFailedRequirement;
    private updateDependencies;
    private getScopedStrapiDependencies;
    private installDependencies;
    private runCodemods;
}
export declare const upgraderFactory: (project: AppProject, target: Version.ReleaseType | Version.SemVer, npmPackage: NPM.Package) => Upgrader;
//# sourceMappingURL=upgrader.d.ts.map