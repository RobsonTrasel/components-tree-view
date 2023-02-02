export interface Component {
    name: string
    parent: string
    dependencies: string[]
    statesVariables: string[];
    hooks: string[];
}