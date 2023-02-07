import * as ReactDocGen from 'react-docgen'
import * as ts from 'typescript'
import * as tsMorph from 'ts-morph'

export default class DependencyAnalyzer {
    private _sourceFile: ts.SourceFile | undefined
    private _dependencies: string[] = []

    constructor(filePath: string) {
        const project = new tsMorph.Project()
        const sourceFile = project.addSourceFileAtPath(filePath)
        this._sourceFile = ts.isSourceFile(sourceFile.getNode()) as unknown as ts.SourceFile
        
    }
}