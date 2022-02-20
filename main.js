// import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
// import { tags, HighlightStyle } from "@codemirror/highlight"
import * as monaco from 'monaco-editor';

// setup our intepeter wasm module
const go = new Go();
WebAssembly.instantiateStreaming(fetch("sloth.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
)

let initPgm = `var myName = "Nazeem";
var myArray = [1,2,3]
var myFunc = fun(name) {
  return concat("Hi", name)
}

var isGreater = fun(x) {
  if(x > 10) {
    return true
  } else {
    return false
  }
}

var greet = myFunc(myName);
var mul =  5 * 1

if(!isGreater(mul)) {
  print("Oh no")
} else {
  print(greet)
}
print(myArray[0])
`


monaco.languages.register({ id: 'sloth' });

monaco.languages.setMonarchTokensProvider('sloth', {
  tokenizer: {
    root: [
      [/\b(?:print|if|else|fun|var|concat|true|false|concat|len)\b/, 'keyword'],
      [/\b(?:[0-9]+)\b/, 'number'],
      [/\b(?:[a-zA-Z_][a-zA-Z0-9_]*)\b/, 'identifier'],
      [/[,;]/, 'delimiter'],
      [/[()]/, 'paren'],
      [/[\s]+/, 'whitespace'],
      [/"(?:[^\\"]|\\.)*"/, 'string'],
      [/\[(?:[^\]]|\\.)*\]/, 'string'],
    ],
  },
});
// completion
monaco.languages.registerCompletionItemProvider('sloth', {
  provideCompletionItems: () => {
    var suggestions = [
      {
        label: 'concat',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'concat(${1:word1},${2:word2})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'concatenate strings',
      },
      {
        label: 'ifelse',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If-Else Statement'
      },
      {
        label: 'len',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'len(${1:word1})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'length of string or array',
      },
      {
        label: 'fun',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: ['var myFunc = fun(${1:param}) {', '\treturn $1', '}'].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'create sloth function',
      },
      {
        label: 'print',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'print(${1:word})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'print function in sloth',
      }
    ];
    return { suggestions: suggestions };
  }
});


monaco.editor.create(document.getElementById('playground'), {
  value: initPgm,
  automaticLayout: true,
  fontSize: 16,
  language: 'sloth',
});

// add button listener to run-sloth
document.getElementById('run-sloth').addEventListener('click', () => {
  document.getElementById('console-output').innerHTML = '';
  let code = monaco.editor.getModels()[0].getValue();
  console.log(code);
  // const code = view.state.doc.text.join("\n")
  const response = mySloth(code)
  // set response to console-output
  if (response.trim().length !== 0) {
    document.getElementById('console-output').innerHTML = response
  }
}
);