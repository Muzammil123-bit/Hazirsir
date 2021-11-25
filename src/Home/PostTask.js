import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator,
  ImageBackground,
  Picker,
  Alert,
  Button,
  ToastAndroid
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
navigator.geolocation = require('@react-native-community/geolocation');
import GetLocation from 'react-native-get-location'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { FlatGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-community/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-tiny-toast'
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import  MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion} from 'react-native-maps';

import ImageResizer from 'react-native-image-resizer';
import EarnMoney from './EarnMoney';
const audioRecorderPlayer = new AudioRecorderPlayer();
class PostTask extends Component {
  // private audioRecorderPlayer: AudioRecorderPlayer;
  constructor(props) {
    
    super(props);
    this.state = {
      uid:'',
      tdesc:'',
      title:'',
      todaydate: new Date(),
      date: new Date(),
      budget:"",
      tasker:'1',
      skills:[],
      width3rd:'',
      widthHalf:'',
      selectedSkill:'',
      modalVisible1:false,
      modalVisible2:false,
      modalVisible3:false,
      placesModal:false,
      selected1:true,
      selected2:false,
      selected3:false,
      selected4:false,
      physical:true,
      online:false,
      place:'',
      lat: '',
      long: '',
      // clat:33.626057,
      // clong:73.071442,
  
      latitude:31.5204,
      longitude:74.3587,
      imgs:[],
      vids:[],
      image:'',
      imgStat:'no',
      audStat:'no',
      vidStat:'no',
      audiofile:'',
      rec:false,
      playingRec:false,
      loadingModal:false,
      timeofday:'',
      shortrec:false,
      showButton: true,
      coordinate: new AnimatedRegion({
          // latitude: 37.78825,
          // longitude: -122.4324
          latitude1: null,
          longitude1: null,

          latitude:31.5204,
          longitude:74.3587,
        
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      }),
      width:Math.round(Dimensions.get('window').width),
      height:Math.round(Dimensions.get('window').height),
      general:true,
      pro:false
    };
  }
  async componentDidMount(){
    
    await this.location_get();
    const value = await AsyncStorage.getItem('userID')
    this.setState({uid:value})
    var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    console.warn("jjjjjj "+date);
    this.setState({date:date})
    const screenWidth = Math.round(Dimensions.get('window').width);
    await this.setState({width3rd:Math.round(screenWidth/3), widthHalf:Math.round(screenWidth/2)})
    await this.sendToServer();
    await this.getAudioPermissions();
  }


  
  async gotocurrent(){
  
        let r = {
            latitude: Number(this.state.clat),
            longitude: Number(this.state.clong),
            latitudeDelta: 0.03,
            longitudeDelta: 0.01,
        };
        this._map.animateToRegion(r, 1500);
        this.animate(r);
    // }
};


async gotocurrent(){
  // if (this._mapView.current) {
      let r = {
          latitude: Number(this.state.clat),
          longitude: Number(this.state.clong),
          latitudeDelta: 0.03,
          longitudeDelta: 0.01,
      };
      this._map.animateToRegion(r, 1500);
      this.animate(r);
  // }
};





showloc(){
    console.log(this.state.longitude+'<-long,lat->'+this.state.latitude);
    // this.getLocationDetails(this.state.latitude, this.state.longitude)
    this.setState({modalVisible:false});
    
}
location_get(){
    console.log('get location');
        navigator.geolocation.getCurrentPosition(
        async position => {
        console.log("Position===>", position);
        // alert("Position===>"+JSON.stringify( position));
        await this.setState({
            lat:position.coords.latitude,
            clat:position.coords.latitude,
            long:position.coords.longitude,
            clong:position.coords.longitude,
            coordinate: position.coords
        });
        console.log(this.state.long+'<-long,lat->'+this.state.lat)
        // alert(coordinate);
    },
      error => Alert.alert(error.message),
      // { enableHighAccuracy: true, timeout: 10000}
    );
};
gotoLiveLocation = () => {
    let tempCoords = {
      latitude: Number(this.state.currentlatitude),
      longitude: Number(this.state.currentlongitute)
    };
    this.setState({
      lat: this.state.currentlatitude,
      long: this.state.currentlongitute,

      latitude: this.state.currentlatitude,
      longitude: this.state.currentlongitute
    });

    this._map.animateToCoordinate(tempCoords, 1);
};





gotoLiveLocation_btn =async () => {
  await this.location_get()
    let tempCoords = {
      latitude: Number(this.state.lat),
      longitude: Number(this.state.long)
    };
    this.setState({
      latitude: this.state.lat,
      longitude: this.state.long
    });
    this.animate(tempCoords);
};
async animate(data) {
    const { coordinate } = this.state;

    await this.setState({
      lat: data.latitude,
      long: data.longitude
    });
    console.log(this.state.lat);
    console.log(this.state.long)
    const newCoordinate = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    this.getLocationDetails(this.state.lat, this.state.long)
    if (Platform.OS === "android") {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
}

getLocationDetails(latitude, longitude) {
  return new Promise(function(resolve, rejcet) {
    url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      latitude +
      "," +
      longitude +
      "&key=AIzaSyCZS7yiqoySRYGcXVS_CRABTBP8WQoCehY";
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        console.log("Location Details==>", responseJson);
        console.log(
          "Location Details==>",
          responseJson.results[0].formatted_address
        );
        this.setState({place:responseJson.results[0].formatted_address})
        resolve(responseJson.results[0].formatted_address);
        return responseJson.results[0].formatted_address;
        // location = responseJson;
        // location.results[0].address_components.forEach(component => {
        //   if (component.types.indexOf('country') !== -1) {
        // this.setState({ country: component.long_name });
        //   }
        // });
      })
      .catch(err => {
        console.log("Location Details==>", err);
        reject("error");
        return "error";
      });
  }.bind(this));
}

  async sendToServer(){
      // console.log(uid)
      const url='https://www.hazirsir.com/web_service/read_skill.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
      await fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              z: [this.state.uid],
          })
      })
          .then((response) => response.json())
          .then(async (responseJson) => {
              // Showing response message coming from server after inserting records.
              // resolve(responseJson);
              console.log(responseJson.data);
              // if(responseJson!=='Wrong Credentials!'){
                //  OLD CODE
              //  await this.setState({skills:responseJson[0], skills2:responseJson[1]})
                await this.setState({skills: responseJson[2]})
              // }
              return responseJson;
          })
          .catch((error) => {
              // reject(error);
              console.log(error);
  
              return error;
      });
  }
  async selectSkill(id, stat){
    // await AsyncStorage.setItem('Verified', stat)
    // if(stat==='false'){
    //   this.props.navigation.navigate('Cnic')
    // }else if(stat==='checking'){
    //   ToastAndroid.show('Your verification process has not been completed yet.', ToastAndroid.SHORT)
    // }else if(stat==='true'){
      await AsyncStorage.setItem('SkillPost', id)
      this.setState({modalVisible1:true, selectedSkill:id}) 
    // }
  }
  textSelected(){
    !this.state.selected1?this.setState({selected1:!this.state.selected1,
      selected2:false,
      selected3:false,
      selected4:false}):null
  }
  photoSelected(){
    !this.state.selected2?this.setState({selected2:!this.state.selected2,
      selected1:false,
      selected3:false,
      selected4:false}):null
  }
  videoSelected(){
    !this.state.selected3?this.setState({selected3:!this.state.selected3,
      selected1:false,
      selected2:false,
      selected4:false}):null
  }
  audioSelected(){
    !this.state.selected4?this.setState({selected4:!this.state.selected4,
      selected1:false,
      selected2:false,
      selected3:false}):null
  }
  physicalSelected(){
    !this.state.physical?this.setState({physical:!this.state.physical, online:false, place:''}):null
  }
  onlineSelected(){
    !this.state.online?this.setState({online:!this.state.online, physical:false, place:'Online/Phone'}):null
  }
  async getAudioPermissions(){
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }
  


  async delPhoto(a){
    const filteredItems = this.state.imgs.filter(function(item) {
      return item.path !== a
    })
    await this.setState({imgs:filteredItems})
    console.log(this.state.imgs)

  }
  async delVid(a){
    const filteredItems = this.state.vids.filter(function(item) {
      return item.path !== a
    })
    await this.setState({vids:filteredItems})
    console.log(this.state.vids)

  }
  selectVid(){
    ImagePicker.openPicker({
      mediaType:'video',
      includeBase64:true,
      multiple: true
    }).then(async images => {
      console.log(images);
      await this.setState({vids:this.state.vids.concat(images)})
      console.log(this.state.vids)
    });
  }
  openVidCam(){
    ImagePicker.openCamera({
      mediaType:'video',
      includeBase64:true,
      // cropping:true
    }).then(async image => {
      console.log(image);
      // this.setState({imgs:this.state.imgs.push(image)})
      var temp=this.state.vids
      temp[this.state.vids.length]=image
      this.setState({vids:temp})
      // await this.state.imgs.push(image)
      console.log(this.state.vids)
    });
  }
  selectImages(){
    
    ImagePicker.openPicker({
      compressImageMaxHeight:700,
      compressImageMaxWidth:700,
      compressImageQuality:0.35,
      mediaType:'photo',
      includeBase64:true,
      multiple: true
    }).then(async images => {
      console.log(images);
      await this.setState({imgs:this.state.imgs.concat(images)})
      // console.log(this.state.imgs)
      // var temp=this.state.imgs
      // for(i=0;i<this.state.imgs.length;i++){
      //   ImageResizer.createResizedImage(this.state.imgs[i].path, 400, 200, 'JPEG', 50).then((response) => {
      //     // response.uri is the URI of the new image that can now be displayed, uploaded...
      //     // response.path is the path of the new image
      //     // response.name is the name of the new image with the extension
      //     // response.size is the size of the new image
      //     temp[i].path=response.path
          
      //   }).catch((err) => {
      //     // Oops, something went wrong. Check that the filename is correct and
      //     // inspect err to get more details.
      //   });
      // }
      // console.log(temp)
      // await this.setState({imgs:temp})
      console.log(this.state.imgs)
    });
  }
  openCam(){
    ImagePicker.openCamera({
      compressImageMaxHeight:700,
      compressImageMaxWidth:700,
      compressImageQuality:0.35,
      includeBase64:true,
      // cropping:true
    }).then(async image => {
      console.log(image);
      // this.setState({imgs:this.state.imgs.push(image)})
      var temp=this.state.imgs
      temp[this.state.imgs.length]=image
      this.setState({imgs:temp})
      // await this.state.imgs.push(image)
      console.log(this.state.imgs)
    });
  }

  onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    var length
    audioRecorderPlayer.addRecordBackListener(async (e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
      this.setState({audLen:e.current_position})
      // length=e.current_position;
      console.log(this.state.audLen)
      return;
    }).then(async ()=>{
      if(this.state.audLen<3000){
        await this.setState({shortrec:true})
        ToastAndroid.show('The recording should be at least 3 seconds long.', ToastAndroid.SHORT);
        console.log('if')
      }else{await this.setState({shortrec:false});console.log('else')}
    })
    
    
    // this.getrecordingpath();
    console.log(result+" "+this.state.audLen);
    
  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
    await this.setState({audiofile:result, rec:this.state.shortrec===false?true:false})
  }

  onStartPlay = async () => {
    await this.setState({playingRec:true})
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        await this.setState({playingRec:false})
        audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  }

  onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    await this.setState({playingRec:false})
  };

  onStopPlay = async () => {
    await this.setState({playingRec:false})
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  async postTask(){
    this.setState({loadingModal:true})
    console.log('posttask');
    console.log(this.state.title);
    console.log(this.state.tdesc);
    console.log(this.state.uid);
    console.log(this.state.date);
    console.log(this.state.tasker);
    console.log(this.state.budget);
    var uploaddata=[]
    if(this.state.imgs.length>0){
      this.setState({imgStat:'yes'})
      for (var i=0; i < this.state.imgs.length ; ++i){
        await uploaddata.push({'name':'image[]', 'filename': 'photo'+[i], 'type':this.state.imgs[i].mime, 'data':this.state.imgs[i].data});
      }
    }
    if(this.state.vids.length>0){
      this.setState({vidStat:'yes'})
      for (var i=0; i < this.state.vids.length ; ++i){
        await uploaddata.push({'name':'video[]', 'filename': 'vid'+[i], 'type':this.state.vids[i].mime, 'data':RNFetchBlob.wrap(this.state.vids[i].path)});
      }
    }
    if(this.state.rec){
      this.setState({audStat:'yes'})
      await uploaddata.push({'name':'audio[]', 'filename': 'aud'+[i], 'data':RNFetchBlob.wrap(this.state.audiofile)});
    }
    
    console.log(uploaddata)
    // // var img1data=this.state.imgs[0].data
    // // var img2data=this.state.imgs[1].data
    
    // // var img3data=this.state.imgs[2].data
    
    var tasktype;
    if(this.state.physical){
        tasktype='physical'
    }else{
        await this.setState({place:'Online/Phone', lat:'NA', long:'NA'})
        tasktype='online'
    }
    if(this.state.imgs.length>0){
      this.setState({imgStat:'yes'})
    }
    console.log(this.state.place);
    console.log(tasktype);
    var data=
    [
        this.state.uid, 
        this.state.selectedSkill,
        this.state.title, 
        this.state.tdesc, 
        this.state.place, 
        this.state.date,
        tasktype,
        this.state.tasker,
        this.state.budget,
        this.state.lat,
        this.state.long,
        this.state.imgStat,
        this.state.audStat,
        this.state.vidStat,
        this.state.timeofday
    ].join('©')
    console.log(data)
    await uploaddata.push({'name':'z','data' :data})
    console.log(uploaddata)
    
    const url='https://www.hazirsir.com/web_service/place_order.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    return new Promise(async function(resolve, reject) {
      await RNFetchBlob.fetch(
        "POST",
        url,
        {
          Authorization: "Bearer access-token",//url|||||||||||||||||||||||||||||||||||||||||||||||
          otherHeader: "foo",
          "Content-Type": "multipart/form-data"
        },
        uploaddata
      )
      // .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
          // Showing response message coming from server after inserting records.
          // resolve(responseJson);
          console.log(responseJson);
          console.log(responseJson.data)
          if(responseJson.data==='"Record created successfully" '){
            console.log('in');
            this.onPost();
          }
          this.setState({loadingModal:false})
          return responseJson;
      })
      .catch((error) => {
          reject(error);
          console.log(error);

          return error;
      });

      
     // Alert.alert(
        //'Buy any hardware ?',
        //[
         // {text: 'NO', onPress: () => this.redirect('EarnMoney')},
         // {text: 'YES', onPress: () => this.redirect('Tools')}
       // ]
      //);
      

    }.bind(this));

  }
  //redirect(screen){

    //console.log('screenRoute'+ screen);
    //this.navigation.navigate(screen)
  //}
  async onPost(){
    await this.setState({modalVisible1:false,modalVisible2:false,modalVisible3:false, tdesc:'',
            title:'',
            budget:'', 
            imgs:[],
            vids:[],
            imgStat:'no',
            audStat:'no',
            vidStat:'no',
            audiofile:''})
    console.log('onpost')
  }



  render() {

    // alert(JSON.stringify(this.state.coordinate));

    const cor= this.state.coordinate;
    // alert(JSON.stringify(cor.latitude));

//     if (!isNaN(cor.latitude)) {
//       // It's a number
  

//       // alert("if"+JSON.stringify(cor.latitude));
      
//  this.setState({showButton: true})
//     }
//     else
//     {
//       alert("Unable to get your current location, please use map");
//       this.setState({showButton: false})
//       this.setState({ 
//         coordinate:
//         {
//          latitude: 33.626057,
//                      longitude: 73.071442,
//                      latitudeDelta: 0.0922,
//                      longitudeDelta: 0.0421,}  })
//     }

   



    return (
      <View style={{flex:1}}>
        <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
          <Text style={{fontSize:17, fontWeight:'bold'}}>Post a task</Text>
        </View>
        <View style={{flexDirection:'row', width:'100%',backgroundColor:'#f5f5f5' ,justifyContent:'space-evenly', paddingBottom:5, alignItems:'center'}}>
          <TouchableOpacity onPress={()=>this.setState({general:true, pro:false})}>
            <Text style={{padding:10, fontSize:20, fontWeight:'bold', opacity:this.state.general?1:0.2}}>General</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={()=>this.setState({general:false, pro:true})}> 
            <Text style={{padding:10, fontSize:20, fontWeight:'bold', opacity:this.state.pro?1:0.2}}>Pro</Text>
          </TouchableOpacity> */}
        </View>
        {/* <View style={{width:'100%', height:80, borderBottomColor:'gray'}}><Text>What do you want done?</Text></View> */}
        <ScrollView  
        
        keyboardShouldPersistTaps='always'
        listViewDisplayed='false'
        >

        <Modal
          style={{flex:1}}
          animationType="slide"
          transparent={true}
          visible={this.state.loadingModal}
          >
            <View style={{flex:1, justifyContent:'center'}}>
              <View style={{padding:20, backgroundColor:'white', borderWidth:5, borderColor:'gray', alignSelf:'center', borderRadius:30}}>
                <ActivityIndicator size='large' color='gray' />
              </View>
              
            </View>
        </Modal>


        <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible1}
            onRequestClose={() => {
                this.setState({modalVisible1:false, date: new Date(), title:'', tdesc:'', budget:'', rec:false});
            }}>
            <View style={{flex:1}}>

            <ScrollView style={{flex:1}}>

              <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                <Text style={{fontSize:17, fontWeight:'bold'}}>What do you want done?</Text>
              </View>
              <View style={{flex:1, margin:10}}>
                <View style={{marginVertical:10, width:'70%', height:20, borderRadius:10, flexDirection:'row', justifyContent:'center', alignSelf:'center'}}>
                  <View style={{alignSelf:'center', width:'33.3%'}}>
                    <Text style={{paddingLeft:25, width:'100%', alignSelf:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10, color:'white', backgroundColor:'#299142', justifyContent:'center'}}>
                      Detail
                    </Text>
                  </View>
                  
                  <Text style={{paddingLeft:20, width:'33.3%',color:'gray', backgroundColor:'#f5f5f5', justifyContent:'center'}}>
                    Date
                  </Text>
                  <Text style={{paddingLeft:18, width:'33.3%',borderTopRightRadius:10, backgroundColor:'#f5f5f5', borderBottomRightRadius:10, color:'gray', justifyContent:'center',}}>
                    Budget
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                   <TextInput style={styles.inputs}
                        value={this.state.title}
                        onChangeText={(title) => {
                          if(title.length<30)
                          this.setState({title})
                          else
                          ToastAndroid.show('Title cannot exceed 30 characters', ToastAndroid.SHORT)
                        }}
                        placeholder="Task title:E.g: Need a unique product to launch on Amazon"
                        underlineColorAndroid='transparent'/>
                </View>



                <View style={{width:'95%', flexDirection:"row", justifyContent:'center', alignSelf:'center'}}>
                    <View style={{ width:'25%'}}>
                        <TouchableOpacity onPress={()=>this.textSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%',backgroundColor:this.state.selected1?'#32a84e':'#f5f5f5',borderTopLeftRadius:5, height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{marginLeft:12, alignSelf:'center', marginTop:2, fontSize:14, color:this.state.selected1?'white':'gray'}}>
                                    Text
                                </Text>
                                <Image 
                                    style={[
                                        {marginTop:10, width:17, height:17, marginLeft:3}
                                    ]} 
                                    source={require('../Logos/text.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width:'25%'}}>
                        <TouchableOpacity onPress={()=>this.photoSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%',backgroundColor:this.state.selected2?'#32a84e':'#f5f5f5', height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{marginLeft:12, alignSelf:'center', marginTop:2, fontSize:14, color:this.state.selected2?'white':'gray'}}>
                                    Photo
                                </Text>
                                <Image 
                                    style={[
                                        {marginTop:10, width:17, height:17, marginLeft:3}
                                    ]} 
                                    source={require('../Logos/pic.png')}/>
                                    {/* // source={{uri:this.state.image}}/> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width:'25%'}}>
                        <TouchableOpacity onPress={()=>this.videoSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%',backgroundColor:this.state.selected3?'#32a84e':'#f5f5f5', height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{marginLeft:12, alignSelf:'center', marginTop:2, fontSize:14, color:this.state.selected3?'white':'gray'}}>
                                    Video
                                </Text>
                                <Image 
                                    style={[
                                        {marginTop:10, width:17, height:17, marginLeft:3}
                                    ]} 
                                    source={require('../Logos/video.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width:'25%'}}>
                        <TouchableOpacity onPress={()=>this.audioSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%',backgroundColor:this.state.selected4?'#32a84e':'#f5f5f5',borderTopRightRadius:5, height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{marginLeft:12, alignSelf:'center', marginTop:2, fontSize:14, color:this.state.selected4?'white':'gray'}}>
                                    Audio
                                </Text>
                                <Image 
                                    style={[
                                        {marginTop:10, width:17, height:17, marginLeft:3}
                                    ]} 
                                    source={require('../Logos/audio.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                </View>
             
             
             
             
             
             
                {this.state.selected1?
                  <View style={[styles.inputContainer, {height:180}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <TextInput style={{height:180}}
                          value={this.state.tdesc}
                          multiline
                          onChangeText={(tdesc) => this.setState({tdesc})}
                          placeholder="A product with less competition, more in sales, with a Good revenue potential required"
                          underlineColorAndroid='transparent'/>
                  </View>
                :null}
                {this.state.selected2?

                  <View>
                    {
                      this.state.imgs.length>0?
                      <View style={[styles.inputContainer, {height:180, flexDirection:'column'}]}>
                          {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                          
                          <View style={{width:'85%', height:'70%', justifyContent:'center', alignItems:'center'}}>
                            {/* <ScrollView horizontal={true}> */}
                              <FlatList 
                                  horizontal={true}
                                  data={this.state.imgs}
                                  renderItem={({item}) => {
                                      return (
                                          <View style={{backgroundColor:'white', marginTop:5, height:'100%', borderRadius:10}}>
                                            
                                              {/* <Image 
                                                style={[
                                                    {height:115, width:150, marginLeft:2}
                                                ]} 
                                                source={{uri:item.path}}/> */}
                                                <ImageBackground
                                                  style={[
                                                    {height:115, width:150, marginLeft:2}
                                                  ]} 
                                                  source={{uri:item.path}}
                                                >
                                                    <TouchableOpacity onPress={()=>this.delPhoto(item.path)}>
                                                      <View style={{margin:5}}>
                                                        <Image 
                                                          style={[
                                                              {width:25, height:25, marginLeft:3}
                                                          ]} 
                                                          source={require('../Logos/delPhoto.png')}/>
                                                      </View>
                                                    </TouchableOpacity>
                                                </ImageBackground>
                                          </View>
                                          
                                      )
                                  }
                                }/>  
                            {/* </ScrollView> */}
                          </View>
                          <View style={{width:'20%', alignItems:'center'}}>
                              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>this.selectImages()}>
                                <View style={{flexDirection:'row'}}>
                                      <Image 
                                            style={[
                                                {marginTop:7, width:30, height:30, marginLeft:3}
                                            ]} 
                                            source={require('../Logos/openGal.png')}/>
                                </View>
                              </TouchableOpacity>  
                              <TouchableOpacity onPress={()=>this.openCam()}>
                                <View style={{flexDirection:'row'}}>
                                      <Image 
                                            style={[
                                                {marginTop:7, width:30, height:30, marginLeft:3}
                                            ]} 
                                            source={require('../Logos/openCam.png')}/>
                                </View>
                              </TouchableOpacity> 
                            </View> 
                          </View>
                      </View>
                      :
                      <View style={[styles.inputContainer, {height:180, justifyContent:'space-evenly'}]}>
                          {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                          
                            <TouchableOpacity onPress={()=>this.selectImages()}>
                              <View style={{flexDirection:'row'}}>
                                    <Image 
                                          style={[
                                              {marginTop:7, width:50, height:50, marginLeft:3}
                                          ]} 
                                          source={require('../Logos/openGal.png')}/>
                              </View>
                            </TouchableOpacity>  
                            <TouchableOpacity onPress={()=>this.openCam()}>
                              <View style={{flexDirection:'row'}}>
                                    <Image 
                                          style={[
                                              {marginTop:7, width:50, height:50, marginLeft:3}
                                          ]} 
                                          source={require('../Logos/openCam.png')}/>
                              </View>
                            </TouchableOpacity> 
                      </View>
                    }
                  </View>
               
               :null}

                {this.state.selected3?   //video
                  <View>
                    {
                      this.state.vids.length>0?
                      <View style={[styles.inputContainer, {height:180, flexDirection:'column'}]}>
                          {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                          
                          <View style={{width:'85%', height:'70%', justifyContent:'center', alignItems:'center'}}>
                            {/* <ScrollView horizontal={true}> */}
                              <FlatList 
                                  horizontal={true}
                                  data={this.state.vids}
                                  renderItem={({item}) => {
                                      return (
                                          <View style={{backgroundColor:'white', marginTop:5, height:'100%', borderRadius:10}}>
                                            
                                              {/* <Image 
                                                style={[
                                                    {height:115, width:150, marginLeft:2}
                                                ]} 
                                                source={{uri:item.path}}/> */}
                                                <ImageBackground
                                                  style={[
                                                    {height:115, width:150, marginLeft:2}
                                                  ]} 
                                                  source={{uri:item.path}}
                                                >
                                                    <TouchableOpacity onPress={()=>this.delVid(item.path)}>
                                                      <View style={{margin:5}}>
                                                        <Image 
                                                          style={[
                                                              {width:25, height:25, marginLeft:3}
                                                          ]} 
                                                          source={require('../Logos/delPhoto.png')}/>
                                                      </View>
                                                    </TouchableOpacity>
                                                </ImageBackground>
                                          </View>
                                          
                                      )
                                  }
                                }/>  
                            {/* </ScrollView> */}
                          </View>
                          <View style={{width:'20%', alignItems:'center'}}>
                              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>this.selectVid()}>
                                <View style={{flexDirection:'row'}}>
                                      <Image 
                                            style={[
                                                {marginTop:7, width:30, height:30, marginLeft:3}
                                            ]} 
                                            source={require('../Logos/openVidGal.png')}/>
                                </View>
                              </TouchableOpacity>  
                              <TouchableOpacity onPress={()=>this.openVidCam()}>
                                <View style={{flexDirection:'row'}}>
                                      <Image 
                                            style={[
                                                {marginTop:7, width:30, height:30, marginLeft:3}
                                            ]} 
                                            source={require('../Logos/openVid.png')}/>
                                </View>
                              </TouchableOpacity> 
                            </View> 
                          </View>
                      </View>
                      :
                      <View style={[styles.inputContainer, {height:180, justifyContent:'space-evenly'}]}>
                          {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                          
                            <TouchableOpacity onPress={()=>this.selectVid()}>
                              <View style={{flexDirection:'row'}}>
                                    <Image 
                                          style={[
                                              {marginTop:7, width:50, height:50, marginLeft:3}
                                          ]} 
                                          source={require('../Logos/openVidGal.png')}/>
                              </View>
                            </TouchableOpacity>  
                            <TouchableOpacity onPress={()=>this.openVidCam()}>
                              <View style={{flexDirection:'row'}}>
                                    <Image 
                                          style={[
                                              {marginTop:7, width:50, height:50, marginLeft:3}
                                          ]} 
                                          source={require('../Logos/openVid.png')}/>
                              </View>
                            </TouchableOpacity> 
                      </View>
                    }
                  </View>
                :null}
                {this.state.selected4?
                  <View style={[styles.inputContainer, {height:180, justifyContent:'space-around'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      
                      {
                        !this.state.rec?
                        <View style={{alignItems:'center'}}>
                          <Text style={{fontSize:9}}>PRESS AND HOLD TO RECORD</Text>
                          <TouchableOpacity 
                            onPressIn={()=>this.onStartRecord()}
                            onPressOut={()=>this.onStopRecord()}
                            delayPressOut={500}>
                            <View>
                              <Image 
                                  style={[
                                      {marginTop:7, width:50, height:50}
                                  ]} 
                                  source={require('../Logos/rec.png')}/>
                            </View>
                          </TouchableOpacity>
                        </View>
                      :null
                      }
                      
                        {
                          this.state.rec?
                          <View style={{ flexDirection:'row', justifyContent:'space-around'}}>
                            {
                              !this.state.playingRec?
                              <TouchableOpacity onPress={()=>this.onStartPlay()}>
                                <View>
                                <Image 
                                      style={[
                                          {width:50, height:50}
                                      ]} 
                                      source={require('../Logos/play.png')}/>
                                </View>
                              </TouchableOpacity>:null
                            }
                            {
                              this.state.playingRec?
                              <TouchableOpacity onPress={()=>this.onPausePlay()}>
                                <View>
                                <Image 
                                      style={[
                                          {width:50, height:50}
                                      ]} 
                                      source={require('../Logos/pause.png')}/>
                                </View>
                              </TouchableOpacity>:null
                            }
                            <TouchableOpacity onPress={()=>this.onStopPlay()}>
                              <View>
                              <Image 
                                    style={[
                                        {width:50, height:50}
                                    ]} 
                                    source={require('../Logos/stoprec.png')}/>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({rec:false})}>
                              <View>
                              <Image 
                                    style={[
                                        {width:50, height:50}
                                    ]} 
                                    source={require('../Logos/delPhoto.png')}/>
                              </View>
                            </TouchableOpacity>
                          </View>:null
                        }
                  </View>
                :null}
                <Text style={{fontWeight:'bold'}}>What type of task is it?</Text>


                <View style={{width:'80%', flexDirection:"row", justifyContent:'center', alignSelf:'center', marginTop:10}}>
                    
                    <View style={{marginHorizontal:5, width:'50%', borderWidth:1, borderRadius:5,backgroundColor:this.state.physical?'#d3dfe8':'white'}}>
                        <TouchableOpacity onPress={()=>this.physicalSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%', height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{ marginBottom:9, marginLeft:30, alignSelf:'center', fontSize:15}}>
                                    Physical
                                </Text>
                                <Image 
                                    style={[
                                        {width:18, height:18, marginLeft:3, marginTop:3}
                                    ]} 
                                    source={require('../Logos/physical.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal:5, width:'50%', borderWidth:1, borderRadius:5,backgroundColor:this.state.online?'#d3dfe8':'white'}}>
                        <TouchableOpacity onPress={()=>this.onlineSelected()}>
                            <View style={{flexDirection:'row' ,width:'100%',borderTopRightRadius:5, height:35, alignSelf:'center', marginTop:7}}>
                                <Text style={{ marginBottom:9, marginLeft:30, alignSelf:'center', fontSize:15}}>
                                    Online
                                </Text>
                                <Image 
                                    style={[
                                      {width:18, height:18, marginLeft:3, marginTop:3}
                                    ]} 
                                    source={require('../Logos/online.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.physical?
                <Text style={{marginTop:15}}>Task location</Text>
                :null}
                {this.state.physical?
                <TouchableOpacity onPress={()=>this.setState({placesModal:true})}>
                  <View style={styles.inputContainer}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <TextInput style={styles.inputs}
                          value={this.state.place}
                          editable={false}
                          placeholder="Enter task location"
                          underlineColorAndroid='transparent'/>
                  </View>
                </TouchableOpacity>
                :null}
                
           
                
                
              </View>
          
              </ScrollView>

              <View style={{paddingHorizontal:5,}}>
                <TouchableOpacity 
                  // disabled={
                  //   this.state.title==='' || this.state.tdesc==='' || this.state.place===''
                  // } 
                  onPress={()=>{
                    if(this.state.title.length<5){
                      ToastAndroid.show('Title should be at least 5 characters.', ToastAndroid.SHORT)
                    }
                    else if(this.state.tdesc.length<20){
                      ToastAndroid.show('Description should be at least 20 characters.', ToastAndroid.SHORT)
                    }
                    else if(this.state.place===''){
                      ToastAndroid.show('Enter place or select online.', ToastAndroid.SHORT)
                    }
                    if(this.state.tdesc.length>=20 && this.state.title.length>=5 && this.state.place!==''){
                      this.setState({modalVisible2:true})
                    }
                  }}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white'}}>Next</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              
            </View>
        </Modal>






        <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible2}
            onRequestClose={() => {
                this.setState({modalVisible2:false});
            }}>
            <View style={{flex:1}}>
              <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                <Text style={{fontSize:17, fontWeight:'bold'}}>What do you want done?</Text>
              </View>
              <View style={{flex:1, padding:10}}>
                <View style={{marginVertical:10, width:'70%', height:20, borderRadius:10, flexDirection:'row', justifyContent:'center', alignSelf:'center'}}>
                    <View style={{alignSelf:'center', width:'33.3%'}}>
                      <Text style={{paddingLeft:25, width:'100%', alignSelf:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10, color:'white', backgroundColor:'#32a84e', justifyContent:'center'}}>
                        Detail
                      </Text>
                    </View>
                    
                    <Text style={{paddingLeft:20, width:'33.3%',color:'white', backgroundColor:'#299142', justifyContent:'center'}}>
                      Date
                    </Text>
                    <Text style={{paddingLeft:18, width:'33.3%',borderTopRightRadius:10, backgroundColor:'#f5f5f5', borderBottomRightRadius:10, color:'gray', justifyContent:'center',}}>
                      Budget
                    </Text>
                  </View>

                  
                <Text style={{marginTop:15}}>Pick due date</Text>
                <View style={styles.inputContainer}>
                <DatePicker
                  style={{width: 300}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="DD-MM-YYYY"
                  minDate={this.state.todaydate}
                  // maxDate="2016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 16,
                      borderWidth:0
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
                </View>
                <Text style={{marginTop:15}}>Select time of day</Text>
                {/* <View style={styles.inputContainer}>
                        
                        <Picker selectedValue={this.state.timeofday} style={{left:8, height: 45, width: '100%'}} onValueChange={(itemValue, itemIndex) => this.setState({timeofday: itemValue})}>
                          <Picker.Item label="Morning" value="Morning" />
                          <Picker.Item label="Afternoon" value="Afternoon" />
                          <Picker.Item label="Evening" value="Evening" />
                          <Picker.Item label="Night" value="Night" />
                      </Picker>
                </View> */}

                <FlatGrid    /* skills */
                  itemDimension={Number(this.state.widthHalf)-40}
                  items={[{name:"Morning", image:require('../Logos/morning.png'), selectedImage:require('../Logos/morningWhite.png'),}, {name:"Afternoon", image:require('../Logos/afternoon.png'), selectedImage:require('../Logos/afternoonWhite.png'),}, {name:"Evening", image:require('../Logos/evening.png'), selectedImage:require('../Logos/eveningWhite.png'),}, {name:"Night", image:require('../Logos/night.png'), selectedImage:require('../Logos/nightWhite.png'),}]}
                  spacing={0}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>this.setState({timeofday: item.name})}>
                        <View style={{ justifyContent:'center', height:Number(this.state.widthHalf)-40, padding:5, alignItems:'center', backgroundColor:item.name===this.state.timeofday?'#32a84e':'white', borderRadius:10}}>
                            <Image 
                                style={[
                                    styles.inputIcon, {height:50, width:50}
                                ]} 
                                source={item.name===this.state.timeofday?item.selectedImage:item.image}/>

                            <Text style={{alignSelf:'center', textAlign:'center', color:item.name===this.state.timeofday?'white':'black'}}>
                              {item.name}
                              </Text>
                        
                        </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
              
              <View style={{paddingHorizontal:5}}>
                <TouchableOpacity onPress={()=>this.state.timeofday===''?
                    // Toast.show('Please select time of day first.', {
                    //   duration:Toast.duration.LONG
                    // })
                    ToastAndroid.show('Please select time of day first.', ToastAndroid.SHORT)
                    :this.setState({modalVisible3:true})}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white'}}>Nex</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>








        <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible3}
            onRequestClose={() => {
                this.setState({modalVisible3:false});
            }}>
            <View style={{flex:1}}>
              <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                <Text style={{fontSize:17, fontWeight:'bold'}}>What do you want done?</Text>
              </View>
              <View style={{flex:1, padding:10}}>
                <View style={{marginVertical:10, width:'70%', height:20, borderRadius:10, flexDirection:'row', justifyContent:'center', alignSelf:'center'}}>
                    <View style={{alignSelf:'center', width:'33.3%'}}>
                      <Text style={{paddingLeft:25, width:'100%', alignSelf:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10, color:'white', backgroundColor:'#32a84e', justifyContent:'center'}}>
                        Detail
                      </Text>
                    </View>
                    <View style={{alignSelf:'center', width:'33.3%'}}>
                      <Text style={{paddingLeft:25, width:'100%', alignSelf:'center', color:'white', backgroundColor:'#32a84e', justifyContent:'center'}}>
                        Date
                      </Text>
                    </View>
                    <Text style={{paddingLeft:18, width:'33.3%',borderTopRightRadius:10, backgroundColor:'#299142', borderBottomRightRadius:10, color:'white', justifyContent:'center',}}>
                      Budget
                    </Text>
                  </View>

                  
                <Text style={{marginVertical:15}}>How many people do you need for your task?</Text>
                <View style={{flexDirection:'row'}}>
                  <View style={[styles.inputContainer, {width:'30%'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      
                      <TextInput style={styles.inputs}
                        value={this.state.tasker}
                        keyboardType={'numeric'}
                        onChangeText={(tasker) => this.setState({tasker})}
                        underlineColorAndroid='transparent'/>
                  </View>
                  <Text style={{marginLeft:3,color:'gray', marginTop:15}}>Taskers</Text>
                </View>
                <Text style={{marginVertical:15}}>What's your budget?</Text>
                
                <View style={[styles.inputContainer]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                    
                    <TextInput style={styles.inputs}
                      value={this.state.budget}
                      keyboardType={'numeric'}
                      onChangeText={(budget) => this.setState({budget})}
                      underlineColorAndroid='transparent'/>
                </View>
                <View style={[styles.inputContainer, {borderWidth:0, backgroundColor:'#f5f5f5', height:60}]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                    
                    <TextInput style={[styles.inputs, {backgroundColor:'#f5f5f5', fontSize:18}]}
                      value={'Estimated Budget: Rs '+this.state.budget}
                      editable={false}
                      underlineColorAndroid='transparent'/>
                </View>
                  
              </View>
              <View style={{paddingHorizontal:5}}>
                
                <TouchableOpacity disabled={this.state.budget===''} onPress={()=>this.postTask()}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white'}}>Get quotes now</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>


        <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={false}
            visible={this.state.placesModal}
            onRequestClose={() => {
                this.setState({placesModal:false});
            }}>
            <View style={{flex:1}}>
              <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                <Text style={{fontSize:17, fontWeight:'bold'}}>Enter Location</Text>
              </View>
              <MapView
                  ref={component => (this._map = component)}
                  provider="google"
                  initialRegion={{
                     
                      latitude:31.5204,
                      longitude:74.3587,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                  } }
                  style={ styles.map }
                  onPress={e => this.animate(e.nativeEvent.coordinate)}>
                  <Marker.Animated
                      ref={marker => {
                          this.marker = marker;
                      }}
                      coordinate={this.state.coordinate}
                  />
              </MapView>
              <View style={{flex:1, }}>
              <GooglePlacesAutocomplete
                placeholder='Search and select your location..'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='auto'    // true/false/undefined
                fetchDetails={true}
                //keyboardShouldPersistTaps='always' 
                renderDescription={row => row.description} // custom description render
                onPress={async (data, details = null) => { // 'details' is provided when fetchDetails = true
               
                  console.log('okkkkkkkkkk');
                  console.log(data, details);
                  console.log('ghjgjh');
                  console.log(data);
                  await this.setState({place:data.description, placesModal:false, lat:details.geometry.location.lat, long:details.geometry.location.lng})
                  console.log(this.state.place)
                  console.log(this.state.lat)

                }}

                getDefaultValue={() => ''}

                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  // key: 'AIzaSyC8uzc-VUCpu4LKln_puqRrBbrmWdTIJC4',//essex key
                  key: 'AIzaSyCZS7yiqoySRYGcXVS_CRABTBP8WQoCehY',//hazirsir key
                  language: 'en', // language of the results
                  // types: '(cities)' // default: 'geocode'
                }}

                styles={{
                  textInputContainer: {
                    width: '100%'
                  },
                  description: {
                    fontWeight: 'bold',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  }
                }}

                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  type: 'cafe'
                }}
                
                GooglePlacesDetailsQuery={{
                  // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                  fields: 'geometry',

                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                // predefinedPlaces={[homePlace, workPlace]}

                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                renderLeftButton={()  => <Image source={require('../Logos/text.png')} />}
                // renderRightButton={() => <Text>Custom text after the input</Text>}
              />
              <View style={{flex:1, flexDirection:'column',alignItems:'flex-end', justifyContent:'flex-end', marginBottom:40, marginRight:10}}>
                  
                <View style={{width:40}}>
                { this.state.showButton && 
                    <TouchableOpacity onPress={() => this.gotocurrent()}>
                 
                        <Image
                            source={require('../Logos/currloc.png')}
                            style={{
                            height: 40,
                            width: 40,
                            }}
                        />
                      
                    </TouchableOpacity>
  }
                </View>
                <View style={{width:60}}>
    
                    <TouchableOpacity>
                        <Text style={{marginTop:10}} onPress={()=>{this.setState({placesModal:false})}}>
                            DONE
                        </Text>
                        
                    </TouchableOpacity>
              
              </View>
              </View>
              </View>
          </View>
        </Modal>
        {Array.isArray(this.state.skills) && this.state.general?
          <View>
            {this.state.skills.length>0?
              <View style={{flex:1, padding:10}}>  
                  <View>
                      <FlatGrid
                      itemDimension={Number(this.state.width3rd)-10} 
                        items={this.state.skills}
                        spacing={0}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={()=>this.selectSkill(item.id, item.status)}>
                              <View style={{padding:10, alignItems:'center'}}>
                                  <Image 
                                      style={[
                                          styles.icon, styles.inputIcon,
                                      ]} 
                                      source={{uri: item.image}}/>
                                  <Text style={{textAlign: 'center', alignSelf:'center'}}>{item.name}</Text>
                              </View>
                          </TouchableOpacity>
                        )}
                      />
                  </View>
              </View>:<ActivityIndicator size='large' />
              }
          </View>:null
        }
        {/* {Array.isArray(this.state.skills2) && this.state.pro?
          <View>
            {this.state.skills.length>0?
              <View style={{flex:1, padding:10}}>  
                  <View>
                      <FlatGrid
                        itemDimension={Number(this.state.widthHalf)-10}
                        items={this.state.skills2}
                        spacing={0}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={()=>this.selectSkill(item.id, item.status)}>
                              <View style={{padding:10, alignItems:'center'}}>
                                  <Image 
                                      style={[
                                          styles.icon, styles.inputIcon,
                                      ]} 
                                      source={{uri: item.image}}/>
                                  <Text style={{alignSelf:'center'}}>{item.name}</Text>
                              </View>
                          </TouchableOpacity>
                        )}
                      />
                  </View>
              </View>:<ActivityIndicator size='large' />
              }
          </View>:null
        } */}
            
        </ScrollView>
       
       
        <NavigationEvents
          onWillFocus={() => this.sendToServer()}
        />
    </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding:5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding:5,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius:5,
    borderWidth: 1,
    width:'100%',
    height:45,
    marginBottom:15,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  icon:{
    width:70,
    height:70,
  },
  inputIcon:{
    justifyContent: 'center'
  },
  buttonContainer: {
    height:38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:'85%',
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: '#6cb505',
  },
  fabookButton: {
    backgroundColor: "#0883ff",
  },
  googleButton: {
    borderColor:'grey',
    borderWidth:1,
    // backgroundColor: "#ff0000",
  },
  loginText: {
    color: 'white',
  },
  restoreButtonContainer:{
    width:250,
    marginBottom:15,
    alignItems: 'flex-end'
  },
  socialButtonContent:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  socialIcon:{
    color: "#FFFFFF",
    marginRight:5
  },
  map: {
    position:'absolute',
    height:Math.round(Dimensions.get('window').height)-75,
    top: 75,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default withNavigation(PostTask);
