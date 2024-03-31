export interface CoverageSummaryData {
    lines: Totals;
    statements: Totals;
    branches: Totals;
    functions: Totals;
}

export class CoverageSummary {
    constructor(data: CoverageSummary | CoverageSummaryData);
    merge(obj: CoverageSummary): CoverageSummary;
    toJSON(): CoverageSummaryData;
    isEmpty(): boolean;
    data: CoverageSummaryData;
    lines: Totals;
    statements: Totals;
    branches: Totals;
    functions: Totals;
}

export interface CoverageMapData {
    [key: string]: FileCoverage | FileCoverageData;
}

export class CoverageMap {
    constructor(data: CoverageMapData | CoverageMap);
    addFileCoverage(pathOrObject: string | FileCoverage | FileCoverageData): void;
    files(): string[];
    fileCoverageFor(filename: string): FileCoverage;
    filter(callback: (key: string) => boolean): void;
    getCoverageSummary(): CoverageSummary;
    merge(data: CoverageMapData | CoverageMap): void;
    toJSON(): CoverageMapData;
    data: CoverageMapData;
}

export interface Location {
    line: number;
    column: number;
}

export interface Range {
    start: Location;
    end: Location;
}

export interface BranchMapping {
    loc: Range;
    type: string;
    locations: Range[];
    line: number;
}

export interface FunctionMapping {
    name: string;
    decl: Range;
    loc: Range;
    line: number;
}

export interface FileCoverageData {
    path: string;
    statementM