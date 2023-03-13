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
  ScrollView,
  Animated,
  Easing,
  LayoutAnimation,
} from "react-native";
// import axios from 'react-native-axios';
import { Picker } from "@react-native-picker/picker";
import { WebView } from 'react-native-webview';
import moment from 'moment';
import * as Battery from "expo-battery";
import { Modal, Linking } from "react-native";
import { Node, useState, useEffect, useRef } from "react";
import gambarSpedo from "./assets/spedometer.png";
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
import carsp from "./assets/carControl/avanza.png";
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
// import tire from "./assets/tire.png";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Table, Row, Rows } from 'react-native-table-component';




Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});


//setup mp3 player


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
  const [speeds, setSpeeds] = useState("");
  const inputref = useRef(null);
  const [PopUpStatus, setPopUpStatus] = useState(false);
  const [wsRange, setWsRange] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [longitude, setLongitude] = useState('');
  const [statebatre, setstatebatre] = useState(0);
  const [latidute, setLatidute] = useState('');
  const [seinStatus, setSeinStatus] = useState(0);
  const [temp, setTemp] = useState('');
  const [carMode, setCarMode] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [statusAc, setStatusAc] = useState(false);
  const [wsUrl, setWsURl] = useState('');
  const [asyncWs, setAsyncWs] = useState('');
  const [selectedValue, setSelectedValue] = useState("item1");
  const [frontLamp, setFrontLamp] = useState(false);
  const [sound, setSound] = useState();
  const [statsModalOpen,setStatsModalOpen] = useState();
  const eco = useRef(1);
  const normal = useRef(2);
  const sport = useRef(3);

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



  // try {
  //   console.log(`latidute : ${latidute} , longitude : ${longitude}, suhu: ${temp}` ); 
  // } catch {
  //   console.log("tunggu,sedang fetch lokasi");
  // }

  // useEffect(()=>{
  //   const apiKey = "74891133a9af1c283f0c9f3a9a6a18c7";
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${latidute}&lon=${longitude}&appid=${apiKey}&units=metric`
  //   ).then(response => response.json())
  //   .then(data=>{
  //     try{
  //       setTemp(data.main.temp);
  //     } catch {
  //       console.log('wait');
  //     }
  //   })
  //   .catch(error=>console.log(error))
  // })





  useEffect(() => {
    const ws = new WebSocket('ws://192.168.0.103/ws');
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      let parsedData = parseInt(event.data);
      let strParsedData = parsedData.toString();

      switch (strParsedData[0]) {
        case "1":
          setTemp(strParsedData.slice(1))
          break;
        case "4":
          setSpeeds(strParsedData.slice(1));
          break;
        case "6":
          setstatebatre(strParsedData.slice(1))
          break;
        case "8":
          if (strParsedData.slice(1) == "0") {
            setPopUpStatus(true)
          } else {
            setPopUpStatus(false)
          }
          break;
        case "5":
          if (strParsedData.slice(1) == "1") {
            setSeinStatus(1)
          } else if (strParsedData.slice(1) == "2") {
            setSeinStatus(2)
          } else {
            setSeinStatus(3)
          }
          break;
        case "9":
          if (strParsedData.slice(1) == "1") {
            setStatusAc(true);
          } else if (strParsedData.slice(1) == "0") {
            setStatusAc(false);
          } else if (strParsedData.slice(1) == "2") {
            setFrontLamp(true);
          } else if (strParsedData.slice(1) == "3") {
            setFrontLamp(false);
          }
          break;
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
    setInterval(function () {
      let date = moment().utcOffset('+07:00').format(' HH:mm');
      setCurrentDate(date);
    }, 1000);
  }, []);


  useEffect(() => {
    return sound ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    }
      : undefined;
  }, [sound]);
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
      { rotate: !speeds ? "0deg" : `${speeds}deg` },
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


  // let rotateValueHolder = new Animated.Value(isOpen ? 1 : 0);

  // const startTireRotateFunction = () => {
  //   rotateValueHolder.setValue(0)

  //   Animated.timing(rotateValueHolder,{
  //     toValue:1,
  //     duration:1000,
  //     easing:Easing.linear,
  //     useNativeDriver:true
  //   }).start(()=>startTireRotateFunction())
  // }

  // // startTireRotateFunction()

  // const RotateData = rotateValueHolder.interpolate({
  //   inputRange: [0,1],
  //   outputRange: ['0deg','360deg']
  // })




  const handleSideCarBtn = () => {
    setModal(true)
    setIsOpen(!isOpen)
  }

  const handleUrlWsText = (textInput) => {
    const regex = /^/;
    const newText = textInput.replace(regex, "ws://");
    setWsURl(newText);
  }

  const handleButtonSetting = async () => {
    let wsval = wsUrl;
    try {
      await AsyncStorage.setItem("ws_url", wsval);
    } catch (error) {
      console.error(error);
    }
  }


  let battery = statebatre.toString();
  let batteryHasil = `${battery}%`;

  const soundObject = new Audio.Sound();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/music/up.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }


  const tableHead = ['No', 'Value','No','Value'];
  const tableData = [
    ['1', '30', '40','43'],
    ['2', '25', '41','43'],
    ['3', '45', '42','43'],
    ['4', '45', '43','43'],
    ['5', '45', '44','43'],
    ['6', '45', '45','43'],
    ['7', '45', '46','43'],
    ['8', '45', '47','43'],
    ['9', '45', '48','43'],
    ['10', '45','49','43'],
    ['11', '45','50','43'],
    ['12', '45','51','43'],
    ['13', '45','52','43'],
    ['14', '45','53','43'],
    ['15', '45','54','43'],
    ['16', '45','55','43'],
    ['17', '45','56','43'],
    ['18', '45','57','43'],
    ['19', '45','58','43'],
    ['20', '45','59','43'],
    ['21', '45','60','43'],
    ['22', '45','61','43'],
    ['23', '45','62','43'],
    ['24', '45','63','43'],
    ['25', '45','64','43'],
    ['26', '45','65','43'],
    ['27', '45','66','43'],
    ['28', '45','67','43'],
    ['29', '45','68','43'],
    ['30', '45','69','43'],
    ['31', '45','70','43'],
    ['32', '45','71','43'],
    ['33', '45','72','43'],
    ['34', '45','73','43'],
    ['35', '45','74','43'],
    ['36', '45','75','43'],
    ['37', '45','77','43'],
    ['38', '45','78','43'],
    ['39', '45','79','43'],
  ];
  


  return (
    <ImageBackground
      source={background}
      style={styles.background}
      imageStyle={{
        resizeMode: "stretch",
        opacity: 0,
      }}
    >
      <View style={styles.bingkaiAtas}>

      </View>

      <View style={{ top: 20, right: 15, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View className="driving-mode" style={{
          flexDirection: 'row',
        }}>
          <View ref={eco} className="1" style={{ paddingHorizontal: 5, borderRadius: 3, backgroundColor: carMode == 1 ? 'red' : '#041119' }}>
            <Text style={{ color: "#d3d3d3", fontFamily: 'Exo', fontSize: 20 }}>Eco</Text>
          </View>
          <View ref={normal} className="2" style={{ marginLeft: 10, backgroundColor: carMode == '1' ? 'red' : '#041119', paddingHorizontal: 5, borderRadius: 3 }}>
            <Text style={{ color: "#d3d3d3", fontFamily: 'Exo', fontSize: 20 }}>Normal</Text>
          </View>
          <View ref={sport} className="3" style={{ marginLeft: 10, backgroundColor: '#041119', paddingHorizontal: 5, borderRadius: 3 }}>
            <Text style={{ color: "#d3d3d3", fontFamily: 'Exo', fontSize: 20 }}>Sport</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => changeModalVisible(true)} style={{ marginLeft: 40 }}>
          <Image style={styles.carside} source={carsp}>
          </Image>
          {/* <Animated.Image style={{height:28,width:28,position:'absolute',top:30,right:16,transform:[{rotate:RotateData}]}} source={tire}></Animated.Image>
      <Animated.Image style={{height:28,width:28,position:'absolute',top:30,right:104,transform:[{rotate:RotateData}]}} source={tire}></Animated.Image> */}
        </TouchableOpacity>
      </View>
      <Modal visible={modalOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.modalcltittle}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Ionicons name="md-arrow-back" size={40} color="white" />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 21, marginLeft: 10 }}>Settings</Text>
          </View>
          <View style={styles.modalcontent}>
            <TextInput placeholder="Masukan URL Websocket" value={wsUrl} placeholderTextColor={'white'} style={styles.urlwsinput} onChangeText={handleUrlWsText}></TextInput>
            <Picker placeholderTextColor={"white"}
              style={styles.pickerCar}
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="Pilih Icon Mobil" color="white" style={{ backgroundColor: '#1F4277' }} />
              <Picker.Item label="Avanza" value="Avanza" color="white" style={{ backgroundColor: '#1F4277' }} />
              <Picker.Item label="Toyota Starlet" color="white" value="Toyota Corolla" style={{ backgroundColor: '#1F4277' }} />
            </Picker>
            <TouchableOpacity onPress={handleButtonSetting}>
              <View style={{ backgroundColor: '#28384F', marginTop: 20, padding: 20, marginHorizontal: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Update</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal style={{ width: 250, height: 300, }} visible={PopUpStatus == false ? "hidden" : true}>
        <View style={styles.popUp}>
          <Text style={styles.popUpTitle}>This Is Pop Up</Text>
        </View>
      </Modal>
      <Modal visible={statsModalOpen}>
        <View style={styles.modalContainer}>
          <View style={{width:'100%',padding:20}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <Text style={{color:'white',fontFamily:'Exo',fontSize:25}}>Statistic</Text>
           <TouchableOpacity onPress={()=>setStatsModalOpen(false)}>
           <Ionicons name="close" color="white" size={35}></Ionicons>
            </TouchableOpacity> 
          </View>
          <ScrollView style={{marginBottom:40}}>
          
          <Table borderStyle={styles.border}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
          </Table>
          </ScrollView>
          </View>
        </View>
      </Modal>


      <View style={styles.newbingkai}>
        {/* <WebView
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
    /> */}
        {/* <Button onPress={playSound} title="play"></Button> */}
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
              color={seinStatus == 1 ? "yellow" : "#17292C"}
              style={{ paddingRight: 120, visibility: "hidden" }}
            />
          </TouchableOpacity>
          <Entypo
            name="arrow-bold-right"
            size={60}
            color={seinStatus == 2 ? "yellow" : "#17292C"}
          />
        </View>

        <TouchableOpacity onPress={()=>setStatsModalOpen(true)} style={{position:"absolute",bottom:100,flexDirection:'row',alignItems:'center'}}>
          <Ionicons name="stats-chart" color="white" size={20}></Ionicons>
          <Text style={{color:'white',fontFamily:'Exo',marginLeft:4,fontSize:20}}>Stats</Text>
        </TouchableOpacity>

        <View style={styles.digitalspeed}>
          {/* <MaterialCommunityIcons name="speedometer" size={24} color="white" /> */}
          <Text style={{ color: "#d3d3d3", fontSize: 30, fontFamily: "Exo" }}>
            KM/H
          </Text>
        </View>
        <Animated.View
          style={[styles.circle, transform]}
        ></Animated.View>
      </View>


      <Image source={centercircle} style={styles.bulat}></Image>
      {/* <Image source={Bingkai} style={styles.bingkai}></Image> */}
      <View style={styles.vehicleStatus}>
        <Text style={{ color: "white" }}>Status Of Vehicle</Text>
      </View>
      <View style={styles.newbingkaikanan}>
        <View style={{ alignItems: 'center' }} className="inner">
          <Text style={{ color: 'white', position: 'absolute', left: 155, top: 20, fontFamily: "Exo", fontSize: 18 }}>
            Drive Info.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 70 }}>
            <LinearGradient
              colors={["#1D1D1D", "#303030"]}
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
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 25 }}>954</Text>
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 15 }}>min</Text>
              <Ionicons name="time-outline" size={30} color="#B6B6B6" />
            </LinearGradient>
            <LinearGradient
              colors={["#1D1D1D", "#303030"]}
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
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 25 }}>1242</Text>
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 15 }}>KM</Text>
              <MaterialCommunityIcons name="road-variant" size={30} color="#B6B6B6" />
            </LinearGradient>
            <LinearGradient
              colors={["#1D1D1D", "#303030"]}
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
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 25 }}>76</Text>
              <Text style={{ color: 'white', fontFamily: 'Exo', fontSize: 15 }}>KM</Text>
              <MaterialIcons name="electrical-services" size={24} color="#B6B6B6" />
            </LinearGradient>
          </View>
          <LinearGradient
            colors={["#1D1D1D", "#303030"]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={{
              width: '66%',
              borderRadius: 10,
              height: '35%',
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontFamily: 'Exo', color: 'white', position: 'absolute', top: 5, }}>Battery Info</Text>
            <Text style={{ fontFamily: 'Exo', color: 'white', fontSize: 30, marginRight: 10 }}>{statebatre} %</Text>

            <Animated.View style={{
              height: 40,
              width: 100,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}>

              <Animated.View style={{
                height: batteryLevel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
                width: batteryHasil,
                backgroundColor: '#3dacbd',
              }} />
            </Animated.View>
            <View style={styles.batrecorner}>

            </View>

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
      <View style={{ bottom: 15, position: 'absolute', flexDirection: 'row', right: 55 }}>
        <LinearGradient
          colors={["#1D1D1D", "#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}
        >
          <MaterialCommunityIcons name="engine" size={40} color="#d3d3d3" />
          <MaterialCommunityIcons
            name="car-brake-hold"
            size={40}
            color="#d3d3d3"
            style={{ marginLeft: 20 }}
          />
          <MaterialCommunityIcons
            name="car-light-dimmed"
            size={40}
            color={frontLamp == false ? "#d3d3d3" : "#FCDF3B"}
            style={{ marginLeft: 20 }}
          />
          <MaterialCommunityIcons
            name="air-conditioner"
            size={40}
            color={statusAc == false ? "#d3d3d3" : "#FCDF3B"}
            style={{ marginLeft: 20 }}
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
          colors={["#1D1D1D", "#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 20, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}
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
          colors={["#1D1D1D", "#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 20, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}
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
          bottom: 15,
          left: 10,
          flexDirection: "row",
          zIndex: 99,
        }}
      >
        <LinearGradient
          colors={["#1D1D1D", "#303030"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 20, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}
        >
          <Text style={{ color: '#d3d3d3', fontFamily: 'Exo', fontSize: 20 }}>
            Rabu , 1 Februari 2023
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
  // modalContainer:{
  //   width:'100%',
  //   height:'100%',
  //   backgroundColor: "#041119",
  // },
  circle: {
    height: 10,
    marginTop: 120,
    width: 230,
    backgroundColor: "red",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  images: {
    width: 670,
    height: 670,
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
    width: 400,
    height: 350,
    left: -15,
    borderStyle: "solid",
    position: 'absolute',
    borderColor: '#535353',
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  newbingkaikanan: {
    width: 400,
    height: 350,
    right: -15,
    borderStyle: "solid",
    position: 'absolute',
    borderColor: '#535353',
    // borderRadius:200,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  infobadge: {
    width: 80,
    borderRadius: 10,
    height: 120,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

  },
  carside: {
    height: 60,
    width: 150,
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
  batrecorner: {
    width: 10,
    height: 15,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: 'white',
  },
  wsurl: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
  },
  modalcltittle: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#202942',
  },
  modalContainer: {
    backgroundColor: "#020D2B",
    flex: 1,
  },
  modalcontent: {
    paddingTop: 20,
    backgroundColor: "#020D2B",
  },
  urlwsinput: {
    backgroundColor: '#1F4277',
    color: '#FFFFFF',
    marginHorizontal: 20,
    fontFamily: 'Exo',
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
  },
  pickerCar: {
    backgroundColor: '#1F4277',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  updateSetting: {
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  bingkaiAtas: {
    width: 630,
    height: 550,
    right: 350,
    borderStyle: "solid",
    position: 'absolute',
    borderColor: '#535353',
    borderBottomWidth: 2,
    borderTopWidth: 4,
    borderWidth: 3,
    borderTopRightRadius: 300,
    borderTopLeftRadius: 300,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#273542' },
  text: { margin: 6 , color:'white'},
  border: { borderWidth: 1, borderColor: '#ccc',marginBottom:50},
});

export default App;