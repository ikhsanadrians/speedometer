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
} from "react-native";
import * as Battery from "expo-battery";
import { Modal } from "react-native";
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
// import * as Permissions from 'expo-permissions';
import Device from "expo-device";
import * as Notifications from "expo-notifications";
import ws from "ws";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

// state = {
//   batteryLevel: null,
// };

// await Notifications.getPermissionsAsync();

const App: () => Node = () => {
  const [seconds, setSeconds] = useState(0);
  const [dateState, setDateState] = useState("");
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
    const timeInterval = setInterval(() => {
      setDateState(new Date().toLocaleTimeString());
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
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
    tintColor: "#3dacbd",
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
        opacity: 0.5,
      }}
    >
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

      <Image
        source={logointek}
        style={{
          height: 45,
          width: 200,
          position: "absolute",
          top: 20,
          right: 25,
        }}
      ></Image>

      <View
        style={{
          width: 700,
          height: 700,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={BingkaiSpedo}
          style={{
            position: "absolute",
            height: 650,
            width: 700,
            top: 75,
            zIndex: 90,
          }}
        ></Image>
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
          <Text style={{ color: "#3dacbd", fontSize: 30, fontFamily: "Exo" }}>
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

        {/* <View style={[styles.circle,transform]}>
     </View> */}

        {/* <View style={{width:60,height:60,borderRadius:100,backgroundColor:'#05aca0',marginTop:290,position:'absolute'}}></View> */}
      </View>
      <Image source={centercircle} style={styles.bulat}></Image>
      <Image source={Bingkai} style={styles.bingkai}></Image>
      <View style={styles.vehicleStatus}>
        <Text style={{ color: "white" }}>Status Of Vehicle</Text>
      </View>
      <Image
        source={Bingkai}
        style={{
          right: -130,
          position: "absolute",
          height: 310,
          width: 500,
          transform: [{ scaleX: -1 }],
        }}
      ></Image>
      <View style={{ position: "absolute", right: 70, alignItems: "center" }}>
        <Text
          style={{
            color: "#3dacbd",
            fontSize: 50,
            top: -70,
            right: 25,
            position: "absolute",
            fontFamily: "Exo",
          }}
        >
          64%
        </Text>
        <View
          style={{
            position: "absolute",
            right: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Fontisto name="battery-half" size={60} color="#3dacbd" />
          <Text
            style={{
              color: "#3dacbd",
              fontFamily: "Exo",
              marginLeft: 10,
              fontSize: 25,
            }}
          >
            345 Km
          </Text>
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
        <TouchableOpacity onPress={() => changeModalVisible(true)}>
          <Image
            source={gambarMobil}
            style={{ height: 200, width: 100 }}
          ></Image>
        </TouchableOpacity>
        <View>
          <MaterialCommunityIcons name="engine" size={40} color="#3dacbd" />
          <MaterialCommunityIcons
            name="car-brake-hold"
            size={40}
            color="#3dacbd"
          />
          <MaterialCommunityIcons
            name="car-light-dimmed"
            size={40}
            color={opacityLamp == 100 ? "yellow" : "#3dacbd"}
          />
          <MaterialCommunityIcons
            name="air-conditioner"
            size={40}
            color="#3dacbd"
          />
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1F2946",
            width: 160,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
          }}
        >
          <Ionicons name="md-time-sharp" size={25} color="#3dacbd" />
          <Text
            style={{
              color: "#3dacbd",
              fontSize: 22,
              fontFamily: "Exo",
              marginLeft: 5,
            }}
          >
            {dateState}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 40,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            backgroundColor: "#1F2946",
          }}
        >
          <FontAwesome5 name="temperature-high" size={25} color="#3dacbd" />
          <Text
            style={{
              color: "#3dacbd",
              paddingLeft: 10,
              fontSize: 22,
              fontFamily: "Exo",
            }}
          >
            27°C
          </Text>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          flexDirection: "row",
          zIndex: 99,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 0,
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 10,
            backgroundColor: "#1F2946",
          }}
        >
          <FontAwesome5 name="road" size={25} color="#3dacbd" />
          <Text
            style={{
              color: "#3dacbd",
              fontSize: 20,
              fontFamily: "Exo",
              paddingLeft: 10,
            }}
          >
            2,400 km
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 30,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            backgroundColor: "#1F2946",
          }}
        >
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={25}
            color="#3dacbd"
          />
          <Text
            style={{
              color: "#3dacbd",
              paddingLeft: 10,
              fontSize: 20,
              fontFamily: "Exo",
            }}
          >
            0.0 km
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#020D2B",
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
});

export default App;
