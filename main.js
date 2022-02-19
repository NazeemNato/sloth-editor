import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
// setup our intepeter wasm module
const go = new Go();
WebAssembly.instantiateStreaming(fetch("sloth.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
)

let initPgm = `var myName = "Nazeem";
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

`

const initialState = EditorState.create({
  doc: initPgm,
  extensions: [
    basicSetup,
    // javascript(),
    // keymap.of([uppercaseKeybinding]),
    // myTheme,
    // myHighlightStyle,
  ],
});

const view = new EditorView({
  parent: document.getElementById('playground'),
  state: initialState,
});

window.view = view;


// add button listener to run-sloth
document.getElementById('run-sloth').addEventListener('click', () => {
  const code = view.state.doc.text.join("\n")
  console.log(code)
  const response = mySloth(code)
  // set response to console-output
  document.getElementById('console-output').innerHTML = response
}
);