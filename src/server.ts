import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    InitializeParams,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams,
    DidChangeConfigurationNotification
} from 'vscode-languageserver';

import { basename } from 'path';

import * as jsonToAst from "json-to-ast";

import { ExampleConfiguration, Severity, RuleKeys } from './configuration';
import { makeLint, LinterProblem } from './linter';

let conn = createConnection(ProposedFeatures.all);
let docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;


let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

conn.onInitialize((params: InitializeParams) => {
    let capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we will fall back using global settings
    hasConfigurationCapability = !!capabilities.workspace && !!capabilities.workspace.configuration;
    hasWorkspaceFolderCapability = !!capabilities.workspace && !!capabilities.workspace.workspaceFolders;
    hasDiagnosticRelatedInformationCapability = !!capabilities.textDocument &&
      !!capabilities.textDocument.publishDiagnostics &&
      !!capabilities.textDocument.publishDiagnostics.relatedInformation;
  
    return {
      capabilities: {
        textDocumentSync: docs.syncKind,
        // Tell the client that the server supports code completion
        completionProvider: {
          resolveProvider: true
        }
      }
    };
});

conn.onInitialized(() => {
    if (hasConfigurationCapability) {
      // Register for all configuration changes.
      conn.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        conn.workspace.onDidChangeWorkspaceFolders(_event => {
        conn.console.log('Workspace folder change event received.');
      });
    }
  });
  
function GetSeverity(key: RuleKeys): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }

    const severity: Severity = conf.severity[key];

    switch (severity) {
        case Severity.Error:
            return DiagnosticSeverity.Error;
        case Severity.Warning:
            return DiagnosticSeverity.Warning;
        case Severity.Information:
            return DiagnosticSeverity.Information;
        case Severity.Hint:
            return DiagnosticSeverity.Hint;
        default:
            return undefined;
    }
}

function GetMessage(key: RuleKeys): string {
    if (key === RuleKeys.BlockNameIsRequired) {
        return 'Field named \'block\' is required!';
    }

    if (key === RuleKeys.UppercaseNamesIsForbidden) {
        return 'Uppercase properties are forbidden!';
    }

    return `Unknown problem type '${key}'`;
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const source = basename(textDocument.uri);
    const json = textDocument.getText();

    const validateObject = (
        obj: jsonToAst.AstObject
    ): LinterProblem<RuleKeys>[] =>
        obj.children.some(p => p.key.value === 'block')
            ? []
            : [{ key: RuleKeys.BlockNameIsRequired, loc: obj.loc }];

    const validateProperty = (
        property: jsonToAst.AstProperty
    ): LinterProblem<RuleKeys>[] =>
        /^[A-Z]+$/.test(property.key.value)
            ? [
                  {
                      key: RuleKeys.UppercaseNamesIsForbidden,
                      loc: property.key.loc
                  }
              ]
            : [];

    const diagnostics: Diagnostic[] = makeLint(
        json,
        validateProperty,
        validateObject
    ).reduce(
        (
            list: Diagnostic[],
            problem: LinterProblem<RuleKeys>
        ): Diagnostic[] => {
            const severity = GetSeverity(problem.key);

            if (severity) {
                const message = GetMessage(problem.key);

                let diagnostic: Diagnostic = {
                    range: {
                        start: textDocument.positionAt(
                            problem.loc.start.offset
                        ),
                        end: textDocument.positionAt(problem.loc.end.offset)
                    },
                    severity,
                    message,
                    source
                };

                list.push(diagnostic);
            }

            return list;
        },
        []
    );

    if (diagnostics.length) {
        conn.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }
}

async function validateAll() {
    for (const document of docs.all()) {
        await validateTextDocument(document);
    }
}

docs.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
