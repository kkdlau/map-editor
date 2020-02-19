export interface Action {
    undoFc?: Function,
    redoFc?: Function,
    param?: {}
}

// store all records that can undo.
export const undoRecord: Array<Action> = [];

// store all records that can redo.
export const redoRecord: Array<Action> = [];