import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  Modal,
  Dimensions,
  Alert
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-community/async-storage';  
import { Rating, AirbnbRating } from 'react-native-ratings';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profId:'',
      uid:'',
      skill:'',
      menu:[
        {key:0, name:'Transportation', func:'0', stat:false},
        {key:1, name:'Languages', func:'1', stat:false},
        {key:2, name:'Education', func:'2', stat:false},
        {key:3, name:'Work History', func:'3', stat:false},
        {key:4, name:'Specialities', func:'4', stat:false},
      ],
      fName:'',
      about:'',
      address:'',
      dob:'',
      edu:[],
      lang:[],
      spec:[],
      trans:[],
      work:[],
      img:[],
      imgs:[],
      imageFullModal:false,
    };
  }
  async componentDidMount(){
    const screenWidth = Math.round(Dimensions.get('window').width);
    await this.setState({width3rd:Math.round(screenWidth/3)})
    const value = await AsyncStorage.getItem('userID')
    await this.setState({uid:value})
    console.log(this.state.uid)
    await this.fetchpost();
  }
  async transport(){
    console.log('trans')
  }
  async lang(){
    console.log('lang')
  }
  async edu(){
    console.log('edu')
  }
  async work(){
    console.log('work')
  }
  async spec(){
    console.log('spec')
  }

  
  async menu(a){
    if(a==='0'){
      this.transport()
    }else if(a==='1'){
      this.lang()
    }else if(a==='2'){
      this.edu()
    }else if(a==='3'){
      this.work()
    }else if(a==='4'){
      this.spec()
    }
    var temp=this.state.menu
    temp[a].stat=!temp[a].stat
    await this.setState({menu:temp})
  }





  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }
  async fetchpost(){
    
    const url='https://www.hazirsir.com/web_service/read_profile.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
            console.log(responseJson);
            this.setState({
              fName:responseJson[0][0].name,
              about:responseJson[0][0].about_me,
              dob:responseJson[0][0].dob,
              address:responseJson[0][0].address,
              edu:responseJson[1],
              lang:responseJson[2],
              spec:responseJson[3],
              trans:responseJson[4],
              work:responseJson[5],
              img:responseJson[6],
            })
            return responseJson;
        })
        .catch((error) => {
            // reject(error);
            console.log(error);

            return error;
    });
  }
  async savePhoto(){
    var uploaddata=[]
    if(this.state.imgs.length>0){
      // this.setState({imgStat:'yes'})
      for (var i=0; i < this.state.imgs.length ; ++i){
        await uploaddata.push({'name':'image[]', 'filename': 'photo'+[i], 'type':this.state.imgs[i].mime, 'data':this.state.imgs[i].data});
      }
    }
    await uploaddata.push({'name':'uid','data' :this.state.uid})
    const url='https://www.hazirsir.com/web_service/add_portfolio_image.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
            // this.onPost();
            this.setState({imgs:[]});
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
  async addSkill(type, skill){
    const url='https://www.hazirsir.com/web_service/add_profile_details.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    if(skill.length>1){
      await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            z: [type, this.state.uid, skill],
        })
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
            console.log(responseJson);
            if(responseJson==='Added successfully'){
              await this.setState({skill:''})
              this.fetchpost()
            }else if(responseJson==='Details already exist!'){
              ToastAndroid.show('This already exists', ToastAndroid.SHORT);
            }else{
              ToastAndroid.show(responseJson, ToastAndroid.SHORT);
            }
            return responseJson;
        })
        .catch((error) => {
            // reject(error);
            console.log(error);

            return error;
      });
    }else{
      ToastAndroid.show('The entry should have at least 2 letters', ToastAndroid.SHORT);
    }
  }

  async deleteSkill(type, id){
    const url='https://www.hazirsir.com/web_service/delete_profile.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    
      await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            z: [type, this.state.uid, id],
        })
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
            console.log(responseJson);
            if(responseJson==='record deleted successfully'){
              // await this.setState({skill:''})
              this.fetchpost()
            }else if(responseJson==='Details already exist!'){
              ToastAndroid.show('This already exists', ToastAndroid.SHORT);
            }else{
              ToastAndroid.show(responseJson, ToastAndroid.SHORT);
            }
            return responseJson;
        })
        .catch((error) => {
            // reject(error);
            console.log(error);

            return error;
      });
  }
  async save(){
    const url='https://www.hazirsir.com/web_service/update_profile.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            z: [this.state.uid, this.state.fName, this.state.about, this.state.address, this.state.dob],
        })
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
            console.log(responseJson);
            if(responseJson==='Record created successfully'){
              this.props.navigation.goBack()
              // this.props.navigation.state.params.fetchpost();
            }else if(responseJson==='Details already exist!'){
              ToastAndroid.show('This already exists', ToastAndroid.SHORT);
            }else{
              ToastAndroid.show(responseJson, ToastAndroid.SHORT);
            }
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
            return error;
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
  async delPhoto(a){
    const filteredItems = this.state.imgs.filter(function(item) {
      return item.path !== a
    })
    await this.setState({imgs:filteredItems})
    console.log(this.state.imgs)

  }
  openImage(a){
    this.setState({imageFullModal:true, largePhoto:a})
  }
  deletePhoto(id){
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this from your Portfolio?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: ()=> this.deleteSkill('Portfolio', id)},
      ],
      { cancelable: false }
    )
  }
  render() {
    return (
      <View>
        <ScrollView>
        <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'space-between',alignItems:'center', flexDirection:'row'}}>
          
          <View style={{paddingRight:10}}>
            <TouchableOpacity onPress={()=>{this.save()}}>
              <Image style={{height:30, width:30, padding:5, resizeMode:'contain'}} source={require('../../Logos/save.png')}/>
              <Text>Save</Text>

            </TouchableOpacity>
          </View>
        </View>
        <View style={{width:'100%', padding:10, justifyContent:'center'}}>
          <Text style={{fontSize:10, fontWeight:'bold'}}>General information</Text>
        </View>
        
        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>FULL NAME</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            style={{height:45}}
            value={this.state.fName}
            onChangeText={(fName) => this.setState({fName})}
            placeholder="Enter your full name here"
            underlineColorAndroid='transparent'/>
        </View>

        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>ABOUT ME</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            style={{height:45}}
            value={this.state.about}
            onChangeText={(about) => this.setState({about})}
            placeholder="Introduce yourself"
            underlineColorAndroid='transparent'/>
        </View>

        <View style={{width:'100%', padding:10, justifyContent:'center'}}>
          <Text style={{fontSize:10, fontWeight:'bold'}}>Private information</Text>
        </View>
        
        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>ADDRESS</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            style={{height:45}}
            value={this.state.address}
            onChangeText={(address) => this.setState({address})}
            placeholder="State your full Address"
            underlineColorAndroid='transparent'/>
        </View>

        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>DATE OF BIRTH</Text>
        </View>
        <View style={styles.input}>
          <TextInput
            style={{height:45}}
            value={this.state.dob}
            onChangeText={(dob) => this.setState({dob})}
            placeholder="When were you born?"
            underlineColorAndroid='transparent'/>
        </View>
        <View style={{width:'100%', padding:10, justifyContent:'center'}}>
          <Text style={{fontSize:10, fontWeight:'bold'}}>Additional information</Text>
        </View>
        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>PORTFOLIO</Text>
        </View>
        {Array.isArray(this.state.img)?
          <View style={{flex:1, padding:10}}> 
              <View>
                  <FlatGrid
                  itemDimension={Number(this.state.width3rd)-15}
                  items={this.state.img}
                  spacing={3}
                  renderItem={({item}) => (
                      <TouchableOpacity 
                      onPress={()=>{this.openImage(item.title)}}
                      >
                          <View style={{padding:5, alignSelf:'center'}}>
                              {/* <Image 
                                  style={{width:100, height:100, resizeMode:'contain'}} 
                                  source={{uri:item.title}}/> */}
                              <ImageBackground
                                style={[
                                  {width:100, height:100, resizeMode:'contain'}
                                ]} 
                                source={{uri:item.title}}
                              >
                                <TouchableOpacity onPress={()=>{this.deletePhoto(item.id)}}>
                                  <View style={{margin:5}}>
                                    <Image 
                                      style={[
                                          {width:25, height:25, marginLeft:3}
                                      ]} 
                                      source={require('../../Logos/delPhoto.png')}/>
                                  </View>
                                </TouchableOpacity>
                              </ImageBackground>
                          </View>
                      </TouchableOpacity>
                  )}
                  />
              </View>
          </View>:null
        }
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
                                                source={require('../../Logos/delPhoto.png')}/>
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
                                  source={require('../../Logos/openGal.png')}/>
                      </View>
                    </TouchableOpacity>  
                    <TouchableOpacity onPress={()=>this.openCam()}>
                      <View style={{flexDirection:'row'}}>
                            <Image 
                                  style={[
                                      {marginTop:7, width:30, height:30, marginLeft:3}
                                  ]} 
                                  source={require('../../Logos/openCam.png')}/>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async ()=>{await this.savePhoto();this.fetchpost()}}>
                      <View style={{flexDirection:'row'}}>
                            <Image 
                                  style={[
                                      {marginTop:7, width:30, height:30, marginLeft:3}
                                  ]} 
                                  source={require('../../Logos/sendComment.png')}/>
                      </View>
                    </TouchableOpacity> 
                  </View> 
                </View>
            </View>
            :
            <View style={[styles.inputContainer, {paddingBottom:10, height:70, justifyContent:'space-evenly'}]}>
                {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                
                  <TouchableOpacity onPress={()=>this.selectImages()}>
                    <View style={{flexDirection:'row'}}>
                          <Image 
                                style={[
                                    {marginTop:7, width:50, height:50, marginLeft:3}
                                ]} 
                                source={require('../../Logos/openGal.png')}/>
                    </View>
                  </TouchableOpacity>  
                  <TouchableOpacity onPress={()=>this.openCam()}>
                    <View style={{flexDirection:'row'}}>
                          <Image 
                                style={[
                                    {marginTop:7, width:50, height:50, marginLeft:3}
                                ]} 
                                source={require('../../Logos/openCam.png')}/>
                    </View>
                  </TouchableOpacity> 
            </View>
          }
        </View>
        <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
          <Text style={{fontSize:10}}>SKILLS</Text>
        </View>
          <View style={{width:'100%'}}>
            <FlatList 
              enableEmptySections={true}
              data={this.state.menu}
              renderItem={({item}) => {
                  // const rowData=service.image;
                  return (
                      <View style={{marginTop:5}}>
                        <TouchableOpacity onPress={()=>this.menu(item.func)}>
                          <View style={{width:'100%',flexDirection:'row', padding:15, paddingBottom:20, borderBottomColor:'#cfcfcf', borderBottomWidth:0.7}}>
                            
                              <Text>
                                {item.name}
                              </Text>
                          </View>
                        </TouchableOpacity>   
                      </View>
                  )
              }
            }/>
            <FlatList 
              enableEmptySections={true}
              data={this.state.menu}
              renderItem={({item}) => {
                  // const rowData=service.image;
                  return (
                    <Modal
                      style={{flex:1}}
                      animationType="slide"
                      transparent={false}
                      visible={item.stat}
                      onRequestClose={() => {
                        this.menu(item.func) 
                        this.setState({skill:''})   
                      }}
                      >
                        <View style={{flex:1}}>
                          <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                            <Text style={{fontSize:17, fontWeight:'bold'}}>{item.name}</Text>
                          </View>
                          
                          <View style={{paddingVertical:5, width:'100%', justifyContent:'center', paddingHorizontal:10}}>
                            <Text style={{fontSize:10}}>{"Manage your "+item.name}</Text>
                          </View>
                            <View style={[{height:45, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}]}>
                              <TextInput
                                style={{width:'70%', height:45, borderRadius:5, borderWidth:1}}
                                value={this.state.skill}
                                onChangeText={(skill) => this.setState({skill})}
                                underlineColorAndroid='transparent'/>
                              <View style={{ alignItems:'center'}}>
                                <TouchableOpacity onPress={()=>{this.addSkill(item.name, this.state.skill)}}>
                                  <Text>Add</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <FlatList
                              data={item.func==='0'?this.state.trans:item.func==='1'?this.state.lang:item.func==='2'?this.state.edu:item.func==='3'?this.state.work:this.state.spec}
                              renderItem={({item})=>{return(
                                <View style={{width:'100%', alignItems:'center'}}>
                                  {
                                    this.state.edu.length>0?
                                    <View style={{flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between', padding:10, justifyContent:'center'}}>
                                      <Text style={{width:'60%', fontSize:15}}>{item.title}</Text>
                                      <View style={{width:'25%', alignItems:'center'}}>
                                        <TouchableOpacity onPress={()=>{this.deleteSkill(item.type, item.id)}}>
                                        <Image 
                                          style={[
                                              {marginTop:7, width:30, height:30, marginLeft:3}
                                          ]} 
                                          source={require('../../Logos/delPhoto1.png')}/>
                                        </TouchableOpacity>
                                      </View>
                                    </View>:null
                                  }
                                </View>
                              )
                              }}
                            />
                        </View>
                    </Modal>
                  )
              }
            }/>
          </View>
          </ScrollView>
          <Modal
              style={{flex:1}}
              animationType="slide"
              transparent={false}
              visible={this.state.imageFullModal}
              onRequestClose={() => {
                  this.setState({imageFullModal:false, largePhoto:''});
              }}>
              {
                  this.state.largePhoto!==''?
                  <View style={{flex:1, backgroundColor:'black', alignItems:'center'}}>
                  <Image 
                      style={[
                          {width:'100%', height:'100%', resizeMode:'contain'}
                      ]}    
                      source={{uri:this.state.largePhoto}}/>
                  </View>
                  :
                  <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                      <Text>Loading</Text>
                  </View>
              }
          </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding:5,
    flex: 1,
    justifyContent:'flex-start',
    alignItems: 'center',
  },
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf:'flex-end',
    position: 'absolute',
    margin:10
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  input:{
    height:45,
    width:'100%',
    justifyContent:'center',
    padding:10,
    borderBottomColor:'#cfcfcf',
    borderBottomWidth:1,
    marginBottom:5
  },
  inputContainer: {
    padding:5,
    borderColor: '#cfcfcf',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    width:'100%',
    height:45,
    marginVertical:15,
    flexDirection: 'row',
    alignItems:'center'
  },
});
export default ProfileEdit;
