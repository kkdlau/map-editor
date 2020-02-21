export interface Action {
    undo?: Function,
    redo?: Function,
    param?: {}
}

// store all records that can undo.
export const undoRecord: Array<string> = [];

// store all records that can redo.
export const redoRecord: Array<string> = [];