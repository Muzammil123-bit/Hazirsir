import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  RefreshControl, StyleSheet, Modal, Slider, Dimensions
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import GigsDetails from "./GigsDetails";

import Video from 'react-native-video';
import ImageZoom from 'react-native-image-pan-zoom';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ViewAllGigs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      chatsPoster: [],
      chatsTasker: [],
      refreshing: false,
      data: '',
      videoModal: false,
      imageModal: false,
      videoLink: "",
      ImageLink: "",
    };
  }
  async componentWillMount() {
    const value = await AsyncStorage.getItem('userID')
    await this.setState({ uid: value })
    await this.sendToServer()



  }

  componentDidMount = () => {
    const gigsD = new GigsDetails();
    gigsD.navigate_data(this.props.navigation);
  }
  async onRefreshtask() {
    this.setState({ refreshing: true })
    await this.sendToServer()
    this.setState({ refreshing: false })
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }



  async sendToServer() {
    // console.log(uid)
    const url = 'https://www.hazirsir.com/web_service/read_gigs.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
        console.warn(JSON.stringify(responseJson));
        //   if(responseJson!=='Record doesnot exist' && responseJson!=='Wrong Credentials!'){
        await this.setState({ data: responseJson })
        //   }

        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }

  async bigImage(img) {
    await this.setState({ ImageLink: img })
    await this.setState({ imageModal: true })
    // alert(this.state.videoLink);
  }


  msToTime(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  onSeeking(value) {
    console.log(Math.round(value))
    this.seek(Math.round(value));
  }
  seek(time) {
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
      currentPosition: time,
    });
  }
  onLoad = data => {
    console.log(this.msToTime(data.duration))

    this.setState({ duration: data.duration, isLoading: false })
  };
  onEnd = () => this.setState({ paused: true });
  onProgress = data => {
    console.log(data)
    if (!this.state.paused)
      this.setState({ currentTime: data.currentTime });

  };
  onPause = () => this.setState({ paused: !this.state.paused })

  async video(vid) {
    await this.setState({ videoLink: vid })
    await this.setState({ videoModal: true })
    // alert(this.state.videoLink);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefreshtask()} />
          }>
          <View style={{ flexDirection: 'row', width: '100%', height: 55, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold' }}>Amazon Experts</Text>

            <View style={{ alignSelf: "center", flexDirection: "row" }}>


              <TouchableOpacity
                style={{ backgroundColor: "green", alignSelf: "center", borderRadius: 20 }}
                onPress={() => this.props.navigation.navigate('AddGig')}
              >
                <Text style={{ color: "white", padding: 12, }}>Post an Offer</Text>

              </TouchableOpacity>
            </View>

          </View>

          <View style={{  borderWidth:1, borderRadius:5,backgroundColor:'#d3dfe8', marginTop:10, width:110, alignSelf:"flex-end", marginRight:15}}>
              <TouchableOpacity onPress={()=>this.onRefreshtask()} >
                  <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                      <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                      Refresh Gigs
                      </Text>
                      <Image 
                          style={[
                            {width:12, height:12, marginLeft:3}
                          ]} 
                          source={require('../Logos/refresh.png')}/>
                  </View>
              </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={this.state.data}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <View style={{ backgroundColor: '#f5f5f5', marginTop: 5 }}>
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('GigsDetails',
                          {
                            user_id: item.user_id,
                            order_id: item.order_id,
                            title: item.title,
                            requirements: item.requirements,
                            package: item.package,
                            image: item.image,
                            audio: item.audio,
                            video: item.video,
                            skill_name: item.skill_name})}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                          <View style={{ width: '90%', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                              onPress={() => this.video(item.video_url)}>
                               <Image
                              style={{ width: 30, height: 30 }}
                              source={require('../Logos/play.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={{alignItems:"center", marginTop:5}}
                              onPress={() => this.bigImage(item.image_url)}>
                              <Image
                                style={[
                                  { width: "100%", height: 200, borderRadius: 3, marginTop: 4, }]}
                                source={{ uri: item.image_url }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", marginTop: 7 }}>
                              <Text style={{ fontWeight: "bold" }}>Title: </Text>
                              <Text>{item.title}</Text>
                            </View>


                            <View style={{ flexDirection: "row" }}>
                              <Text style={{ fontWeight: "bold" }}>Category: </Text>

                              <Text style={{ fontSize: 12 }}>{item.skill_name}</Text>

                            </View>




                            <View style={{ justifyContent: "space-between", marginRight: 10, flexDirection: "row" }}>

                              {/* <Text style={{ width: '85%', fontSize: 12, fontWeight:"bold" }}>
                              Price:
                           <Text style={{ fontSize: 12  }}>{' ' + item.price}</Text>
                              </Text> */}
                              <View style={{ flex: 1, justifyContent: "flex-start" }}>

                                {/* <Image
                                  style={[
                                    { width: 40, height: 40, borderRadius: 32, }
                                  ]}
                                  source={{ uri: item.client_image }} /> */}

                              </View>


                              <View style={{ flexDirection: 'row', width: '85%', flex: 1, alignSelf: "center", justifyContent: "flex-end" }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold" }}>Starting at: </Text>
                                <Text style={{ fontSize: 12 }}>{' ' + item.price} Rs</Text>

                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
            />

          </View>

        </ScrollView>


        
        <View>
          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={false}
            visible={this.state.videoModal}
            onRequestClose={() => {
              this.setState({ videoModal: false });
            }}>

            <View style={{ padding: 5, alignSelf: 'center' }}>

              <Video source={{ uri: this.state.videoLink }}
                ref={(ref) => { this.player = ref }}
                onLoad={this.onLoad}
                onProgress={this.onProgress}
                paused={this.state.paused}
                onEnd={this.onEnd}
                style={{ height: 300, width: 300 }}
                repeat={true}
              />
              <Slider
                value={this.state.currentTime}
                minimumValue={0}
                maximumValue={this.state.duration}
                onSlidingComplete={value => this.onSeeking(value)}
                trackStyle={styles.trackStyle}
                thumbStyle={styles.thumbStyle}
                minimumTrackTintColor='#333' />
              <View style={styles.timeDurationContainer}>
                <Text>{this.msToTime(this.state.currentTime)}</Text>
                <Text>{this.msToTime(this.state.duration)}</Text>
              </View>

              <View style={styles.bContainer}>
                <TouchableOpacity style={styles.btnContainer} onPress={() => this.onPause()}>
                  {!this.state.paused ? (
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={require('../Logos/pause.png')} />
                  ) : (
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={require('../Logos/play.png')} />
                    )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>


        <View>
          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={false}
            visible={this.state.imageModal}
            onRequestClose={() => { this.setState({ imageModal: false }) }}>
            <View style={{ padding: 5, alignSelf: 'center' }}>
              <ImageZoom cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={windowWidth * 1}
                imageHeight={windowHeight * 1}>
                <Image style={{
                  height: windowHeight * 1,
                  width: windowWidth * 1,
                  resizeMode: "contain"
                }} source={{ uri: this.state.ImageLink }} />
              </ImageZoom>
            </View>
          </Modal>
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  typeHeading: {
    alignSelf: 'center',
    fontSize: 10,
    paddingVertical: 5
  }
})
export default withNavigation(ViewAllGigs);
