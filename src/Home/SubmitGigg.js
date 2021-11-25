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
  ToastAndroid,
} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';

const audioRecorderPlayer = new AudioRecorderPlayer();


class SubmitGigg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [],
      vids: [],
      image: '',
      imgStat: 'no',
      audStat: 'no',
      vidStat: 'no',
      audiofile: '',
      rec: false,
      playingRec: false,
      loadingModal: false,
      timeofday: '',
      shortrec: false,
      showButton: true,
      uid: '',
      pkg_one_details_state: '',
      Skill_id: '',
      package_title: '',
      package_one_details: '',
      package_one_price: '',
      package_two_details: '',
      package_two_price: '',
      package_three_details: '',
      package_three_price: '',
      Requirement_: ''





    };
  }

  async componentDidMount() {

    const value = await AsyncStorage.getItem('userID')
    this.setState({ uid: value })


    var Skill_id = this.props.navigation.getParam('Skill_Id', '0');
    var package_title = this.props.navigation.getParam('package_title', '');
    var package_one_details = this.props.navigation.getParam('package_one_details', '');
    var package_one_price = this.props.navigation.getParam('package_one_price', '');
    var package_two_details = this.props.navigation.getParam('package_two_details', '');
    var package_two_price = this.props.navigation.getParam('package_two_price', '');
    var package_three_details = this.props.navigation.getParam('package_three_details', '');
    var package_three_price = this.props.navigation.getParam('package_three_price', '');
    var Requirement_ = this.props.navigation.getParam('Requirement_', '');


    this.setState({
      Skill_id, package_title, package_one_details, package_one_price,
      package_two_details, package_two_price, package_three_details, package_three_price, Requirement_
    })

    // alert(package_two_details+ package_three_details );
  }

  async delPhoto(a) {
    const filteredItems = this.state.imgs.filter(function (item) {
      return item.path !== a
    })
    await this.setState({ imgs: filteredItems })
    console.log(this.state.imgs)

  }


  async delVid(a) {
    const filteredItems = this.state.vids.filter(function (item) {
      return item.path !== a
    })
    await this.setState({ vids: filteredItems })
    console.log(this.state.vids)

  }
  selectImages() {

    ImagePicker.openPicker({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      mediaType: 'photo',
      includeBase64: true,
      multiple: true
    }).then(async images => {
      // console.warn(images);
      await this.setState({ imgs: this.state.imgs.concat(images) })

      // console.warn(this.state.imgs)
    });
  }
  openCam() {
    ImagePicker.openCamera({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      includeBase64: true,
      // cropping:true
    }).then(async image => {
      console.log(image);
      // this.setState({imgs:this.state.imgs.push(image)})
      var temp = this.state.imgs
      temp[this.state.imgs.length] = image
      this.setState({ imgs: temp })
      // await this.state.imgs.push(image)
      console.log(this.state.imgs)
    });
  }

  selectVid() {
    ImagePicker.openPicker({
      mediaType: 'video',
      includeBase64: true,
      multiple: true
    }).then(async images => {
      console.log(images);
      await this.setState({ vids: this.state.vids.concat(images) })
      console.log(this.state.vids)
    });
  }
  openVidCam() {
    ImagePicker.openCamera({
      mediaType: 'video',
      includeBase64: true,
      // cropping:true
    }).then(async image => {
      console.log(image);
      // this.setState({imgs:this.state.imgs.push(image)})
      var temp = this.state.vids
      temp[this.state.vids.length] = image
      this.setState({ vids: temp })
      // await this.state.imgs.push(image)
      console.log(this.state.vids)
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
      this.setState({ audLen: e.current_position })
      // length=e.current_position;
      console.log(this.state.audLen)
      return;
    }).then(async () => {
      if (this.state.audLen < 3000) {
        await this.setState({ shortrec: true })
        ToastAndroid.show('The recording should be at least 3 seconds long.', ToastAndroid.SHORT);
        console.log('if')
      } else { await this.setState({ shortrec: false }); console.log('else') }
    })


    // this.getrecordingpath();
    console.log(result + " " + this.state.audLen);

  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
    await this.setState({ audiofile: result, rec: this.state.shortrec === false ? true : false })
  }



  onStartPlay = async () => {
    await this.setState({ playingRec: true })
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        await this.setState({ playingRec: false })
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
    await this.setState({ playingRec: false })
  };

  onStopPlay = async () => {
    await this.setState({ playingRec: false })
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  async postTask() {
    // alert(this.state.uid);
    if (this.state.imgs.length === 0) {
      alert("Please Add Image");

    } else if (this.state.vids.length === 0) {
      alert("Please Add Video");

    }
    else {
      this.setState({ loadingModal: true })

      var uploaddata = []
      if (this.state.imgs.length > 0) {
        this.setState({ imgStat: 'yes' })
        for (var i = 0; i < this.state.imgs.length; ++i) {
          await uploaddata.push({ 'name': 'image[]', 'filename': 'photo' + [i], 'type': this.state.imgs[i].mime, 'data': this.state.imgs[i].data });
        }
      }
      if (this.state.vids.length > 0) {
        this.setState({ vidStat: 'yes' })
        for (var i = 0; i < this.state.vids.length; ++i) {
          await uploaddata.push({ 'name': 'video[]', 'filename': 'vid' + [i], 'type': this.state.vids[i].mime, 'data': RNFetchBlob.wrap(this.state.vids[i].path) });
        }
      }
      if (this.state.rec) {
        this.setState({ audStat: 'yes' })
        await uploaddata.push({ 'name': 'audio[]', 'filename': 'aud' + [i], 'data': RNFetchBlob.wrap(this.state.audiofile) });
      }

      var package_data = [];



      var package_data1 =
        [
          this.state.package_one_details,
          this.state.package_one_price,
        ]

      var package_data2 =
        [
          this.state.package_two_details,
          this.state.package_two_price,
        ]

      var package_data3 =
        [
          this.state.package_three_details,
          this.state.package_three_price,
        ]

      package_data.push(package_data1)
      // package_data.push(this.state.package_one_price)



      if (this.state.package_two_details !== '') {

        package_data.push(package_data2)


      }
      if (this.state.package_three_details !== '') {

        package_data.push(package_data3)

      }




      // for (var i = 0; i < package_data.length; i++) {
      // await uploaddata.push({ 'name': 'package', 'data': package_data });
      // }


      console.warn("ttttt  ", package_data)
      // // var img1data=this.state.imgs[0].data
      // // var img2data=this.state.imgs[1].data

      // // var img3data=this.state.imgs[2].data


      if (this.state.imgs.length > 0) {
        this.setState({ imgStat: 'yes' })
      }
      // console.log(this.state.place);
      // console.log(tasktype);
      // var package_status = "yes",



      // if( package_two_details === '')




      // await uploaddata.push({ 'name': 'package', 'data': package_data })

      console.warn();

      var data =
        [
          this.state.uid,
          this.state.Skill_id,
          this.state.package_title,
          this.state.Requirement_,
          "yes",
          this.state.imgStat,
          this.state.audStat,
          this.state.vidStat,
          package_data
        ].join('©')
      // alert(JSON.stringify(data))
      await uploaddata.push({ 'name': 'z', 'data': data })


      // await uploaddata.push({ 'name': 'packagee', 'data': data });


      const url = 'https://www.hazirsir.com/web_service/place_gig.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
      return new Promise(async function (resolve, reject) {


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
            console.warn("ttttt ", responseJson);
            console.warn(uploaddata)
            if (responseJson.data === '"Record created successfully" ') {
              // console.log('in');
              alert(responseJson.data);
              this.props.navigation.navigate("Home");
            }
            else{
              alert(responseJson.data);
            }
            this.setState({ loadingModal: false })
            return responseJson;
          })
          .catch((error) => {
            reject(error);
            console.log(error);

            return error;
          });



      }.bind(this));

    }

  }



  render() {
    return (
      <View style={styles.container}>

        <View style={{ flex: 6 }}>

          <ScrollView >



            <Text style={{ fontSize: 17, marginBottom: 15 }}>Add Images</Text>

            <View>
              {
                this.state.imgs.length > 0 ?
                  <View style={[styles.inputContainer, { height: 180, flexDirection: 'column' }]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                    <View style={{ width: '85%', height: '70%', justifyContent: 'center', alignItems: 'center' }}>
                      {/* <ScrollView horizontal={true}> */}
                      <FlatList
                        horizontal={true}
                        data={this.state.imgs}
                        renderItem={({ item }) => {
                          return (
                            <View style={{ backgroundColor: 'white', marginTop: 5, height: '100%', borderRadius: 10 }}>

                              {/* <Image 
                                                style={[
                                                    {height:115, width:150, marginLeft:2}
                                                ]} 
                                                source={{uri:item.path}}/> */}
                              <ImageBackground
                                style={[
                                  { height: 115, width: 150, marginLeft: 2 }
                                ]}
                                source={{ uri: item.path }}
                              >
                                <TouchableOpacity onPress={() => this.delPhoto(item.path)}>
                                  <View style={{ margin: 5 }}>
                                    <Image
                                      style={[
                                        { width: 25, height: 25, marginLeft: 3 }
                                      ]}
                                      source={require('../Logos/delPhoto.png')} />
                                  </View>
                                </TouchableOpacity>
                              </ImageBackground>
                            </View>

                          )
                        }
                        } />
                      {/* </ScrollView> */}
                    </View>
                    <View style={{ width: '20%', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => this.selectImages()}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              style={[
                                { marginTop: 7, width: 40, height: 40, marginLeft: 3 }
                              ]}
                              source={require('../Logos/openGal.png')} />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.openCam()}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              style={[
                                { marginTop: 7, width: 40, height: 40, marginLeft: 3 }
                              ]}
                              source={require('../Logos/openCam.png')} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  :
                  <View style={[styles.inputContainer, { height: 180, justifyContent: 'space-evenly' }]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                    <TouchableOpacity onPress={() => this.selectImages()}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={[
                            { marginTop: 7, width: 50, height: 50, marginLeft: 3 }
                          ]}
                          source={require('../Logos/openGal.png')} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openCam()}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={[
                            { marginTop: 7, width: 50, height: 50, marginLeft: 3 }
                          ]}
                          source={require('../Logos/openCam.png')} />
                      </View>
                    </TouchableOpacity>
                  </View>
              }
            </View>

            <Text style={{ fontSize: 17, marginBottom: 15 }}>Add Videos</Text>

            <View>
              {
                this.state.vids.length > 0 ?
                  <View style={[styles.inputContainer, { height: 180, flexDirection: 'column' }]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                    <View style={{ width: '85%', height: '70%', justifyContent: 'center', alignItems: 'center' }}>
                      {/* <ScrollView horizontal={true}> */}
                      <FlatList
                        horizontal={true}
                        data={this.state.vids}
                        renderItem={({ item }) => {
                          return (
                            <View style={{ backgroundColor: 'white', marginTop: 5, height: '100%', borderRadius: 10 }}>

                              {/* <Image 
                                                style={[
                                                    {height:115, width:150, marginLeft:2}
                                                ]} 
                                                source={{uri:item.path}}/> */}
                              <ImageBackground
                                style={[
                                  { height: 115, width: 150, marginLeft: 2 }
                                ]}
                                source={{ uri: item.path }}
                              >
                                <TouchableOpacity onPress={() => this.delVid(item.path)}>
                                  <View style={{ margin: 5 }}>
                                    <Image
                                      style={[
                                        { width: 25, height: 25, marginLeft: 3 }
                                      ]}
                                      source={require('../Logos/delPhoto.png')} />
                                  </View>
                                </TouchableOpacity>
                              </ImageBackground>
                            </View>

                          )
                        }
                        } />
                      {/* </ScrollView> */}
                    </View>
                    <View style={{ width: '20%', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => this.selectVid()}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              style={[
                                { marginTop: 7, width: 40, height: 40, marginLeft: 3 }
                              ]}
                              source={require('../Logos/openVidGal.png')} />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.openVidCam()}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              style={[
                                { marginTop: 7, width: 40, height: 40, marginLeft: 7 }
                              ]}
                              source={require('../Logos/openVid.png')} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  :
                  <View style={[styles.inputContainer, { height: 180, justifyContent: 'space-evenly' }]}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                    <TouchableOpacity onPress={() => this.selectVid()}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={[
                            { marginTop: 7, width: 50, height: 50, marginLeft: 3 }
                          ]}
                          source={require('../Logos/openVidGal.png')} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openVidCam()}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={[
                            { marginTop: 7, width: 50, height: 50, marginLeft: 3 }
                          ]}
                          source={require('../Logos/openVid.png')} />
                      </View>
                    </TouchableOpacity>
                  </View>
              }
            </View>
            <Text style={{ fontSize: 17, marginBottom: 15 }}>Add Audio</Text>


            <View style={[styles.inputContainer, { height: 180, justifyContent: 'space-around' }]}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              {
                !this.state.rec ?
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 9 }}>PRESS AND HOLD TO RECORD</Text>
                    <TouchableOpacity
                      onPressIn={() => this.onStartRecord()}
                      onPressOut={() => this.onStopRecord()}
                      delayPressOut={500}>
                      <View>
                        <Image
                          style={[
                            { marginTop: 7, width: 50, height: 50 }
                          ]}
                          source={require('../Logos/rec.png')} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  : null
              }

              {
                this.state.rec ?
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                      !this.state.playingRec ?
                        <TouchableOpacity onPress={() => this.onStartPlay()}>
                          <View>
                            <Image
                              style={[
                                { width: 50, height: 50 }
                              ]}
                              source={require('../Logos/play.png')} />
                          </View>
                        </TouchableOpacity> : null
                    }
                    {
                      this.state.playingRec ?
                        <TouchableOpacity onPress={() => this.onPausePlay()}>
                          <View>
                            <Image
                              style={[
                                { width: 50, height: 50 }
                              ]}
                              source={require('../Logos/pause.png')} />
                          </View>
                        </TouchableOpacity> : null
                    }
                    <TouchableOpacity onPress={() => this.onStopPlay()}>
                      <View>
                        <Image
                          style={[
                            { width: 50, height: 50 }
                          ]}
                          source={require('../Logos/stoprec.png')} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ rec: false })}>
                      <View>
                        <Image
                          style={[
                            { width: 50, height: 50 }
                          ]}
                          source={require('../Logos/delPhoto.png')} />
                      </View>
                    </TouchableOpacity>
                  </View> : null
              }
            </View>
          </ScrollView>
        </View>

        <View style={{ flex: .5, alignItems: "flex-end", justifyContent: "flex-end", alignSelf: "flex-end" }}>

          {this.state.loadingModal ?
            <ActivityIndicator size="large" color="#0000ff" style={{ marginRight: 15, marginBottom: 5 }} />
            :
            <TouchableOpacity
              onPress={() => this.postTask()}
              style={{ marginBottom: 10 }}>
              <View style={{ backgroundColor: '#32a84e', borderRadius: 5, height: 35, width: 150, alignSelf: 'center', marginTop: 7 }}>
                <Text style={{ alignSelf: 'center', marginTop: 5, fontSize: 18, color: 'white' }}>
                  Submit
                </Text>
              </View>
            </TouchableOpacity>

          }
          {/* <TouchableOpacity
            onPress={() => this.postTask()}
            style={{ marginBottom: 10 }}>
            <View style={{ backgroundColor: '#32a84e', borderRadius: 5, height: 35, width: 150, alignSelf: 'center', marginTop: 7 }}>
              <Text style={{ alignSelf: 'center', marginTop: 5, fontSize: 18, color: 'white' }}>
                Submit
                </Text>
            </View>
          </TouchableOpacity> */}

        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',

  },
  inputContainer: {
    padding: 5,
    // borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    // borderWidth: 1,
    width: windowWidth * 1,
    height: 45,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  icon: {
    width: 70,
    height: 70,
  },
  inputIcon: {
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '85%',
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#6cb505',
  },
  fabookButton: {
    backgroundColor: "#0883ff",
  },
  googleButton: {
    borderColor: 'grey',
    borderWidth: 1,
    // backgroundColor: "#ff0000",
  },
  loginText: {
    color: 'white',
  },
  restoreButtonContainer: {
    width: 250,
    marginBottom: 15,
    alignItems: 'flex-end'
  },
  socialButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    color: "#FFFFFF",
    marginRight: 5
  },
  map: {
    position: 'absolute',
    height: Math.round(Dimensions.get('window').height) - 75,
    top: 75,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default SubmitGigg;