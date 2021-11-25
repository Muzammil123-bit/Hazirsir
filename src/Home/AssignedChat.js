import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet, View, Alert, Text, BackHandler, TouchableOpacity, Image, Modal, Dimensions
} from 'react-native';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { FlatGrid } from 'react-native-super-grid';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
let funcRep = null;
class AssignedChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      uid: '',
      posterId: '',
      chatName: '',
      chats: [],
      contentType: 'message',
      funcRep: null,
      Img: [],
      photoSelect: false,
      imageFullModal: false,
      taskTitle: '',
      dueDate: '',
      skillName: '',
      taskDesc: '',
      type: 'poster',
      taskPhotos: false,
      start: false,
      working: false,
      end: false,
      detailsModal: false,
      imgs: [],
      startImgs: [],
      workingImgs: [],
      endImgs: [],
      status_s: ''

    };
  }
  goBack() {
    console.log('back')
    clearInterval(funcRep)
    this.props.navigation.pop()
  }
  async componentDidMount() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    await this.setState({ width3rd: Math.round(screenWidth / 3) })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
      await this.goBack(); // works best when the goBack is async
      this.backHandler.remove()
      return true;
    });
    funcRep = setInterval(() => this.sendToServer(), 5000);
    var prof = this.props.navigation.getParam('Prof', '0');
    var ord = this.props.navigation.getParam('Order', '0');
    var name = this.props.navigation.getParam('ChatName', ' ');
    var skill = this.props.navigation.getParam('Skill', '0');
    var title = this.props.navigation.getParam('Title', '0');
    var type = this.props.navigation.getParam('Type', '0');
    var desc = this.props.navigation.getParam('Desc', '0');
    var date = this.props.navigation.getParam('Date', ' ');
    var from = this.props.navigation.getParam('From', ' ');
    var status_ = this.props.navigation.getParam('status', ' ');
    const value = await AsyncStorage.getItem('userID')

    if( status_ === "approved")
    {
      this.setState({status_s: "completed"})
    }
    else
    {
      this.setState({status_s: status_})

    }

    await this.setState({
      type: type,
      orderId: ord,
      posterId: prof,
      uid: value,
      chatName: name,
      taskTitle: title,
      dueDate: date,
      skillName: skill,
      taskDesc: desc,
      from: from,
      

    })
    //completed
    console.warn(status_);
    await this.sendToServer()
    await this.getWorkImages()
    console.log(this.state)
    if (this.state.chats.length > 0) {
      var arr = this.state.chats
      arr = this.state.chats.map(a => {
        const message = {};
        message.text = a.content_type === 'photo' ? a.text : ''
        return message
      })
      console.log(arr)
      console.log(this.state.chats)
    }
  }




  async onSendImage2() {
    console.log(this.state.uid);;
    var uploaddata = []
    for (var i = 0; i < this.state.imgs.length; ++i) {
      await uploaddata.push({ 'name': 'image[]', 'filename': 'photo' + [i], 'type': this.state.imgs[i].mime, 'data': this.state.imgs[i].data });
    }
    await uploaddata.push({ 'name': 'uid', 'data': this.state.uid });
    await uploaddata.push({ 'name': 'order_id', 'data': this.state.orderId });
    if (this.state.start) {
      await uploaddata.push({ 'name': 'type', 'data': 'start' });
    } else if (this.state.working) {
      await uploaddata.push({ 'name': 'type', 'data': 'center' });
    } else {
      await uploaddata.push({ 'name': 'type', 'data': 'end' });
    }
    console.log(uploaddata)

    const url = 'https://www.hazirsir.com/web_service/upload_task_image.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
          console.log("responseeeeee" + responseJson);
          // Alert.alert(responseJson.data);
          //   console.log(responseJson.data)
          var aa = this.state.imgs
          // alert(JSON.stringify(aa[0].path)+" hh "+responseJson.data);
          if (responseJson.data.toString().includes("created successfully")) {



            this.setState({ imgs: [], Img: [] })
            this.sendToServer()



            this.delPhotoForWork(aa[0].path);


          }
          //   this.setState({loadingModal:false})
          return responseJson;
        })
        .catch((error) => {
          reject(error);
          console.log(error);

          return error;
        });
    }.bind(this));

  }
  async onSend2(messages = []) {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    console.log(this.state)
  }
  async onSendImage() {
    console.log(this.state.uid);;
    var uploaddata = []
    for (var i = 0; i < this.state.Img.length; ++i) {
      await uploaddata.push({ 'name': 'image[]', 'filename': 'photo' + [i], 'type': this.state.Img[i].mime, 'data': this.state.Img[i].data });
    }
    await uploaddata.push({ 'name': 'receiver_id', 'data': this.state.posterId });
    await uploaddata.push({ 'name': 'sender_id', 'data': this.state.uid });
    await uploaddata.push({ 'name': 'order_id', 'data': this.state.orderId });
    await uploaddata.push({ 'name': 'content_type', 'data': 'photo' });
    await uploaddata.push({ 'name': 'content', 'data': 'NA' });
    console.log(uploaddata)
    
    const url = 'https://www.hazirsir.com/web_service/add_assigned_task_chat.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
          //   console.log(responseJson.data)
          if (responseJson.data === '"Record created successfully" ') {
            this.setState({ photoSelect: false, Img: [] })
            this.sendToServer()
          }
          //   this.setState({loadingModal:false})
          return responseJson;
        })
        .catch((error) => {
          reject(error);
          console.log(error);

          return error;
        });
    }.bind(this));

  }
  async onSend(messages) {
    console.log(messages);
    console.log(this.state.uid);;
    var uploaddata = []
    if (this.state.contentType === 'photo') {
      this.setState({ imgStat: 'yes' })
      for (var i = 0; i < this.state.Img.length; ++i) {
        await uploaddata.push({ 'name': 'image[]', 'filename': 'photo' + [i], 'type': this.state.Img[i].mime, 'data': this.state.Img[i].data });
      }
    }
    await uploaddata.push({ 'name': 'receiver_id', 'data': this.state.posterId });
    await uploaddata.push({ 'name': 'sender_id', 'data': this.state.uid });
    await uploaddata.push({ 'name': 'order_id', 'data': this.state.orderId });
    if (this.state.contentType === 'message') {
      await uploaddata.push({ 'name': 'content', 'data': messages.text });
    }
    await uploaddata.push({ 'name': 'content_type', 'data': this.state.contentType });
    // console.warn("qwqwqwqwqwqwqwqwq   "+JSON.stringify(uploaddata))

    const url = 'https://www.hazirsir.com/web_service/add_assigned_task_chat.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
          // Alert.alert(responseJson.data);

          if (responseJson.data.includes("Record created successfully")) {
            this.sendToServer()
          console.warn("responseJson");

          }
          //   this.setState({loadingModal:false})


          return responseJson;
        })
        .catch((error) => {
          reject(error);
          console.log(error);

          return error;
        });
    }.bind(this));

  }
  async sendToServer() {
    // console.warn('chattttttt '+JSON.stringify(this.state.posterId)+" "+JSON.stringify(this.state.uid))
    const url = 'https://www.hazirsir.com/web_service/read_assigned_chat.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [this.state.uid, this.state.posterId, this.state.orderId],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson)
        if (responseJson !== 'Record doesnot exist') {
          if (this.state.chats.join('') !== responseJson.join(''))
            await this.setState({ chats: [] })
          await this.setState({ chats: responseJson })
        }
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
    // console.log(funcRep)
  }
  async getWorkImages() {
    console.log('workImg')
    const url = 'https://www.hazirsir.com/web_service/read_task_image.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [this.state.uid, this.state.orderId],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson)
        if (responseJson !== 'Record doesnot exist') {
          await this.setState({
            startImgs: responseJson[0],
            workingImgs: responseJson[1],
            endImgs: responseJson[2]
          })


        }
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
    // console.log(funcRep)
  }
  renderSend = (props) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.7 }}>

        <Send
          {...props}>
          <View style={{ padding: 5 }}>
            {/* <TouchableOpacity onPress={()=>this.onSend(message)}> */}
            <Image style={{ height: 30, width: 30, padding: 5 }} source={require('../Logos/sendComment.png')} />
            {/* </TouchableOpacity> */}
          </View>
        </Send>
        <View style={{ padding: 5 }}>
          <TouchableOpacity onPress={() => this.setState({ photoSelect: true })}>
            <Image style={{ height: 30, width: 30, padding: 5 }} source={require('../Logos/pic.png')} />
          </TouchableOpacity>
        </View>

        
      </View>

    );
    return null;
  }
  renderBubble(props) {
    return (<Bubble {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#32a843'
        }
      }} />)
  }
  openGalForWork() {
    ImagePicker.openPicker({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      mediaType: 'photo',
      includeBase64: true,
      multiple: false
    }).then(async images => {
      console.log(images);
      var temp = []
      temp[0] = images
      await this.setState({ imgs: temp })
      console.log(this.state.imgs)
    });
  }
  openCamForWork() {
    ImagePicker.openCamera({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      includeBase64: true,
      // cropping:true
    }).then(async image => {
      console.log(image);
      var temp = this.state.imgs
      temp[0] = image
      this.setState({ Img: temp })
      console.log(this.state.imgs)
    });
  }
  async delPhotoForWork(a) {

    // alert(a);

    const filteredItems = this.state.imgs.filter(function (item) {
      return item.path !== a
    })
    await this.setState({ imgs: filteredItems })
    console.log(this.state.imgs)

  }








  openGal() {
    ImagePicker.openPicker({
      compressImageMaxHeight: 700,
      compressImageMaxWidth: 700,
      compressImageQuality: 0.35,
      mediaType: 'photo',
      includeBase64: true,
      multiple: true
    }).then(async images => {
      console.log(images);
      var temp = []
      temp[0] = images
      await this.setState({ Img: temp })
      console.log(this.state.Img)
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
      var temp = this.state.Img
      temp[0] = image
      this.setState({ Img: temp })
      console.log(this.state.Img)
    });
  }
  openImage(a) {
    this.setState({ imageFullModal: true, largePhoto: a })
    // this.openImage(item.title)
  }
  async delPhoto(a) {
    const filteredItems = this.state.Img.filter(function (item) {
      return item.path !== a
    })
    await this.setState({ Img: filteredItems })
    console.log(this.state.Img)

  }
  render() {
    // Alert.alert(this.state.skillName);
    return (
      <View style={{ flex: 1, opacity: this.state.photoSelect ? 0.4 : 1 }}>
        <View style={{ paddingVertical: 5, width: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 12 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Bold' }}>Task:{' '}</Text>
            <Text style={{ fontSize: 12 }}>{this.state.taskTitle}</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 12 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Bold' }}>Work:{' '}</Text>
            <Text style={{ fontSize: 12 }}>{this.state.skillName}</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 12, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Bold' }}>Due date:{' '}</Text>
              <Text style={{ fontSize: 12 }}>{this.state.dueDate}</Text>
            </View>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: '#087420', borderColor: "#087420" }}>
              <TouchableOpacity onPress={() => this.setState({ detailsModal: true })}>
                <View style={{ flexDirection: 'row', width: '100%', height: 16, alignSelf: 'center', justifyContent: 'center', marginTop: 4 }}>
                  <Text style={{ color: 'white', marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Requirements
                        </Text>
                  <Image
                    style={[{ width: 12, height: 12, marginLeft: 3 }]}
                    source={require('../Logos/openTask.png')} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ width: '100%', backgroundColor: '#f5f5f5', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10 }}>
          <View style={{ marginHorizontal: 5, width: '33%', borderWidth: this.state.startImgs.length > 0 ? 0 : 1, borderRadius: 5, backgroundColor: this.state.startImgs.length > 0 ? '#32a84e' : 'white' }}>
            <TouchableOpacity onPress={() => this.setState({ taskPhotos: true, start: true })}>
              <View style={{ flexDirection: 'row', width: '100%', height: 16, alignSelf: 'center', justifyContent: 'center', marginTop: 4 }}>
                <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11, color: this.state.startImgs.length > 0 ? 'white' : 'black' }}>
                  Start pic
                        </Text>
                <Image
                  style={[
                    { width: 12, height: 12, marginLeft: 3 }
                  ]}
                  source={require('../Logos/openTask.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: 5, width: '33%', borderWidth: this.state.workingImgs.length > 0 ? 0 : 1, borderRadius: 5, backgroundColor: this.state.workingImgs.length > 0 ? '#32a84e' : 'white' }}>
            <TouchableOpacity onPress={() => this.setState({ taskPhotos: true, working: true })}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11, color: this.state.workingImgs.length > 0 ? 'white' : 'black' }}>
                  Work pic
                        </Text>
                <Image
                  style={[
                    { width: 12, height: 12, marginLeft: 3 }
                  ]}
                  source={require('../Logos/assignedTask.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: 5, width: '33%', borderWidth: this.state.endImgs.length > 0 ? 0 : 1, borderRadius: 5, backgroundColor: this.state.endImgs.length > 0 ? '#32a84e' : 'white' }}>
            <TouchableOpacity onPress={() => this.setState({ taskPhotos: true, end: true })}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11, color: this.state.endImgs.length > 0 ? 'white' : 'black' }}>
                  End pic
                        </Text>
                <Image
                  style={[
                    { width: 12, height: 12, marginLeft: 3 }
                  ]}
                  source={require('../Logos/completedTask.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* {
          this.state.status_s==='Completed'?
          <View> */}
        <GiftedChat
          showUserAvatar={true}
          messages={this.state.chats.length > 0 ? this.state.chats : []}
          onSend={messages => this.onSend(messages[0])}
          user={{
            _id: this.state.uid,
          }}
          renderBubble={this.renderBubble}
          alwaysShowSend={true}
          renderSend={this.renderSend}
          renderInputToolbar={this.state.status_s === 'completed' ? () => null : undefined}
        />
        {/* </View>:null
        } */}



        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={true}
          visible={this.state.photoSelect}
          onRequestClose={() => {
            this.setState({ photoSelect: false, Img: [] });
          }}>
          <View style={{ width: '90%', height: '100%', justifyContent: 'center', alignSelf: 'center', borderRadius: 15 }}>
            {
              this.state.Img.length > 0 ?
                <View style={[styles.inputContainer, { height: 180, flexDirection: 'column' }]}>
                  {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                  <View style={{ width: '85%', height: '70%', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <ScrollView horizontal={true}> */}
                    <FlatList
                      horizontal={true}
                      data={this.state.Img}
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
                      <TouchableOpacity onPress={() => this.openGal()}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={[
                              { marginTop: 7, width: 30, height: 30, marginLeft: 3 }
                            ]}
                            source={require('../Logos/openGal.png')} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.openCam()}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={[
                              { marginTop: 7, width: 30, height: 30, marginLeft: 3 }
                            ]}
                            source={require('../Logos/openCam.png')} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async () => { await this.onSendImage() }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={[
                              { marginTop: 7, width: 30, height: 30, marginLeft: 3 }
                            ]}
                            source={require('../Logos/sendComment.png')} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                :
                <View style={[styles.inputContainer, { paddingBottom: 10, height: 70, justifyContent: 'space-evenly' }]}>
                  {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                  <TouchableOpacity onPress={() => this.openGal()}>
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
        </Modal>




        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={false}
          visible={this.state.taskPhotos}
          onRequestClose={() => {
            this.setState({ taskPhotos: false, start: false, working: false, end: false });
          }}>
          <View style={{ flex: 1 }}>


            {this.state.type === 'tasker' && this.state.from !== 'Completed' ?
              <View>
                {
                  this.state.imgs.length > 0 ?
                    <View style={[styles.inputContainer, { height: 249, flexDirection: 'column' }]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                      <View style={{ width: '85%', height: '60%', justifyContent: 'center', alignItems: 'center' }}>
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
                                  <TouchableOpacity onPress={() => this.delPhotoForWork(item.path)}>
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

                      <View>
                      <View style={{ width: '90%'}}>
                        <View style={{ flexDirection: 'row' }}>


                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Bold', textAlignVertical: 'center' }}>You can upload multiple images</Text>
                          </View>
                          <TouchableOpacity onPress={() => this.openGalForWork()}>
                            <View style={{ flexDirection: 'row' }}>
                              <Image
                                style={[
                                  { marginTop: 7, width: 40, height: 40, marginLeft: 8 }
                                ]}
                                source={require('../Logos/openGal.png')} />
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.openCamForWork()}>
                            <View style={{ flexDirection: 'row' }}>
                              <Image
                                style={[
                                  { marginTop: 7, width: 40, height: 40, marginLeft: 8 }
                                ]}
                                source={require('../Logos/openCam.png')} />
                            </View>
                          </TouchableOpacity>

                        </View>

                      </View>

                      </View>

                        <View style={{flex: 1,flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 10}}>

                        <View style={{flex: 2}}>

                        </View>


                        <View style={{flex: 1, }}>


                        <View style={{  borderWidth:1, borderRadius:5,backgroundColor:'#d3dfe8'}}>
                        <TouchableOpacity onPress={async () => { await this.onSendImage2(); this.getWorkImages() }}> 
                  <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                      <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                      Add picture
                      </Text>
                      <Image 
                          style={[
                            {width:12, height:12, marginLeft:3}
                          ]} 
                          source={require('../Logos/sendComment.png')}/>
                  </View>
              </TouchableOpacity>
          </View>
                      
                    </View>
                    </View>

                    </View>
                    :
                    <View style={[styles.inputContainer, { paddingBottom: 10, height: 70, justifyContent: 'space-evenly' }]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

                      <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Bold' }}>You can upload multiple images</Text>
                      <TouchableOpacity onPress={() => this.openGalForWork()}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={[
                              { marginTop: 7, width: 50, height: 50, marginLeft: 3 }
                            ]}
                            source={require('../Logos/openGal.png')} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.openCamForWork()}>
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
              : null}


            {this.state.startImgs.length < 0 && this.state.workingImgs.length < 0 && this.state.endImgs.length < 0}
            {Array.isArray(this.state.startImgs) && this.state.startImgs.length > 0 && this.state.start ?
              <View style={{ padding: 10 }}>
                <View>
                  <FlatGrid
                    itemDimension={Number(this.state.width3rd) - 15}
                    items={this.state.startImgs}
                    spacing={3}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => { this.openImage(item.name) }}
                      >
                        <View style={{ padding: 5, alignSelf: 'center' }}>
                          <Image
                            style={{ width: 100, height: 100 }}
                            source={{ uri: item.name }} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View> : null
            }
            {Array.isArray(this.state.workingImgs) && this.state.workingImgs.length > 0 && this.state.working ?
              <View style={{ padding: 10 }}>
                <View>
                  <FlatGrid
                    itemDimension={Number(this.state.width3rd) - 15}
                    items={this.state.workingImgs}
                    spacing={3}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => { this.openImage(item.name) }}
                      >
                        <View style={{ padding: 5, alignSelf: 'center' }}>
                          <Image
                            style={{ width: 100, height: 100 }}
                            source={{ uri: item.name }} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View> : null
            }
            {Array.isArray(this.state.endImgs) && this.state.endImgs.length > 0 && this.state.end ?
              <View style={{ padding: 10 }}>
                <View>
                  <FlatGrid
                    itemDimension={Number(this.state.width3rd) - 15}
                    items={this.state.endImgs}
                    spacing={3}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => { this.openImage(item.name) }}
                      >
                        <View style={{ padding: 5, alignSelf: 'center' }}>
                          <Image
                            style={{ width: 100, height: 100 }}
                            source={{ uri: item.name }} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View> : null
            }
          </View>
        </Modal>

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

        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={false}
          visible={this.state.detailsModal}
          onRequestClose={() => {
            this.setState({ detailsModal: false });
          }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{'Task Details: ' + this.state.taskDesc}</Text>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    margin: 10
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
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
  input: {
    height: 45,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
    borderBottomColor: '#cfcfcf',
    borderBottomWidth: 1,
    marginBottom: 5
  },
  inputContainer: {
    alignSelf: 'center',
    padding: 5,
    borderColor: '#cfcfcf',
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderRadius: 15,
    width: '100%',
    height: 45,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
});
export default AssignedChat;
