/**
 * @name chatClock
 * @version 1.0.2
 * @description Adds a clock at the top right of the chat
 * @author fuk_u_im_a_unicorn
 * 
 * 
 */

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
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    tick(){
        this.setState({
            time: new Date().toLocaleString().substring(11, 16)
        });
    }

    render() {
        let clock = this.state.time;

        return clock;
    }
}

 module.exports = class chatClock {
    load() {} // Optional function. Called when the plugin is loaded in to memory

    start() {
        try{
            appendClock();
        }
        catch(e){
            console.log(e);
        }
    } // Required function. Called when the plugin is activated (including after reloads)
    stop() {
        BdApi.ReactDOM.unmountComponentAtNode(document.getElementById("chatClockDiv"));
    } // Required function. Called when the plugin is deactivated
    
    //on switching append clock again
    onSwitch(){
        if(document.getElementById("chatClockDiv")==undefined)
            appendClock();
    }
}

function appendClock(){
    //get frame of chat
    let chat = document.getElementsByClassName("messagesWrapper-1sRNjr")[0];
    if(chat==undefined)
        return;
    //create and append div for clock
    let clockDiv = document.createElement("div");
    clockDiv.setAttribute("id", "chatClockDiv");
    chat.appendChild(clockDiv);
    document.getElementById("chatClockDiv").style = "position: absolute; top: 10px; right: 30px; font-size: 32px; color: white;";

    //render clock inside div
    BdApi.ReactDOM.render(BdApi.React.createElement(Clock), document.getElementById("chatClockDiv"));
}