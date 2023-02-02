import * as fs from 'fs'
import * as path from 'path'
import * as commander from 'commander'
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
    PropertyDeclaration,
    PropertySignature,
    JsxOpeningElement,
    JsxElement,
    VariableDeclarationList
} from 'ts-morph'

export class FileParser {
    private _components: Component[] = []

    public parseFile(filePath: string): void {
        const project = new Project()
        const sourceFile = project.createSourceFile(filePath)

        sourceFile.forEachDescendant((node: Node) => {
            if (node instanceof ImportDeclaration) {
                const dependency = node.getModuleSpecifierValue();
                this._components.forEach((component) => {
                    if (!component.dependencies.includes(dependency)) {
                        component.dependencies.push(dependency);
                    }
                });
            }
            if (node instanceof CallExpression) {
                const expression = node.getExpression();
                if (expression instanceof Identifier) {
                    if (expression.getText() === 'useState') {
                        this._components.forEach((component) => {
                            if (!component.hooks.includes('useState')) {
                                component.hooks.push('useState');
                            }
                        });
                    }
                    if (expression.getText() === 'useEffect') {
                        this._components.forEach((component) => {
                            if (!component.hooks.includes('useEffect')) {
                                component.hooks.push('useEffect');
                            }
                        });
                    }
                }
            }
            if (node instanceof VariableDeclarationList) {
                node.getDeclarations().forEach((declaration) => {
                    if (declaration.getNameNode() instanceof Identifier) {
                        this._components.forEach((component) => {
                            if (!component.statesVariables.includes(declaration.getName())) {
                                component.statesVariables.push(declaration.getName());
                            }
                        });
                    }
                });
            }
            if (node instanceof JsxOpeningElement) {
                const componentName = node.getTagNameNode().getText();
                let component = this._components.find((c) => c.name === componentName);
                if (!component) {
                    component = {
                        name: componentName,
                        parent: '',
                        dependencies: [],
                        hooks: [],
                        statesVariables: [],
                    };
                    this._components.push(component);
                }
                node.forEachChild((childNode: Node) => {
                    if (childNode instanceof JsxElement) {
                        const childComponentName = childNode.getOpeningElement().getTagNameNode().getText();
                        let childComponent = this._components.find((c) => c.name === childComponentName);
                        if (!childComponent) {
                            childComponent = {
                                name: childComponentName,
                                parent: componentName,
                                dependencies: [],
                                hooks: [],
                                statesVariables: [],
                            };
                            this._components.push(childComponent);
                        }
                    }
                });
            }
        });
    }
    public getComponents(): Component[] {
        return this._components
    }

    public toMarkdown(): string {
        let markdown = "# Components\n"
        this._components.forEach((component) => {
            markdown += `## ${component.name}\n`;
            markdown += `Parent: ${component.parent}\n`;
            markdown += `Dependencies: ${component.dependencies.join(", ")}\n`;
            markdown += `State Variables: ${component.statesVariables.join(", ")}\n`;
            markdown += `Hooks: ${component.hooks.join(", ")}\n`;
          });
        return markdown;
    }

    public toString(): string {
        let string = "Components:\n";
        this._components.forEach((component) => {
          string += `- ${component.name}\n`;
          string += `  Parent: ${component.parent}\n`;
          string += `  Dependencies: ${component.dependencies.join(", ")}\n`;
          string += `  State Variables: ${component.statesVariables.join(", ")}\n`;
          string += `  Hooks: ${component.hooks.join(", ")}\n`;
        });
        return string;
    }
}

export const program = new commander.Command()

program
    .command("map <filePath>")
    .description("Parse a file and output the results in string and markdown formats.")
    .action((filePath) => {
        const parser = new FileParser();
        parser.parseFile(path.resolve(filePath));
        const markDown = parser.toMarkdown();
        fs.writeFileSync(`${filePath}.md`, markDown);
        console.log(parser.toString());
    })