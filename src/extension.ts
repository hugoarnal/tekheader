import path from "node:path";
import * as vscode from "vscode";
import { getCommentSymbols } from "./comments";

// TODO: replace this hard coded function by something like regex?
function replaceExistingComment(document: string, commentSymbol: any) {
    const lines = document.split("\n");

    if (
        lines[0] === commentSymbol["top"] &&
        lines[5] === commentSymbol["bottom"]
    ) {
        return true;
    }
    return false;
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "tekheader.addHeader",
        async () => {
            let editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            let language = editor.document.languageId;

            const commentSymbol = await getCommentSymbols(language);
            if (!commentSymbol) {
                return;
            }

            const year = new Date().getFullYear().toString();
            const folder = vscode.workspace.name;
            const file = path.basename(editor.document.fileName);

            const template = `${commentSymbol.top}
${commentSymbol.middle} EPITECH PROJECT, ${year}
${commentSymbol.middle} ${folder}
${commentSymbol.middle} File description:
${commentSymbol.middle} ${file}
${commentSymbol.bottom}\n\n`;

            editor.edit((builder) => {
                if (
                    replaceExistingComment(
                        editor.document.getText(),
                        commentSymbol,
                    )
                ) {
                    builder.replace(
                        new vscode.Range(
                            new vscode.Position(0, 0),
                            new vscode.Position(7, 0),
                        ),
                        template,
                    );
                } else {
                    builder.insert(new vscode.Position(0, 0), template);
                }
            });
        },
    );

    context.subscriptions.push(disposable);
}
