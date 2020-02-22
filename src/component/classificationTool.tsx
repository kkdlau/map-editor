import React from "react";
import './css/classificationTool.css';
import ButtonGroup from './ButtonGroup';
import TabButton from "./TabButton";
import { IconButton } from "@material-ui/core";
import Save from '@material-ui/icons/Save';
import classification from './classification.json'
import { toolChooseColor } from "./Menu";


interface ClassificationToolProps {
}

interface ClassificationToolState {
}

let toolChoose = 'floor';
let classificationData = classification;

export class ClassificationTool extends React.Component<ClassificationToolProps, ClassificationToolState> {

    constructor(props: ClassificationToolProps, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <div className='classification-tool-body'>
                <div className='title' style={{ padding: '7px' }}>分類工具</div>
                <ButtonGroup
                    selectedStyle={{ border: '10px solid' }}
                    defaultValue={"floor"}
                    choose={(alias: string, last: string) => {
                        toolChoose = alias;
                    }}>
                    <TabButton className='toolButton button' alias='floor' style={{ background: toolChooseColor['floor'] }}>地板</TabButton>
                    <TabButton className='toolButton button' alias='wall' style={{ background: toolChooseColor['wall'] }}>牆壁</TabButton>
                    <TabButton className='toolButton button' alias='object' style={{ background: toolChooseColor['object'] }}>物件</TabButton>
                </ButtonGroup>

                <div style={{ background:'black' }}>
                    <IconButton className='button' title="save" onClick={() => {
                        let datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(classificationData));
                        let downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", datastr);
                        downloadAnchorNode.setAttribute("download", 'classification.json');
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                    }}>
                        <Save style={{ color: "hsl(0, 1%, 80%)" }} />
                    </IconButton>
                </div>

            </div>
        );
    }
}

export const materialChoose = (which: string, idx: number): void => {
    document.getElementById(which).style.border = '2px solid ' + toolChooseColor[toolChoose];
    classificationData[idx] = toolChoose;
}

export default ClassificationTool;
