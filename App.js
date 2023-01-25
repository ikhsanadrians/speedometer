import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  ImageBackground,
  Touchable,
  TouchableOpacity,
  Pressable,
  Button,
  Animated,
} from "react-native";
// import axios from 'react-native-axios';

import { WebView } from 'react-native-webview';
import moment from 'moment';
import * as Battery from "expo-battery";
import { Modal,Linking } from "react-native";
import { Node, useState, useEffect, useRef } from "react";
import gambarSpedo from "./assets/nativespedo.png";
import { LinearGradient } from "expo-linear-gradient";
import BatreIcon from "./assets/icons/batre.png";
import { useFonts } from "expo-font";
import { Aldrich_400Regular } from "@expo-google-fonts/aldrich";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
  FontAwesome5,
  Ionicons,
  Fontisto,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import gambarMobil from "./assets/icons/car.png";
import Bingkai from "./assets/testing.png";
import logointek from "./assets/icons/logointek.png";
import CarSide from "./assets/carControl/carpallete.png";
import BingkaiSpedo from "./assets/background/update.png";
import centercircle from "./assets/background/circles.png";
import background from "./assets/background/fixwppb.png";
import { Inter_100Thin } from "@expo-google-fonts/inter";
import lampudepan from "./assets/carControl/lampumenyala.png";
import pintudepan from "./assets/carControl/pintudepan.png";
import pintubelakang from "./assets/carControl/pintubelakang.png";
import carside from "./assets/cars.png";
// import * as Permissions from 'expo-permissions';
import Device from "expo-device";
import * as Notifications from "expo-notifications";
import ws from "ws";

import * as Location from 'expo-location';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});



const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const batteryLevel = new Animated.Value(0.7);
// state = {
//   batteryLevel: null,
// };

// await Notifications.getPermissionsAsync();

const App: () => Node = () => {
  const [seconds, setSeconds] = useState(0);
  const [BlinkKiri, SetBlinkKiri] = useState(false);
  const [BlinkKanan, SetBlinkKanan] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [opacityFDoor, SetFdoorOp] = useState(0);
  const [opacityBDoor, SetBdoorOp] = useState(0);
  const [opacityLamp, setLampOp] = useState(0);
  const [carControlStatus, setCarControlStatus] = useState("");
  const [websockets, setWebsocket] = useState(null);
  const [message, setMessage] = useState("");
  const [speeds,setSpeeds] = useState("");
  const inputref = useRef(null);
  const [PopUpStatus, setPopUpStatus] = useState(false);
  const [wsRange, setWsRange] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [longitude,setLongitude] = useState('');
  const [latidute,setLatidute] = useState(''); 
  const [temp,setTemp] = useState(''); 

  const triggerNotifications = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Websocket Masuk",
        body: message,
        data: { data: message },
      },
      trigger: { seconds: 1 },
    });
  };

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
       setLatidute(location.coords.latitude);
       setLongitude(location.coords.longitude);
    })();

  }, []);
  
  try {
    console.log(`latidute : ${latidute} , longitude : ${longitude}, suhu: ${temp}` ); 
  } catch {
    console.log("tunggu,sedang fetch lokasi");
  }
  
  useEffect(()=>{
    const apiKey = "74891133a9af1c283f0c9f3a9a6a18c7";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latidute}&lon=${longitude}&appid=${apiKey}&units=metric`
    ).then(response => response.json())
    .then(data=>{
      setTemp(data.main.temp);
    })
    .catch(error=>console.log(error))
  })



  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.104/ws");
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      try {
          let msgdata = JSON.parse(event.data); 
          if (msgdata.hasOwnProperty("pop")){
            setPopUpStatus(msgdata.pop)
          } else if(msgdata.hasOwnProperty("s")){
            setSpeeds(`${msgdata.s}deg`)
          } else {
            setMessage(msgdata);      
          }
      }
          catch {
        console.log("websoket belum terhubung")
      }
    
      triggerNotifications();
    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWebsocket(null);
    };
  }, []);



  // useEffect(() => {
  //   Permissions.getAsync(Permissions.NOTIFICATIONS).then((statusObj) => {
  //   if (statusObj.status !== "granted") {
  //   return Permissions.askAsync(Permissions.NOTIFICATIONS)
  //   }
  //   return statusObj;
  //   }).then((statusObj) => {
  //   if (statusObj.status !== "granted") {
  //   return;
  //   }
  //   })
  //   }, [])

  const changeModalVisible = (bool) => {
    setModal(bool);
  };

  const setData = (data) => {
    setChooseData(data);
  };



  // useEffect(() => {
  //   interval = setInterval(() => {
  //     setSeconds(seconds => seconds + 1);
  //   },20);
  //   return () => clearInterval(interval);
  // },[])

  useEffect(() => {
    const blinkIntervalkiri = setInterval(() => {
      SetBlinkKiri((BlinkKiri) => !BlinkKiri);
    }, 900);
    return () => {
      clearInterval(blinkIntervalkiri);
    };
  }, []);

  useEffect(() => {
    const blinkIntervalkanan = setInterval(() => {
      SetBlinkKanan((BlinkKanan) => !BlinkKanan);
    }, 900);
    return () => {
      clearInterval(blinkIntervalkanan);
    };
  }, []);

  useEffect(() => {
    setInterval(function(){
      let date = moment().utcOffset('+07:00').format(' HH:mm');
      setCurrentDate(date);
    },1000);
  }, []);

  //let toString = seconds.toString()
  let toString = 0;

  // console.log(toString)
  if (toString > 207) {
    clearInterval(interval);
  }
  // finalString = toString + "deg";
  finalString = toString + "deg";
  var tintColors = "";

  if (toString < 40) {
    tintColors = "green";
  } else if (toString > 41 && toString < 90) {
    tintColors = "yellow";
  } else if (toString > 91 && toString < 140) {
    tintColors = "orange";
  } else if (toString > 141) {
    tintColors = "red";
  }

  stringTint = tintColors;
  // console.log(stringTint)

  const tintColour = {
    tintColor: "#BCBCBC",
  };

  // let hasil = parsejson(message);

  // function parsejson(jsonString){
  //   try {
  //     return JSON.parse(jsonString)
  //   } catch (e) {
  //     console.log("Error while parsing",e)
  //   }
  // }

  const transform = {
    transform: [
      { rotate: !speeds ? "0deg" : speeds },
      { translateY: (500 - 500) / 2 },
      { translateX: (screenHeight - screenWidth) / 6 },
    ],
  };

  const [loaded] = useFonts({
    Exo: require("./assets/fonts/exo.ttf"),
    Mikroma: require("./assets/fonts/mikroma.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const hiddenafterseconds = () => {
    setTimeout(() => {
      setCarControlStatus("");
    }, 10000);
  };

  const handleFrontDoor = () => {
    if (opacityFDoor === 100) {
      SetFdoorOp(0);
      try {
        websockets.send("Pintu Depan Tertutup");
      } catch {
        console.log("websocket belum terhubung");
      }
    } else {
      SetFdoorOp(100);
      try {
        websockets.send("Pintu Depan Terbuka");
      } catch {
        console.log("websocket belum terhubung");
      }
    }
  };

  const handleBackDoor = () => {
    if (opacityBDoor === 100) {
      SetBdoorOp(0);
      try {
        websockets.send("Pintu Belakang Tertutup");
      } catch {
        console.log("websocket belum terhubung");
      }
    } else {
      SetBdoorOp(100);
      try {
        websockets.send("Pintu Belakang Terbuka");
      } catch {
        console.log("websocket belum terhubung");
      }
    }
  };


  const setBatteryLevel = (level) => {
    batteryLevel.setValue(level);
}




setBatteryLevel(100)

  const handleLamp = () => {
    if (opacityLamp === 100) {
      setLampOp(0);
      try {
        websockets.send("Lampu Mati");
      } catch {
        console.log("websocket belum terhubung");
      }
    } else {
      setLampOp(100);
      try {
        websockets.send("Lampu Menyala");
      } catch {
        console.log("websocket belum terhubung");
      }
    }
  };

  const handleSubmit = () => {
    const inputValue = inputref.current.value;
    const inputToString = inputValue.toString();
    // websocket.send(inputToString);
  };

  return (
    <ImageBackground
      source={background}
      style={styles.background}
      imageStyle={{
        resizeMode: "stretch",
        opacity: 0,
      }}
    >

<View style={{top:20,right:15,position:'absolute',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
  <View className="driving-mode" style={{
      flexDirection:'row',
  }}>
    <View style={{}}>
      <Text style={{color:"#d3d3d3",fontFamily:'Exo',fontSize:20}}>Eco</Text>
    </View>
    <View style={{marginLeft:10}}>
      <Text style={{color:"#d3d3d3",fontFamily:'Exo',fontSize:20}}>Normal</Text>
    </View>
    <View style={{marginLeft:10}}> 
      <Text style={{color:"#d3d3d3",fontFamily:'Exo',fontSize:20}}>Sport</Text>
    </View>
  </View>
  <TouchableOpacity onPress={() => changeModalVisible(true)} style={{marginLeft:40}}>
      <Image style={styles.carside} source={carside}>
      </Image>
  </TouchableOpacity>
</View>
      <Modal visible={modalOpen}>
        <View style={styles.innerModal}>
          <View
            style={{ position: "absolute", left: 20, top: 20, color: "white" }}
          ></View>
          {/* <View style={{flexDirection:'row'}}>
          <TextInput style={styles.textInput} ref={inputref}></TextInput>
          <Button title='Kirim' onPress={handleSubmit}/>
          </View> */}

          <Text
            style={{
              color: "white",
              position: "absolute",
              fontSize: 25,
              top: 20,
              left: 20,
              fontFamily: "Exo",
            }}
          >
            {carControlStatus}
          </Text>
          <FontAwesome
            onPress={() => setModal(false)}
            name="close"
            size={54}
            color="#3dacbd"
            style={{ position: "absolute", top: 20, right: 20 }}
          />
          <Text style={{ color: "white" }}>{message}</Text>
          {/* <Image source={CarSide} style={{height:290,width:750}}>
          </Image> */}
          <TouchableOpacity
            style={{ left: 310, position: "absolute" }}
            onPress={handleLamp}
          >
            <Image
              source={lampudepan}
              style={{ height: 50, width: 100, opacity: opacityLamp }}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ left: 500, top: 145, position: "absolute" }}
            onPress={handleFrontDoor}
          >
            <Image
              source={pintudepan}
              style={{ height: 210, width: 202, opacity: opacityFDoor }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ left: 680, top: 143, position: "absolute" }}
            onPress={handleBackDoor}>
            <Image
              source={pintubelakang}
              style={{ height: 210, width: 202, opacity: opacityBDoor }}
            />
          </TouchableOpacity>

          {/* <View className="lampuMenyala" style={{backgroundColor:"yellow",height:70,width:50,position:'absolute',right:300,top:268,zIndex:-10}}>
          
          </View> */}
          {/* <Image source={sorotLampu} style={{height:80,width:120,position:'absolute',right:190,top:245,tintColor:'yellow',zIndex:-10}}></Image> */}
        </View>
      </Modal>
      <Modal style={{ width: 250, height: 300,}} visible={PopUpStatus == false ? "hidden" : true}>
        <View style={styles.popUp}>
          <Text style={styles.popUpTitle}>This Is Pop Up</Text>
        </View>
      </Modal>



      <View style={styles.newbingkai}>
      <WebView
      style={{height:10,width:300,marginLeft:50}}
      originWhitelist={['*']}
      source={{  uri: 'https://www.waze.com/live-map'  }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsFullscreenVideo={true}
      allowsInlineMediaPlayback={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      thirdPartyCookiesEnabled={true}
    />
      </View>

      <View
        style={{
          width: 700,
          height: 700,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      > 
        
        {/* <Image
          source={BingkaiSpedo}
          style={{
            position: "absolute",
            height: 650,
            width: 700,
            top: 75,
            zIndex: 90,
          }}
        ></Image> */}
    
        <Image source={gambarSpedo} style={[styles.images, tintColour]}></Image>
        <View style={{ position: "absolute", flexDirection: "row", top: 270 }}>
          <TouchableOpacity onPress={() => alert("Hello World")}>
            <Entypo
              name="arrow-bold-left"
              size={60}
              color={BlinkKiri ? "yellow" : "#17292C"}
              style={{ paddingRight: 120, visibility: "hidden" }}
            />
          </TouchableOpacity>
          <Entypo
            name="arrow-bold-right"
            size={60}
            color={BlinkKanan ? "yellow" : "#17292C"}
          />
        </View>

        <View style={styles.digitalspeed}>
          {/* <MaterialCommunityIcons name="speedometer" size={24} color="white" /> */}
          <Text style={{ color: "#d3d3d3", fontSize: 30, fontFamily: "Exo" }}>
            KM/H
          </Text>
        </View>
        <LinearGradient
          colors={["red", "orange"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={[styles.circle, transform]}
        ></LinearGradient>

      </View>
      
      
      <Image source={centercircle} style={styles.bulat}></Image>
      {/* <Image source={Bingkai} style={styles.bingkai}></Image> */}
      <View style={styles.vehicleStatus}>
        <Text style={{ color: "white" }}>Status Of Vehicle</Text>
      </View>
      <View style={styles.newbingkaikanan}>
        <View style={{alignItems:'center'}} className="inner">
      <Text style={{color:'white',top:20,position:'absolute',left:70,fontFamily:"Exo",fontSize:18}}>
          Drive Info.
      </Text>
      <View style={{flexDirection:"row",justifyContent:'center',alignItems:'center',marginTop:70}}>
      <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.infobadge}
        >
          <Text style={{color:'white',fontFamily:'Exo',fontSize:25}}>954</Text>
          <Text style={{color:'white',fontFamily:'Exo',fontSize:15}}>min</Text>
          <Ionicons name="time-outline" size={30} color="#B6B6B6" />
        </LinearGradient>
        <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.infobadge}
        >
          <Text style={{color:'white',fontFamily:'Exo',fontSize:25}}>1242</Text>
          <Text style={{color:'white',fontFamily:'Exo',fontSize:15}}>KM</Text>
          <MaterialCommunityIcons name="road-variant" size={30} color="#B6B6B6" />
        </LinearGradient>
        <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.infobadge}
        >
          <Text style={{color:'white',fontFamily:'Exo',fontSize:25}}>76</Text>
          <Text style={{color:'white',fontFamily:'Exo',fontSize:15}}>KM</Text>
          <MaterialIcons name="electrical-services" size={24} color="#B6B6B6" />
        </LinearGradient>
      </View> 
      <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{
            width:'66%',
            borderRadius:10,
            height:'35%',
            marginTop:15,
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row',
          }}
        >
            <Text style={{fontFamily:'Exo',color:'white',position:'absolute',top:5,}}>Battery Info</Text>
          <Text style={{fontFamily:'Exo',color:'white',fontSize:30,marginRight:10}}>60%</Text>
    
     <Animated.View style={{
  height: 40,
  width: 100,
  borderWidth: 1,
  borderColor: 'white',
  borderRadius:10,
  overflow: 'hidden',
}}>

  <Animated.View style={{
    height: batteryLevel.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    }),
    width: '99%',
    backgroundColor: '#3dacbd',
  }} />
</Animated.View>

</LinearGradient>

</View>

      </View>
      <View
        style={{
          position: "absolute",
          left: 120,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View></View>
        {/* <TouchableOpacity onPress={() => changeModalVisible(true)}>
          <Image
            source={gambarMobil}
            style={{ height: 200, width: 100 }}
          ></Image>
        </TouchableOpacity>
        */}
      </View>
      <View style={{bottom:15,position:'absolute',flexDirection:'row',right:55}}>
      <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginLeft:20,paddingVertical:10, paddingHorizontal:20,borderRadius:10}}
        >
          <MaterialCommunityIcons name="engine" size={40} color="#d3d3d3" />
          <MaterialCommunityIcons
            name="car-brake-hold"
            size={40}
            color="#d3d3d3"
            style={{marginLeft:20}}
          />
          <MaterialCommunityIcons
            name="car-light-dimmed"
            size={40}
            color={opacityLamp == 100 ? "yellow" : "#d3d3d3"}
            style={{marginLeft:20}}
          />
          <MaterialCommunityIcons
            name="air-conditioner"
            size={40}
            color="#d3d3d3"
            style={{marginLeft:20}}
          />
          </LinearGradient>
        </View>
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
             <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{justifyContent:'center',alignItems:'center',marginLeft:20,paddingVertical:5, paddingHorizontal:10,borderRadius:10}}
        >
          <Text
            style={{
              color: "#d3d3d3",
              fontSize: 22,
              fontFamily: "Exo",
            
            }}
          >
            {currentDate}
          </Text>
          </LinearGradient>
          <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{justifyContent:'center',alignItems:'center',marginLeft:20,paddingVertical:5, paddingHorizontal:10,borderRadius:10}}
        >
          <Text
            style={{
              color: "#d3d3d3",
              fontSize: 22,
              fontFamily: "Exo",
            }}
          >
            {`${parseInt(temp)}°c`}
          </Text>
          </LinearGradient>
        
      </View>
      <View
        style={{
          position: "absolute",
          bottom:15,
          left: 10,
          flexDirection: "row",
          zIndex: 99,
        }}
      >
       <LinearGradient
          colors={[ "#1D1D1D","#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{justifyContent:'center',alignItems:'center',marginLeft:20,paddingVertical:5, paddingHorizontal:10,borderRadius:10}}
        >
          <Text style={{color:'#d3d3d3',fontFamily:'Exo',fontSize:20}}>
            Rabu , 25 Januari 2023
          </Text>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#041119",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  digitalspeed: {
    height: 50,
    flexDirection: "row",
    borderRadius: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    //  borderWidth:1,
    //  borderColor:'white',
    position: "absolute",
  },
  vehicleStatus: {
    flex: 1,
    alignSelf: "flex-start",
    color: "white",
  },
  batteryStatus: {
    color: "white",
  },
  circle: {
    height: 10,
    marginTop: 120,
    width: 230,
    backgroundColor: "red",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  images: {
    width: 700,
    height: 700,
    position: "absolute",
  },
  bulat: {
    position: "absolute",
    height: 60,
    borderRadius: 100,
    top: 300,
    width: 60,
  },
  bingkai: {
    position: "absolute",
    height: 310,
    width: 500,
    left: -130,
  },
  innerModal: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#020D2B",
  },
  textInput: {
    backgroundColor: "white",
    width: 500,
    height: 50,
  },
  popUp: {
    backgroundColor: "#020D2B",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  popUpTitle: {
    color: "white",
    fontFamily: "Exo",
    fontSize: 50,
  },
  newbingkai: {
     width:400,
     height:350,
     left:-15,
     borderStyle:"solid",
     position:'absolute',
     borderColor:'#535353',
     borderBottomWidth:4,
     borderTopWidth:4,
     borderTopRightRadius:50,
     borderTopLeftRadius:50,
     borderBottomRightRadius:50,
     borderBottomLeftRadius:50,
    },
    newbingkaikanan: {
      width:400,
      height:350,
      right:-15,
      borderStyle:"solid",
      position:'absolute',
      borderColor:'#535353',
      // borderRadius:200,
      borderBottomWidth:4,
      borderTopWidth:4,
      borderTopRightRadius:50,
      borderTopLeftRadius:10,
      borderBottomRightRadius:50,
      borderBottomLeftRadius:50,
     },
     infobadge:{
      width:80,
      borderRadius:10,
      height:120,
      marginLeft:10,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'white',

     },
     carside: {
      height:55,
      width:130,
      tintColor:'#A6A6A6'
     },
     batteryContainer: {
      width: 50,
      height: 100,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
  },
  batteryOutline: {
      width: 40,
      height: 80,
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 5,
  },
  batteryFill: {
      backgroundColor: 'green',
      borderRadius: 5,
  },
});

export default App;
