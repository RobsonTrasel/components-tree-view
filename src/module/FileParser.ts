import * as fs from 'fs'
import * as path from 'path'
import { Component } from '../interface/interface'
import { 
    Project,
    Node, 
    SourceFile, 
    TypeChecker,
    SyntaxKind,
    ImportDeclaration,
    ClassDeclaration,
    MethodDeclaration,
    CallExpression,
    Identifier,
    VariableDeclaration,
    PropertyDeclaration,
    PropertySignature,
    JsxOpeningElement,
    JsxElement
} from 'ts-morph'

export class FileParser {
    private _components: Component[] = []

    public parseFile(filePath: string): void {
        const project = new Project()
        const sourceFile = project.createSourceFile(filePath)

        sourceFile.forEachDescendant((node: Node) => {
            if(node instanceof ImportDeclaration) {
                const dependency = node.getModuleSpecifierValue()
                this._components.forEach((component) => {
                    if(!component.dependencies.includes(dependency)) {
                        component.dependencies.push(dependency)
                    }
                })
            }
            if(node instanceof CallExpression) {
                const expression = node.getExpression();
                if(expression instanceof Identifier) {
                    if(expression.getText() === 'useState') {
                        this._components.forEach((component) => {
                            if(!component.hooks.includes('useState')) {
                                component.hooks.push('useState')
                            }
                        })
                    }
                    if (expression.getText() === 'useEffect') {
                        this._components.forEach((component) => {
                            if (!component.hooks.includes('useEffect')) {
                                component.hooks.push('useEffect');
                            }
                        })
                    }
                }
            }
            if(node instanceof VariableDeclaration) {
                node.getDeclarations().forEach((declaration: { getNameNode: () => any; getName: () => string }) => {
                    if (declaration.getNameNode() instanceof Identifier) {
                        this._components.forEach((component) => {
                            if (!component.statesVariables.includes(declaration.getName())) {
                            component.statesVariables.push(declaration.getName());
                            }
                        });
                    }
                });
            })
            

    }

    
}