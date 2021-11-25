import React, { Component } from 'react';
import { View, Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  ToastAndroid,
  TextInput ,
  RefreshControl,
  ActivityIndicator,
  AppState,
  PermissionsAndroid,
  DeviceEventEmitter,
  BackHandler
} from 'react-native';

// import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import PushNotification from 'react-native-push-notification'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
navigator.geolocation = require('@react-native-community/geolocation');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import  MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion, Callout} from 'react-native-maps';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

class EarnMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:'',
      physical:true,
      online:true,
      posts:[],
      latitude:31.5204,
      longitude:74.3587,
      clat:31.5204,
      clong:74.3587,
      all:true,
      multiSliderValue:[200, 999999],
      hideassigned:false,
      filtermodal:false,
      myskills:false,
      location:'',
      place:'',
      lat: '',
      long: '',
      placesModal:false,
      rangemodal:false,
      range:['5','10', '15', '25', '50', '100', '200'],
      selectedrange:'200',
      modalVisible:false,
      showSearchBar: false,
      searchTitle:'',
      resetbutton:false,
      nodata:false,
      refreshing:false,
      coordinate: new AnimatedRegion({
          latitude:31.5204,
          longitude:74.3587,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      }),
    };
  }
  async componentDidMount(){
    await this.gotocurrent1();
    // await this.location_get();
    const value = await AsyncStorage.getItem('userID')
    await this.setState({uid:value})
    console.log(this.state.uid)
    this.fetchposts();
    // AppState.addEventListener('change', this.handleAppStateChange);

    await this.getData();
    await this.storeData();
    await this.getDataBackground();
    
  }

  storeData = async () => {
    try {
 
      await AsyncStorage.setItem('Signed', '1')
     
    } catch (e) {
      // saving error
    }
  }
 


  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange);
    // LocationServicesDialogBox.stopListener(); 
  }
   


  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
     
      alert("notification.screen");
       PushNotification.popInitialNotification(notification => {
      // alert(notification.screen)
    
      // alert(notification.screen);
       
       // this.props.navigation.navigate('More')
        // const clicked = notification.userInteraction;
        //   if (clicked) {
    
            // alert(notification.screen);
            if(notification.screen === 'ChatScreen')
            {
    
              this.props.navigation.navigate('Chat')
            }
            else if(notification.screen === 'AssignedChat')
            {
    
    
              this.props.navigation.navigate('AChat', 
                              {
                                Type:notification.Type,
                                Desc:notification.Desc,
                                Skill:notification.Skill,
                                Title:notification.Titl,
                                Date:notification.Date,
                                Prof:notification.Prof,
                                Order:notification.Order,
                                ChatName:notification.ChatName
                                })
    
    
    
              // this.props.navigation.navigate('AChat')
            }
            else if(notification.screen === 'TaskDetails')
            {
           
             this.props.navigation.navigate('Task', {PostId:notification.order_id})
             this.setState({modalVisible:false})
           
            }
            else if(notification.screen === 'Rating')
            {
    
              // this.props.navigation.navigate('ViewRating')
              // alert(notification.reviews);
    
              this.props.navigation.navigate('ViewRating', {reviews:JSON.parse(notification.reviews)})
            }
            else if(notification.screen === 'MyTasks')
            {
    
              // alert(notification.screen);
              this.props.navigation.navigate('MyTasks' , {reviews:notification.state})
            }
            else if(notification.screen === 'AssignedChat')
            {
    
              this.props.navigation.navigate('AssignedChat')
            }
            else
            {
              
        
            }
           
    
          // }
    
    
       
    })

      
    }
    else
    {
      alert('the app is open');
    }    
  }





  
  async getDataBackground(){



    PushNotification.popInitialNotification(notification => {
      // alert(notification.screen)
    
      // alert(notification.screen);
       
       // this.props.navigation.navigate('More')
        // const clicked = notification.userInteraction;
        //   if (clicked) {
    
            // alert(notification.screen);
            if(notification.screen === 'ChatScreen')
            {
    
              this.props.navigation.navigate('Chat')
            }
            else if(notification.screen === 'AssignedChat')
            {
    
    
              this.props.navigation.navigate('AChat', 
                              {
                                Type:notification.Type,
                                Desc:notification.Desc,
                                Skill:notification.Skill,
                                Title:notification.Titl,
                                Date:notification.Date,
                                Prof:notification.Prof,
                                Order:notification.Order,
                                ChatName:notification.ChatName
                                })
    
    
    
              // this.props.navigation.navigate('AChat')
            }
            else if(notification.screen === 'TaskDetails')
            {
           
             this.props.navigation.navigate('Task', {PostId:notification.order_id})
             this.setState({modalVisible:false})
           
            }
            else if(notification.screen === 'Rating')
            {
    
              // this.props.navigation.navigate('ViewRating')
              // alert(notification.reviews);
    
              this.props.navigation.navigate('ViewRating', {reviews:JSON.parse(notification.reviews)})
            }
            else if(notification.screen === 'MyTasks')
            {
    
              // alert(notification.screen);
              this.props.navigation.navigate('MyTasks' , {reviews:notification.state})
            }
            else if(notification.screen === 'AssignedChat')
            {
    
              this.props.navigation.navigate('AssignedChat')
            }
            else
            {
              
        
            }
           
    
          // }
    
    
       
    })



  }


async getData(){



  // this.props.navigation.dispatch(resetAction);
  
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)

    // requestPermissions: Platform.OS === 'ios',you

    onRegister: function(token) {
      console.log('TOKEN:', token)
    },
// (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log('REMOTE NOTIFICATION ==>', notification)
      console.log(notification.screen);


// alert(JSON.stringify(notification));
// alert(JSON.stringify(notification));
      

      const clicked = notification.userInteraction;
      if (clicked) {


        if(notification.screen === 'ChatScreen')
        {

          this.props.navigation.navigate('Chat')
        }
        else if(notification.screen === 'AssignedChat')
        {

          // console.warn("screen name"+ JSON.stringify(notification));

          this.props.navigation.navigate('AChat', 
                          {
                            Type:notification.Type,
                            Desc:notification.Desc,
                            Skill:notification.Skill,
                            Title:notification.Titl,
                            Date:notification.Date,
                            Prof:notification.Prof,
                            Order:notification.Order,
                            ChatName:notification.ChatName
                            })



          // this.props.navigation.navigate('AChat')
        }
        else if(notification.screen === 'TaskDetails')
        {
       
         this.props.navigation.navigate('Task', {PostId:notification.order_id})
         this.setState({modalVisible:false})
       
        }
        else if(notification.screen === 'Rating')
        {

          // this.props.navigation.navigate('ViewRating')
          // alert(notification.reviews);

          this.props.navigation.navigate('ViewRating', {reviews:JSON.parse(notification.reviews)})
        }
        else if(notification.screen === 'MyTasks')
        {

          // alert(notification.screen);
          this.props.navigation.navigate('MyTasks' , {reviews:notification.state})
        }
        else if(notification.screen === 'AssignedChat')
        {

          this.props.navigation.navigate('AssignedChat')
        }
        else
        {
          
    
        }
       

      }




      
// process the notification here
    }.bind(this),

   
    

    // Android only: GCM or FCM Sender ID
    senderID: "914422540898",

    popInitialNotification: true,
    requestPermissions: true
  });

}

 
  async fetchposts(){
    // console.log(uid)
    const url='https://www.hazirsir.com/web_service/read_orders.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
            if(responseJson!=='Record doesnot exist' && responseJson!=='Wrong Credentials!'){
              await this.setState({nodata:false, posts:responseJson})
            }else if(responseJson==='Record doesnot exist'){
              
              await this.setState({nodata:true, posts:[]})
            }
            else{
              await this.setState({nodata:true})
            }
            return responseJson;
        })
        .catch((error) => {
            // reject(error);
            console.log(error);

            return error;
    });
  }
  physicalSelected(){
    this.setState({physical:true, online:false, all:false})
  }
  onlineSelected(){
    this.setState({online:true, physical:false, all:false})
  }
  allSelected(){
    this.setState({physical:true, online:true, all:true})
  }
  openPost(id, o_status){
    this.props.navigation.navigate('Task', {PostId:id, order_statuss: o_status})
    this.setState({modalVisible:false})
  }
  async applyfilter(){
    console.log(this.state.lat+' '+this.state.long)
    const url='https://www.hazirsir.com/web_service/filter_posts.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    // const url='https://www.quaidstp.com/projects/test/test2.php';
    if(this.state.lat==='' && this.state.long===''){
        ToastAndroid.show('Please select your base location!', ToastAndroid.SHORT);
    }else{
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [this.state.uid,this.state.multiSliderValue[0],this.state.multiSliderValue[1],this.state.lat, this.state.long, this.state.selectedrange]
            })
        })
            .then((response) =>
                response.json()             
             )
            .then(async (responseJson) => {
                // Showing response message coming from server after inserting records.
                // resolve(responseJson);
                console.log(responseJson);
                this.setState({filtermodal:false, resetbutton:true})
                if(responseJson!=='Record doesnot exist'){
                  await this.setState({posts:responseJson})
                }else{
                  this.setState({posts:[], nodata:true})
                }
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);
    
                return error;
        });
    }

  }
  multiSliderValuesChange = values => {
    this.setState({
        multiSliderValue: values,
    });
  };

  location_get(){
    console.log('get location');
        navigator.geolocation.getCurrentPosition(
        async position => {
        console.log("Position===>", position);
        // alert("Position===>"+JSON.stringify( position));
        await this.setState({
            lat:position.coords.latitude,
            long:position.coords.longitude,
            coordinate: position.coords,
        });
        console.log(this.state.long+'<-long,lat->'+this.state.lat)
        // alert(coordinate);
    },
      error => console.warn(error.message),
      // { enableHighAccuracy: true, timeout: 10000}
    );
};


filter_fun = async() =>
{
  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  .then(data => {

    // alert(data);
    this.setState({filtermodal:true})


  }).catch(err => {
    alert(err);
   });

}


  async searchByTitle(){
    var search=this.state.searchTitle
    await this.setState({searchTitle:''})
    var arr=[]
    for(i=0; i < this.state.posts.length; i++){
      if(this.state.posts[i].title.toLowerCase().includes(search.toLowerCase())){
        arr.push(this.state.posts[i])
      }
    }
    console.log(arr)
    this.setState({posts:arr})
    this.setState({showSearchBar:false, resetbutton:true})
  }
  async resetFilters(){
    this.setState({resetbutton:false, nodata:false})
    await this.fetchposts()
  }
  
  async onRefreshtask(){
    this.setState({refreshing:true})
    await this.fetchposts()
    this.setState({refreshing:false})
  }


  async gotocurrent(){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  .then(data => {
    navigator.geolocation.getCurrentPosition(
      async position => {
      console.log("Position===>", position);
      try {
        let r = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.01,
      };
      await this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
    });
      this._map.animateToRegion(r, 1500);
      this.animate(r);
      } catch (error) {
        alert("Your location could not be determined");
      }
  },
    error =>
    {

     console.warn(error.message)
    }
  
  );

  }).catch(err => {
  //  alert(err);
  });

  
  };

  async gotocurrent1(){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  .then(data => {
    navigator.geolocation.getCurrentPosition(
      async position => {
      console.log("Position===>", position);
      try {
        let r = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.01,
      };
      await this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
    });
      this._map.animateToRegion(r, 1500);
      this.animate(r);
      } catch (error) {
        // alert("Your location could not be determined");
      }
  },
    error =>
    {

     console.warn(error.message)
    }
  
  );

  }).catch(err => {
  //  alert(err);
  });

  
  };

 
  async animate(data) {
      const { coordinate } = this.state;
  
      await this.setState({
        lat: data.latitude,
        long: data.longitude,
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
  render() {
    return (
      <View style={{flex:1}}>
        
        
        <View style={{ flexDirection:'row', width:'100%', height:55,backgroundColor:'#f5f5f5' ,alignItems:'center', justifyContent:'space-between', paddingHorizontal:12}}>
          <Text style={{fontSize:17, fontFamily:'Montserrat-Bold'}}>Amazon{"\n"}Marketplace</Text>

          <View style={{ alignSelf: "center", flexDirection:"row"}}>


          <TouchableOpacity 
            style={{ backgroundColor:"green", alignSelf: "center", borderRadius:20}}
            onPress={() => this.props.navigation.navigate('PostTask')}
              >
               <Text style={{color:"white" , padding: 12, }}>Post a task</Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('More')}>
                <View style={{ padding: 5, paddingHorizontal: 10, }}>
                  {/* <Text style={{color:'white', fontSize:17, fontFamily:'Montserrat-Bold'}}>More</Text> */}
                  <Image
                    style={[
                      { width: 25, height: 25, }
                    ]}
                    source={require('../Logos/menu.png')} />
                </View>
              </TouchableOpacity>
            </View>
         
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefreshtask()} />
          }>





        {
          this.state.posts.length>0?
          <Modal
              style={{flex:1}}
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                  this.setState({modalVisible:false});
              }}>
              <View style={{flex:1}}>
              <MapView
                  ref={component => (this._map = component)}
                  provider="google"
                  initialRegion={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                  } }
                  style={ styles.map }
                  // onPress={e => this.animate(e.nativeEvent.coordinate)}
                  >
                  {Array.isArray(this.state.posts)?
                    <View>
                      {this.state.posts.map(marker => (
                        <View>
                          {
                            marker.taskType==='online'?
                            null:
                            <Marker 
                              coordinate={{latitude:parseFloat(marker.latitude), longitude:parseFloat(marker.longitude)}}
                              // title={marker.title+' '+marker.budget}
                              image={{uri: marker.marker_image}}
                            >
                              {/* <View>
                                <Image 
                                      style={
                                        {width:65, height:65, borderRadius:32, marginTop:0, paddingTop:0}
                                      }    
                                      source={{uri:marker.client_image}}
                                      resizeMode='cover'/>
                                      </View> */}
                              <Callout onPress={()=>this.openPost(marker.id, marker.order_status)} >
                                  <View style={{flex:1, alignContent:'center', justifyContent:'center'}}>
                                    <Text style={{height:90, marginTop:0, paddingTop:0, fontSize:1}}>
                                        <Image 
                                            style={
                                              {width:65, height:65, marginTop:0, paddingTop:0, borderRadius:32,}
                                            }    
                                            source={{uri:marker.client_image}}
                                            resizeMode='cover'/>
                                    </Text> 
                                    <Text>{marker.title}</Text>
                                    <Text>{'Budget: '+marker.budget}</Text>
                                    <Text>{'Due date: '+marker.date}</Text>
                                    <TouchableOpacity>
                                      <View><Text style={{backgroundColor:'#32a84e', borderRadius:10, height:30, color:'white', alignSelf:'center', paddingTop:5, paddingHorizontal:20}}>
                                        View task
                                      </Text></View>
                                    </TouchableOpacity>

                                  </View>
                              </Callout>
                            </Marker>
                          }
                        
                        </View>
                      ))}
                    </View>
                    :null
                  }
                  
              </MapView>
          </View>
          </Modal>
          :null
        }



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
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
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
                renderDescription={row => row.description} // custom description render
                onPress={async (data, details = null) => { // 'details' is provided when fetchDetails = true
                  console.log(data, details);
                  await this.setState({place:data.description, placesModal:false, lat:details.geometry.location.lat, long:details.geometry.location.lng})
                  console.log(this.state.place)
                  console.log(this.state.lat)
                  console.log(this.state.placesModal)

                }}

                getDefaultValue={() => ''}

                query={{
                
                  key: 'AIzaSyCZS7yiqoySRYGcXVS_CRABTBP8WQoCehY',//hazirsir key
                  language: 'en',
                 }}

                styles={{
                  textInputContainer: {
                    width: '100%'
                  },
                  description: {
                    fontWeight: 'bold'
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  }
                }}

                currentLocation={false}
                 currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                 }}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  type: 'cafe'
                }}
                
                GooglePlacesDetailsQuery={{
                  fields: 'formatted_address',
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                
                debounce={200}
                renderLeftButton={()  => <Image source={require('../Logos/text.png')} />}
               />
                <View style={{flex:1, flexDirection:'column',alignItems:'flex-end', justifyContent:'flex-end', marginBottom:40, marginRight:10}}>
                  
                  <View style={{width:40}}>
                      <TouchableOpacity onPress={() => this.gotocurrent()}>
                          <Image
                              source={require('../Logos/currloc.png')}
                              style={{
                              height: 40,
                              width: 40,
                              }}
                          />
                      </TouchableOpacity>
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







        <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={false}
            visible={this.state.filtermodal}
            onRequestClose={() => {
                this.setState({filtermodal:false});
            }}>
            <View style={{flex:1, opacity:this.state.rangemodal?0.2:1}}>
              <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                <Text style={{fontSize:17, fontWeight:'bold'}}>Filter tasks</Text>
              </View>
              <View style={{flex:1, padding:10}}>
                {/* <View style={[styles.inputContainer, {justifyContent:'space-around', flexDirection:'row'}]}>
                  <Text>Hide asigned tasks</Text>
                  <Switch
                    onValueChange = {()=>this.setState({hideassigned:!this.state.hideassigned})}
                    value = {this.state.hideassigned}/>
                </View> */}
                <View style={[styles.inputContainer, {flexDirection: 'column', height:75, alignItems:null}]}>
                  <View style={{justifyContent:'space-around', flexDirection:'row'}}>
                    <Text>Price Range</Text>
                    <Text>{this.state.multiSliderValue[0]}</Text>
                    <Text>to</Text>
                    <Text>{this.state.multiSliderValue[1]}</Text>
                  </View>
                  <View style={{ alignSelf:'center'}}>
                      <MultiSlider
                          values={[
                              this.state.multiSliderValue[0],
                              this.state.multiSliderValue[1],
                          ]}
                          onValuesChange={this.multiSliderValuesChange}
                          min={200}
                          max={50000}
                          step={100}
                      />
                  </View>
                </View>
                <View style={[styles.inputContainer, {flexDirection:'column', height:100, alignItems:'flex-start', justifyContent:'space-around'}]}>
                  <Text>Base location</Text>
                  <TouchableOpacity onPress={()=>this.setState({placesModal:true})}>
                  {
                    this.state.place===''?
                    <Text style={{color:'gray'}}>Select your location</Text>:
                    <Text style={{color:'gray'}}>{this.state.place}</Text>
                  }
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputContainer, {justifyContent:'space-around', flexDirection:'row'}]}>
                  <Text>Show tasks within</Text>
                  <TouchableOpacity onPress={()=>this.setState({rangemodal:true})}>
                    <Text style={{color:'gray'}}>{this.state.selectedrange+' km'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={{paddingHorizontal:5, flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
                <View style={{width:'45%'}}>
                <TouchableOpacity onPress={()=>this.setState({filtermodal:false})}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white',}}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                </View>
                <View style={{width:'45%'}}>
                <TouchableOpacity onPress={()=>this.applyfilter()}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white'}}>Apply filter</Text>
                  </View>
                </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>




        <Modal
            style={{flex:1}}
            animationType="fade"
            transparent={true}
            visible={this.state.rangemodal}
            onRequestClose={() => {
                this.setState({rangemodal:false});
            }}>
            <View style={{flex:1}}>
              <View>
                <FlatList 
                  enableEmptySections={true}
                  data={this.state.range}
                  renderItem={({item}) => {
                      // const rowData=service.image;
                      return (
                          
                          <View style={{backgroundColor:'white', paddingTop:5}}>
                            <TouchableOpacity onPress={()=>this.setState({selectedrange:item, rangemodal:false})}>
                              <View style={{width:'100%',padding:10}}>
                                <Text>{item}</Text>
                              </View>
                            </TouchableOpacity>   
                          </View>
                      )
                  }
                }/>
              </View>
            </View>
        </Modal>





          <View style={{flex:1, padding:10, backgroundColor:'#f5f5f5'}}>  
            <View style={{width:'100%',flexDirection:'row-reverse', justifyContent:'center', alignSelf:'center', paddingHorizontal:10}}>


              <View style={{marginHorizontal:5, width:'33%', borderWidth:1, borderRadius:5,backgroundColor:this.state.physical?'#d3dfe8':'white'}}>
                  <TouchableOpacity onPress={()=>this.physicalSelected()}>
                      <View style={{flexDirection:'row' ,width:'100%', height:16, alignSelf:'center',justifyContent:'center', marginTop:4}}>
                          <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                              Physical
                          </Text>
                          <Image 
                              style={[
                                  {width:12, height:12, marginLeft:3}
                              ]} 
                              source={require('../Logos/physical.png')}/>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={{marginHorizontal:5, width:'33%', borderWidth:1, borderRadius:5,backgroundColor:this.state.online?'#d3dfe8':'white'}}>
                  <TouchableOpacity onPress={()=>this.onlineSelected()}>
                      <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                          <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                              Online
                          </Text>
                          <Image 
                              style={[
                                {width:12, height:12, marginLeft:3}
                              ]} 
                              source={require('../Logos/online.png')}/>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={{marginHorizontal:5, width:'33%', borderWidth:1, borderRadius:5,backgroundColor:this.state.all?'#d3dfe8':'white'}}>
                  <TouchableOpacity onPress={()=>this.allSelected()}>
                      <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                          <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                              All
                          </Text>
                          <Image 
                              style={[
                                {width:12, height:12, marginLeft:3}
                              ]} 
                              source={require('../Logos/both.png')}/>
                      </View>
                  </TouchableOpacity>
              </View>
            </View>
            {
              !this.state.showSearchBar?
              <View style={{width:'100%',flexDirection:'row', padding:10}}>
                <View style={{width:'60%', justifyContent:'center'}}>
                  {
                    this.state.place===''?
                    <Text style={{fontSize:12}}>Current location is selected</Text>
                    :
                    <Text style={{fontSize:12}}>{this.state.place}</Text>
                  }
                </View>
                <View style={{width:'40%',flexDirection:'row-reverse'}}>
                  {/* <TouchableOpacity onPress={()=>this.setState({filtermodal:true})}> */}
                  <TouchableOpacity onPress={()=>this.filter_fun()}>
                    <View style={{padding:5,justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                        <Image 
                            style={[
                              {width:22, height:22, marginLeft:3}
                            ]} 
                            source={require('../Logos/filter.png')}/>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}>
                      <View style={{padding:5,justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                          <Image 
                              style={[
                                {width:22, height:22, marginLeft:3}
                              ]}    
                              source={require('../Logos/physical.png')}/>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.setState({showSearchBar:true})}>
                    <View style={{padding:5,justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                        <Image 
                            style={[
                              {width:22, height:22, marginLeft:3}
                            ]} 
                            source={require('../Logos/searchdark.png')}/>
                    </View>  
                  </TouchableOpacity>
                  
                  
                        
                </View>
              </View>
              :
              <View style={{width:'100%', padding:10}}>
                <View style={styles.inputContainer}>
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/envelope/androidL/40/3498db'}}/> */}
                    <TextInput style={styles.inputs}
                        value={this.state.searchTitle}
                        onChangeText={(searchTitle) => this.setState({searchTitle})}
                        placeholder="Search title"
                        underlineColorAndroid='transparent'/>
                </View>
                <View style={{paddingHorizontal:5, flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
                  <View style={{width:'45%'}}>
                  <TouchableOpacity onPress={()=>this.setState({showSearchBar:false})}>
                    <View style={[styles.inputContainer,{paddingHorizontal:5, height:25, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        <Text style={{color:'white',}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  </View>
                  <View style={{width:'45%'}}>
                  <TouchableOpacity onPress={()=>this.searchByTitle()}>
                    <View style={[styles.inputContainer,{paddingHorizontal:5, height:25, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        <Text style={{color:'white'}}>Proceed</Text>
                    </View>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {
              this.state.resetbutton?
              <View style={{width:'100%'}}>
                <TouchableOpacity onPress={()=>this.resetFilters()}>
                  <View style={[styles.inputContainer,{paddingHorizontal:5, backgroundColor:'#32a84e', borderWidth:0, justifyContent:'center', height:25}]}>
                      {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                      <Text style={{color:'white'}}>Reset filters</Text>
                  </View>
                </TouchableOpacity>
              </View>
              :
              null
            }
            
            <View style={{flex: 1,flexDirection: 'row'}}>

            <View style={{flex: 2}}>
            {
              this.state.nodata?<Text style={{color:'gray', fontSize:10}}>No records found</Text>:<Text style={{color:'gray', fontSize:10}}>Drag down to refresh</Text>
            }
            </View>

            <View style={{flex: 1}}>
            {
              this.state.nodata?<Text style={{color:'gray', fontSize:10}}></Text>
              :
              <View style={{  borderWidth:1, borderRadius:5,backgroundColor:'#d3dfe8'}}>
              <TouchableOpacity onPress={()=>this.onRefreshtask()} >
                  <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4}}>
                      <Text style={{ marginBottom:5, marginLeft:5, alignSelf:'center', fontSize:11}}>
                      Refresh Tasks
                      </Text>
                      <Image 
                          style={[
                            {width:12, height:12, marginLeft:3}
                          ]} 
                          source={require('../Logos/refresh.png')}/>
                  </View>
              </TouchableOpacity>
          </View>
            }
             </View>
          

</View>

            <View>
              {
                this.state.posts.length>=1?
                <FlatList 
                enableEmptySections={true}
                data={this.state.posts}
                renderItem={({item}) => {
                    // const rowData=service.image;
                    return (
                        
                      <View>
                        {
                          this.state.all?
                          <View style={{backgroundColor:'white', marginTop:5}}>
                            <TouchableOpacity onPress={()=>this.openPost(item.id, item.order_status)}>
                              <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around', paddingVertical:10}}>
                                <View style={{width:'20%', justifyContent:'center'}}>
                                <Image 
                                  style={[
                                    {width:65, height:65, borderRadius:32}
                                  ]}    
                                  source={{uri:item.client_image}}/>
                                </View>
                                <View style={{width:'45%'}}>
                                  <Text>
                                    {item.title}
                                  </Text>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/calendar.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.date}</Text>
                                  </View>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/physical.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.place}</Text>
                                  </View>
                                </View>
                                <View style={{width:'30%'}}>
                                      <View style={{backgroundColor:'#32a84e', borderRadius: 20}}>
                                        <Text style={{color: "#fff", textAlign:'center'}}>{' '+item.order_status}</Text>
                                      </View>
                                      <Text>{'Rs '+item.budget}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>   
                          </View>
                          :
                          null
                        }
                        {
                          this.state.physical && !this.state.all && item.taskType==='physical'?
                          <View style={{backgroundColor:'white', marginTop:5}}>
                            <TouchableOpacity onPress={()=>this.openPost(item.id, item.order_status)}>
                              <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around', paddingVertical:10}}>
                                <View style={{width:'20%', justifyContent:'center'}}>
                                <Image 
                                  style={[
                                    {width:65, height:65, borderRadius:32}
                                  ]}    
                                  source={{uri:item.client_image}}/>
                                </View>
                                <View style={{width:'50%'}}>
                                  <Text>
                                    {item.title}
                                  </Text>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/calendar.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.date}</Text>
                                  </View>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/physical.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.place}</Text>
                                  </View>
                                </View>
                                <View style={{width:'20%'}}>
                                      <View>
                                        <Text>Open</Text>
                                      </View>
                                      <Text>{'Rs '+item.budget}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>   
                          </View>
                          :
                          null
                        }{
                          this.state.online && !this.state.all && item.taskType==='online'?
                          <View style={{backgroundColor:'white', marginTop:5}}>
                            <TouchableOpacity onPress={()=>this.openPost(item.id, item.order_status)}>
                              <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around', paddingVertical:10}}>
                                <View style={{width:'20%', justifyContent:'center'}}>
                                <Image 
                                  style={[
                                    {width:65, height:65, borderRadius:32}
                                  ]}    
                                  source={{uri:item.client_image}}/>
                                </View>
                                <View style={{width:'50%'}}>
                                  <Text>
                                    {item.title}
                                  </Text>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/calendar.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.date}</Text>
                                  </View>
                                  <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image 
                                      style={[
                                        {width:15, height:15}
                                      ]}    
                                      source={require('../Logos/physical.png')}/>
                                      <Text style={{width:'85%', fontSize:10}}>{' '+item.place}</Text>
                                  </View>
                                </View>
                                <View style={{width:'20%'}}>
                                      <View>
                                        <Text>Open</Text>
                                      </View>
                                      <Text>{'Rs '+item.budget}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>   
                          </View>
                          :
                          null
                        }
                      </View>  
                    )
                }
              }/>
              :
              <View>
                {
                  this.state.nodata?null:<ActivityIndicator size='large' />
                }
                
              </View>
            }
            </View>
          </View>
        </ScrollView>
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
    width:60,
    height:60,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default withNavigation(EarnMoney);
