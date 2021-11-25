import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions, ToastAndroid
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-community/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profId: '',
      orderId: '',
      uid: '',
      completion: '100%',
      edit: 'false',
      fName: '',
      dob: '',
      about: '',
      address: '',
      userphoto: '',
      avgrating: '',
      edu: [],
      lang: [],
      spec: [],
      trans: [],
      work: [],
      img: [],
      reviews: [],
      imgs: '',
      imageFullModal: false,
      largePhoto: '',
      onback: false,
      from: '',
      spend_s: '',
      earned_s: ''
    };
  }
  async componentDidMount() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    await this.setState({ width3rd: Math.round(screenWidth / 3) })
    const value = await AsyncStorage.getItem('userID')
    await this.setState({ uid: value })
    console.log(this.state.uid)
    var from = this.props.navigation.getParam('From', '0');
    var profileId = this.props.navigation.getParam('ProfileId', '0');
    var orderId = this.props.navigation.getParam('OrderId', '0');
    var type = this.props.navigation.getParam('Type', '0');
    await this.setState({ profId: profileId, orderId: orderId, from: from })
    if (type === '1') {
      this.setState({ edit: '1' })
    }
    console.log(this.state.profId)
    await this.fetchpost();
    this.setState({ onback: true })
  }

  async savePhoto() {
    var uploaddata = []
    await uploaddata.push({ 'name': 'image', 'filename': 'photo', 'type': this.state.imgs.mime, 'data': this.state.imgs.data });
    await uploaddata.push({ 'name': 'uid', 'data': this.state.uid })
    const url = 'https://www.hazirsir.com/web_service/upload_dp.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
          console.log(responseJson);
          console.log(responseJson.data)
          if (responseJson.data === '"Record created successfully" ') {
            // this.onPost();
            ToastAndroid.show(responseJson.data, ToastAndroid.SHORT)
          } else {
            ToastAndroid.show(responseJson.data, ToastAndroid.SHORT)
          }
          return responseJson;
        })
        .catch((error) => {
          reject(error);
          console.log(error);

          return error;
        });
    }.bind(this));
  }
  openGal() {
    ImagePicker.openPicker({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      mediaType: 'photo',
      includeBase64: true,
      multiple: false,
      // cropping:true
    }).then(async images => {
      console.log(images);
      await this.setState({ imgs: images })
      await this.savePhoto()
      this.fetchpost()
      console.log(this.state.imgs)
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
      await this.setState({ imgs: image })
      // await this.state.imgs.push(image)
      await this.savePhoto()
      this.fetchpost()
      console.log(this.state.imgs)
    });
  }





  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }


  async fetchpost() {
    console.log(this.state.profId)
    const url = 'https://www.hazirsir.com/web_service/read_profile.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [this.state.profId],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        await this.setState({
          fName: responseJson[0][0].name,
          about: responseJson[0][0].about_me,
          dob: responseJson[0][0].dob,
          address: responseJson[0][0].address,
          userphoto: responseJson[0][0].photo,
          avgrating: responseJson[0][0].average_rating,
          spend_s: responseJson[0][0].spent,
          earned_s: responseJson[0][0].earned,
          edu: responseJson[1],
          lang: responseJson[2],
          spec: responseJson[3],
          trans: responseJson[4],
          work: responseJson[5],
          img: responseJson[6],
          reviews: responseJson[7],
        })
        console.log(this.state.lang)

        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }
  openImage(a) {
    this.setState({ imageFullModal: true, largePhoto: a })
  }
  render() {

    var name = this.state.fName;
    if (name == null) {
      name = "NA";
    } else {
      name = name.split(' ')[0]
    }


    return (
      <View>
        <ScrollView>
          <View style={styles.header}></View>
          <View style={styles.icon}>
            {
              this.state.edit === '1' ?
                <View style={{ height: 40, width: 80 }}>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditProf') }}>

                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../Logos/editProf2.png')} />
                    <Text>Edit</Text>
                  </TouchableOpacity>
                </View>
                : null
            }
          </View>
          {
            this.state.userphoto ?
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => { this.openImage(this.state.userphoto) }}
              >
                <Image style={styles.avatar, {
                  height: 130, width: 130, borderRadius: 63,
                  borderWidth: 4,
                  borderColor: "white",
                  marginBottom: 10,
                }}
                  source={{ uri: this.state.userphoto }} />
              </TouchableOpacity> : null
          }
          {
            this.state.edit === '1' ?
              <View style={[styles.avatarPic, { paddingHorizontal: 0, paddingLeft: 10, height: 80, justifyContent: 'space-evenly' }]}>
                <TouchableOpacity onPress={() => this.openCam()}>
                  <Image style={{ width: 20, height: 20 }} source={require('../Logos/openCam2.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openGal()}>
                  <Image style={{ width: 23, height: 30 }} source={require('../Logos/addPhotos.png')} />
                </TouchableOpacity>
              </View> :
              null
          }








          <View style={styles.body}>
            <View style={styles.bodyContent}>

              <Text style={styles.name}>{name}</Text>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewRating', { reviews: this.state.reviews })}>
                <View style={{ height: 40, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ height: 40, width: '65%', justifyContent: 'center' }}>
                    <Rating readonly={true} startingValue={this.state.avgrating} imageSize={30} />
                  </View>
                  <View style={{ width: '25%', justifyContent: 'center' }}>
                    <Text>{this.state.reviews.length + ' reviews'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewRating', { reviews: this.state.reviews })}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ fontSize: 10 }}>{'View all reviews'}</Text>
                </View>
              </TouchableOpacity>
              {/* {
                    this.state.profId!==this.state.uid && this.state.edit!=='1' && this.state.from!=='Offers'?
                    <View style={{height:30, width:'40%', borderRadius:5, backgroundColor:'#cfcfcf', alignItems:'center', justifyContent:'center'}}>
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Chat', {ChatName:this.state.fName, Prof:this.state.profId, Order:this.state.orderId})}}>
                        <Text style={{fontSize:10}}>Start Conversation</Text>
                      </TouchableOpacity>
                    </View>:null
                  }  */}
            </View>
          </View>




          <View style={{ flexDirection: 'row', flex: 1, marginTop: -10, marginBottom: 5, marginLeft: 10, marginRight: 10, backgroundColor: '#32a84e', borderRadius: 20,}}>


            <View style={{ flex: 1 , marginLeft: -10}}>

              <View style={{ padding: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' , textAlign: 'center', color: 'white'}}>EARNED</Text>
                <Text style={{ fontSize: 15, marginTop: 4, textAlign: 'center', color: 'white' }}>{this.state.earned_s}</Text>
              </View>

            </View>


            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' , marginRight: 10}}>

              <View style={{ padding: 5, marginRight: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' , color: 'white'}}>SPEND</Text>
                <Text style={{ fontSize: 15, marginTop: 4, textAlign: 'center' , color: 'white'}}>{this.state.spend_s}</Text>
              </View>

            </View>



          </View>





          <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
            <Text style={{ fontSize: 12 }}>{'Full Name: ' + this.state.fName}</Text>
          </View>
          <View style={{ width: '100%', padding: 5, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>ABOUT</Text>
          </View>
          <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15 }}>{this.state.about}</Text>
          </View>
          <View style={{ width: '100%', padding: 5, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>PORTFOLIO</Text>
          </View>

          {Array.isArray(this.state.img) ?
            <View style={{ flex: 1, padding: 10 }}>
              <View>
                <FlatGrid
                  itemDimension={Number(this.state.width3rd) - 15}
                  items={this.state.img}
                  spacing={3}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => { this.openImage(item.title) }}
                    >
                      <View style={{ padding: 5, alignSelf: 'center' }}>
                        <Image
                          style={{ width: 100, height: 100 }}
                          source={{ uri: item.title }} />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View> : null
          }

          <View style={{ width: '100%', padding: 5, justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>SKILLS</Text>
          </View>

          {/* {this.state.lang.map((a)=>{return (
              <View>
                {
                  Array.isArray(this.state.lang)?
                  <View style={{width:'100%', padding:10, justifyContent:'center'}}>
                    <Text style={{fontSize:15}}>{a.title}</Text>
                  </View>:null
                }
              </View>
            )})} */}

          {
            this.state.edu.length > 0 ?
              <View>
                <View style={{ width: '100%', borderTopColor: '#cfcfcf', borderTopWidth: 1, padding: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>EDUCATION</Text>
                </View>
                <FlatList
                  data={this.state.edu}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {
                          this.state.edu.length > 0 ?
                            <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 12 }}>{item.title}</Text>
                            </View> : null
                        }
                      </View>
                    )
                  }}
                />
              </View> : null
          }
          {
            this.state.lang.length > 0 ?
              <View>
                <View style={{ width: '100%', borderTopColor: '#cfcfcf', borderTopWidth: 1, padding: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>LANGUAGE</Text>
                </View>
                <FlatList
                  data={this.state.lang}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {
                          this.state.lang.length > 0 ?
                            <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 12 }}>{item.title}</Text>
                            </View> : null
                        }
                      </View>
                    )
                  }}
                />
              </View> : null
          }

          {
            this.state.edu.length > 0 ?
              <View>
                <View style={{ width: '100%', borderTopColor: '#cfcfcf', borderTopWidth: 1, padding: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>TRANSPORTATION</Text>
                </View>
                <FlatList
                  data={this.state.trans}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {
                          this.state.trans.length > 0 ?
                            <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 12 }}>{item.title}</Text>
                            </View> : null
                        }
                      </View>
                    )
                  }}
                />
              </View> : null
          }


          {
            this.state.spec.length > 0 ?
              <View>
                <View style={{ width: '100%', borderTopColor: '#cfcfcf', borderTopWidth: 1, padding: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>SPECIALITIES</Text>
                </View>
                <FlatList
                  data={this.state.spec}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {
                          this.state.spec.length > 0 ?
                            <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 12 }}>{item.title}</Text>
                            </View> : null
                        }
                      </View>
                    )
                  }}
                />
              </View> : null
          }



          {
            this.state.work.length > 0 ?
              <View>
                <View style={{ width: '100%', borderTopColor: '#cfcfcf', borderTopWidth: 1, padding: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>WORK HISTORY</Text>
                </View>
                <FlatList
                  data={this.state.work}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {
                          this.state.work.length > 0 ?
                            <View style={{ width: '100%', padding: 10, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 12 }}>{item.title}</Text>
                            </View> : null
                        }
                      </View>
                    )
                  }}
                />
              </View> : null
          }



          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={false}
            visible={this.state.imageFullModal}
            onRequestClose={() => {
              this.setState({ imageFullModal: false, largePhoto: '' });
            }}>
            {
              this.state.largePhoto !== '' ?
                <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
                  <Image
                    style={[
                      { width: '100%', height: '100%', resizeMode: 'contain' }
                    ]}
                    source={{ uri: this.state.largePhoto }} />
                </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Loading</Text>
                </View>
            }
          </Modal>
          <NavigationEvents
            onWillFocus={this.state.onback ? () => this.fetchpost() : null}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: "#32a84e",
    height: 200,
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingTop: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  avatarPic: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    position: 'absolute',
    marginTop: 157, marginLeft: (Math.round(Dimensions.get('window').width) / 2) + 50, padding: 10
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 20,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
});
export default Profile;
