#ifndef _HTML_
#define _HTML_
const char ap_html[] PROGMEM = R"rawliteral(
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <title>WSControl Speedometers</title>
<style>
  * {
    margin:0;
    padding:0;
    box-sizing: border-box;
    text-decoration: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

   

    body {
        width:100%;
        height:100%;
        background-color:#101010;
        display: flex;
        align-items: center;
        flex-direction: column;
        position: relative;
    }
    
    .container{
        width: 100%;
        padding:10px 30px 0px 30px;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

     
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        position: relative;
    }

     
    .title h1 {
        color:#73716e;
        text-align: center;
        order:2;
     
    }

    .control-list {
        width: 70%;
        height: 100%;
        display:flex;
        flex-wrap: wrap;
        gap:10px;
    }

    .pop-up-control{
        width: 30%;
        padding:10px;
        height: 230px;
        background-color: #282828;
        border-radius: 5px; 
        display: flex;
        align-items: center;
        justify-content: center;
   
    }

    .pop-up-control:hover {
        scale: 102%;
    }

    .pop-up-title {
        color:white;
        font-size: 20px;
    }

    .car {
        position: absolute;
        margin-top: 110px;
        display:flex;
        align-items: center;
        color:white;
        border-radius: 5px; 
        cursor: pointer;
        transition:.6s;

        border: 1px solid #282828;
        padding:10px;
    }
   
    .car:hover{
        background-color: #282828;
        color:rgba(9,108,190,0.75);
    }
    .car:hover #car-icon {
        color:red;
    }

    .status {
        width:50%;
        height: 200px;
        background-color: #282828;
        display: flex;
        justify-content: center;
        margin-top:80px;
        padding:15px;
        border-radius: 5px; 
    }
    
    .status p {
        font-size: 25px;
        color:#73716e;
    }

    .pop-up-title {
        color:#73716e;
        display: flex;
        text-align: center;
        justify-content: center;
        font-weight: 600;
        cursor:pointer;
        align-items: center;
    }

    .modals {
        position:fixed;
        border-radius: 5px; 
        z-index: 99;
        background-color: #282828;
        width: 50%;
        height: 500px;
        top:calc(100%/6);
    }

    .hidden {
        display: none;
    }

    .tampil {
        display: block;
    }

    .modals > .material-symbols-outlined {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .close {
        cursor: pointer;
        color:#73716e;
    }

    .close:hover {
        color:red;
    }

    .containers {
        width: 100%;
        height: 100%;
        padding: 20px;
        color:#73716e;
    }

    .containers > p {
      font-weight: 500;
    }

    .backdrop {
        width: 100%;
        position: absolute;
        height: 100%;
        opacity: 30%;
        background-color:#73716e;
    }

    input {
        width:100%;
        font-size: large;
        padding:10px;
        margin-top:10px;
        border:none;
        background-color: #73716e;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    input:focus {
        box-shadow: rgba(9,108,190,0.75) 0px 3px 8px;
        outline: none;
    }

    button {
        padding:10px;
        outline:none;
        background-color:#282828;
        margin-top:10px;
        border-radius: 5px;
        color:#73716e;
        border: 1px solid #474747;
        font-size: large;
        transition: .3s;
    }

    button:hover {
        opacity: 90%;
        background-color: #474747;
    }
    button:focus {
        scale:105%;
    }

    .driving-menu , .sein-menu {
        display:flex;
        gap:10px;
    }
    
    .sein-menu button{
      display:flex;
      align-items: center;
    }

    .btn-popctr , .btn-ac{
        position: relative;
    }

    .btn-popctr , .btn-ac button{
        position: absolute
    }
    ::placeholder {
        color:#101010;
    }

</style>
</head>
<body>
   <div class="title">
       <h1>Speedometer Websocket Control</h1>
       <div class="car">
        <span id="car-icon" class="material-symbols-outlined">
            power_settings_new
        </span>Turn On Car</div>
   </div>
 <div class="status">
  <p>Car Status</p>
 </div>
 <div class="container">
    <div id="temp" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
        <div class="containers">
            <p>Temp Control</p>
            <h1>Temp Saat ini : 28c</h1>
            <input type="number" max="40">
            <button>Submit</button>
        </div>
    </div>
    <div id="drivecar" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
               <p>Driving Mode</p>
               <h1>Driving Mode Saat Ini : Eco</h1>
                <div class="driving-menu">
                    <button>Eco</button>
                    <button>Normal</button>
                    <button>Sport</button>
                </div>
            </div>
    </div>
    <div id="popctrl" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Pop Control</p>
                <h1>Pop Up Muncul</h1>
                <div class="btn-popctr">
                    <button id="hidden" class="btn-pops hidden"> Hilangkan Pop Up</button>
                    <button id="show" class="btn-pops show">Munculkan Pop Up</button>
                </div>
           
            </div>
    </div>
    <div id="speed" class="modals hidden">
        <span id="close"class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Speed Control</p>
                <h1>Speed Saat Ini :</h1>
                <input type="range" name="speedctr" id="spdctrls">
                <input type="text" placeholder="Masukan Satuan Pasti" name="speedctrtext" id="spdctrlstxt1">
                <button>Submit</button>
            </div>
    </div>
    <div id="sein" class="modals hidden">
        <span id="close" class="material-symbols-outlined close">close
            </span>
            <div class="containers">
                <p>Sein Control</p>
                <h1>Status:</h1>
                <div class="sein-menu">
                    <button><span class="material-symbols-outlined">
                        arrow_back
                        </span>Sein Kiri</button>
                    <button><span class="material-symbols-outlined">
                        arrow_right_alt
                        </span>Sein Kanan</button>
                    <button><span class="material-symbols-outlined">
                        warning
                        </span>Hazard</button>
                </div>
            </div>
    </div>
    <div id="ac" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Utility Control</p>
                <h1>Status:</h1>
                <div class="btn-ac">
                    <button id="hiddenac" class="btn-pops hidden">Nyalakan AC</button>
                    <button id="showac" class="btn-pops show">Matikan AC</button>
                </div>
                <div class="btn-lamp" style="margin-top:50px;">
                    <button id="showlamp" class="btn-pops show">Nyalakan Lampu</button>
                    <button id="hiddenlmp" class="btn-pops hidden">Matikan Lampu</button>
                </div>
            </div>
    </div>
    <div id="battery" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Battery Control</p>
                <h1>Status Battery:</h1>
                <input type="number" name="btr" id="btryctrl1" placeholder="masukan jumlah battery">
                <button>Submit</button>
            </div>
    </div>
    <div id="driveinfo" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Drive Info Control</p>
                <input type="text" name="" id="" placeholder="Jumlah Waktu Berkendara">
                <input type="text" name="" placeholder="Jarak Berkendara">
                <input type="text" name="" placeholder="Sisa Jarak Pada Battery">
                <button>Submit</button>
            </div>
    </div>
    <div id="caricon" class="modals hidden">
        <span class="material-symbols-outlined close">
            close
            </span>
            <div class="containers">
                <p>Car Icon Control</p>
            </div>
    </div>
    <div class="control-list">
        <div id="temp" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    device_thermostat
                </span>
                <p>Set Suhu</p>
            </div>
        </div>
        <div id="drivecar" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    directions_car
                </span>
                <p>Set Driving Mode</p>
            </div>
        </div>
        <div id="popctrl" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                     tab
                    </span>
                <p>Pop Up Control</p>
            </div>
        </div>
        <div id="speed" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    speed
                    </span>
                <p>Set Speed</p>
            </div>
        </div>
        <div id="sein" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    arrow_right
                    </span>
                <p>Set Lampu Sein</p>
            </div>
        </div>
        <div id="ac" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    mode_fan
                    </span>
                <p>Set Utility</p>
            </div>
        </div>
        <div id="battery" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    battery_horiz_075
                    </span>
                <p>Set Battery</p>
               
            </div>
        </div>
        <div id="driveinfo" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    calendar_month
                    </span>
                <p>Set Drive Info</p>
            </div>
        </div>    
        <div id="caricon" class="pop-up-control">
            <div class="pop-up-title">
                <span class="material-symbols-outlined">
                    directions_car
                </span>
                <p>Set Car Icon</p>
            </div>
        </div>
    </div>
 </div>
 <div class="mb" style="margin-bottom:950px;"></div>
 <div class="backdrop hidden">
 </div>
 <script>
     let suhu = document.getElementById("temp")
     let close = document.getElementsByClassName("close");
     let popupcontrol = document.getElementsByClassName("pop-up-control");
     let modals = document.getElementsByClassName("modals");
     let backdrop = document.getElementsByClassName("backdrop")[0];
     let btnpopshide = document.getElementById("hidden");
     let btnpopshow = document.getElementById("show");
     let btnpopshideac = document.getElementById("hiddenac");
     let btnpopshowac = document.getElementById("showac");

     var gateway = `ws://${window.location.hostname}/ws`;
     var websocket;
     function initWebSocket() {
       console.log('Trying to open a WebSocket connection...');
       websocket = new WebSocket(gateway);
       websocket.onopen    = onOpen;
       websocket.onclose   = onClose;
       websocket.onmessage = onMessage; // <-- add this line
     }
     function onOpen(event) {
       console.log('Connection opened');
     }
     function onClose(event) {
       console.log('Connection closed');
       setTimeout(initWebSocket, 2000);
     }

    for(let i=0; i<popupcontrol.length; i++){
        popupcontrol[i].addEventListener("click",function(){
               let getModals = document.getElementById(`${popupcontrol[i].id}`);
                 backdrop.classList.remove("hidden")
                 backdrop.classList.add("tampil")
                 getModals.classList.remove("hidden")
                 getModals.classList.add("tampil")
                  
        })
    }

    for(let i=0;i<close.length;i++){
        let parentElement = close[i].parentElement;
        close[i].addEventListener("click",function(){
            for(let i = 0; i<modals.length; i++){
                if(close[i].parentElement.id == modals[i].id){
                    backdrop.classList.remove("tampil")
                    backdrop.classList.add("hidden")
                    modals[i].classList.remove("tampil");
                    modals[i].classList.add("hidden");
                }
            }   
        })
     }

    btnpopshide.addEventListener("click",function(){
        if(btnpopshide.classList.contains("hidden")){
            btnpopshide.classList.remove("hidden");
            btnpopshide.classList.add("show");
            btnpopshow.classList.remove("show");
            btnpopshow.classList.add("hidden");
        } else {
            btnpopshide.classList.remove("show");
            btnpopshide.classList.add("hidden");
            btnpopshow.classList.remove("hidden");
            btnpopshow.classList.add("show")
        }
    })

    btnpopshow.addEventListener("click",function(){
        if(btnpopshow.classList.contains("hidden")){
            btnpopshow.classList.remove("hidden");
            btnpopshow.classList.add("show");
            btnpopshide.classList.remove("show");
            btnpopshide.classList.add("hidden");
        } else {
            btnpopshow.classList.remove("show");
            btnpopshow.classList.add("hidden");
            btnpopshide.classList.remove("hidden");
            btnpopshide.classList.add("show")
        }
    })

    btnpopshideac.addEventListener("click",function(){
        if(btnpopshideac.classList.contains("hidden")){
            btnpopshideac.classList.remove("hidden");
            btnpopshideac.classList.add("show");
            btnpopshowac.classList.remove("show");
            btnpopshowac.classList.add("hidden");
        } else {
            btnpopshideac.classList.remove("show");
            btnpopshideac.classList.add("hidden");
            btnpopshowac.classList.remove("hidden");
            btnpopshowac.classList.add("show")
        }
    })

    btnpopshowac.addEventListener("click",function(){
        if(btnpopshowac.classList.contains("hidden")){
            btnpopshowac.classList.remove("hidden");
            btnpopshowac.classList.add("show");
            btnpopshideac.classList.remove("show");
            btnpopshideac.classList.add("hidden");
        } else {
            btnpopshowac.classList.remove("show");
            btnpopshowac.classList.add("hidden");
            btnpopshideac.classList.remove("hidden");
            btnpopshideac.classList.add("show")
        }
    })
</script>
</body>
</html>
)rawliteral";
#endif
