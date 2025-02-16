import path from "node:path";
import * as vscode from "vscode";
import { getCommentSymbols } from "./comments";

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
                builder.insert(new vscode.Position(0, 0), template);
            });
        },
    );

    context.subscriptions.push(disposable);
}
