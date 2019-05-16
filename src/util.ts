import * as fs from 'fs'
import Color from 'color'
import tmp from 'tmp'
import { Location } from 'vscode-languageclient'
import {
  workspace as Workspace,
  window as Window,
  TextEditor,
  TextDocument,
  TextEditorRevealType,
  Position,
  Range,
  Selection
} from 'vscode'

export function createTempFile(content: string, options = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    tmp.file(options, (err, path) => {
      if (err) return reject(err)
      fs.writeFile(path, content, { encoding: 'utf8' }, err => {
        if (err) return reject(err)
        resolve(path)
      })
    })
  })
}

export function getSvgColorFromValue(value: string): string {
  if (typeof value !== 'string') return null

  if (value === 'transparent') {
    return 'none'
  }

  try {
    let parsed = Color(value)
    if (parsed.valpha === 0) return 'none'
    return parsed.rgb().string()
  } catch (err) {
    return null
  }
}

export function openDocument({ uri, range }: Location): void {
  Workspace.openTextDocument(uri.replace(/^file:\/\//, '')).then(
    (doc: TextDocument) => {
      Window.showTextDocument(doc).then((editor: TextEditor) => {
        let start = new Position(range.start.line, range.start.character)
        let end = new Position(range.end.line, range.end.character)
        editor.revealRange(new Range(start, end), TextEditorRevealType.InCenter)
        editor.selection = new Selection(start, end)
      })
    }
  )
}
