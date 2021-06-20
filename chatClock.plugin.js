/**
 * @name chatClock
 * @version 1.0.3
 * @description Adds a clock at the top right of the chat
 * @author fuk_u_im_a_unicorn
 * @authorId 287279366034030592
 * @source https://github.com/fukuimaunicorn/BD-plugins/blob/main/chatClock.plugin.js
 * @updateUrl https://raw.githubusercontent.com/fukuimaunicorn/BD-plugins/main/chatClock.plugin.js
 */

const fs = require('fs');

class Clock extends BdApi.React.Component {
    constructor(props){
        super(props);
        this.state = {
            time: new Date().toLocaleString().substring(11, 16)
        };
    }

    componentDidMount(){
        this.interval = setInterval(
            () => this.tick(),
            1000
        );
        this.intervalCss = setInterval(
            () => this.checkCss(),
            10000
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalCss);
    }
    tick(){
        this.setState({
            time: new Date().toLocaleString().substring(11, 16)
        });
    }
    checkCss(){
        try{
            if(document.getElementById("chatClockDiv").style != clockCss){
                document.getElementById("chatClockDiv").style = clockCss;
                config.css = clockCss;
                saveConfig();
            }
        }
        catch(e){
            console.log(e);
        }
    }

    render() {
        return this.state.time;
    }
}
let config = {};
let clockCss;


if(BdApi.loadData("chatClock", "css")==undefined)
    createDefaultConfig();
else{
    config.css = BdApi.loadData("chatClock", "css");
}

clockCss = config.css;

module.exports = class chatClock {

    load(){}

    start() {
        try{
            appendClock();
        }
        catch(e){
            console.log(e);
        }
    }
    
    stop() {
        try {
            BdApi.ReactDOM.unmountComponentAtNode(document.getElementById("chatClockDiv"));
        }
        catch(e){
            console.log(e);
        }
    }
    
    //on switching append clock again
    onSwitch(){
        if(document.getElementById("chatClockDiv")==undefined)
            appendClock();
    }

    getSettingsPanel(){
        let cssSettings = "<div><div id='clockCssEditor'></div></div>";
        let editor;

        setTimeout(()=>{
            document.getElementById("clockCssEditor").style = "width 50%; height: 200px; margin: auto;";
            editor = monaco.editor.create(document.getElementById("clockCssEditor"), {
                value: "clockCSS {"+clockCss+"}",
                language: "css",
            
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                theme: "vs-dark",
            });
            editor.getModel().onDidChangeContent((event)=>{
                clockCss = editor.getValue().split("{")[1].split("}")[0];
            });

        }, 100);

        return cssSettings;
    }
}

function createDefaultConfig(){
    const defaultConfig = {css: "\n\tposition: absolute;\n\ttop: 10px;\n\tright: 30px;\n\tfont-size: 32px;\n\tcolor: white;\n"};
    config = defaultConfig;
    saveConfig();
}

function saveConfig(){
    BdApi.saveData("chatClock", "css", config.css);
}

function appendClock(){
    //get frame of chat
    let chat = BdApi.findModuleByProps("messagesWrapper").messagesWrapper;
    
    if(!chat) return;
    
    //create and append div for clock
    let clockDiv = document.createElement("div");
    clockDiv.setAttribute("id", "chatClockDiv");
    chat.appendChild(clockDiv);
    document.getElementById("chatClockDiv").style = clockCss;

    //render clock inside div
    BdApi.ReactDOM.render(BdApi.React.createElement(Clock), document.getElementById("chatClockDiv"));
}
