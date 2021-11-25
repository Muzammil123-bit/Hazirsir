//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,
  Slider, Image, TextInput,Alert, Modal, Picker } from 'react-native';
import { FlatList } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast'
import { NavigationEvents, withNavigation} from 'react-navigation';
import YouTube from 'react-native-youtube';
import Video from 'react-native-video';

// create a component
class Tools extends Component {
    constructor(props) {
    super(props);
      this.state = {
        uid:'',
        tools:[],
        allTools:[],
        order:[],
        categories:[],
        category:'',
        cModal:true,
        showSearchBar: false,
        searchTitle:'',
        toolsTemp:[],
        
        
        
        videoModal:false,
        currentTime: null,
        duration: 0,
        isFullScreen: false,
        isLoading: true,
        paused: true,
        screenType:'content',
      };
    }
    async componentDidMount(){
      const value = await AsyncStorage.getItem('userID')
      // var emp = this.props.navigation.getParam('empty', '0');
      // if(emp==='1'){
        await this.setState({order:[]})
      //   console.log('from empty')
      // }
      await this.setState({uid:value})
      console.log(this.state.uid)
      this.getTools()
      this.getCategories()
    
    }
    async getTools(){
      const url='https://www.hazirsir.com/web_service/read_tools.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
              // resolve(responseJson);

              // alert(JSON.stringify(responseJson));

              console.log("gugugugugu"+JSON.stringify(responseJson));
              await this.setState({allTools:responseJson})
              await AsyncStorage.setItem('response', JSON.stringify(responseJson))
              return responseJson;
          })
          .catch((error) => {
              // reject(error);
              console.log(error);
  
              return error;
      });
    }
    async getCategories(){
      const url='https://www.hazirsir.com/web_service/read_tools_cat.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
              // resolve(responseJson);
              console.log(responseJson);
              await this.setState({categories:responseJson})
              return responseJson;
          })
          .catch((error) => {
              // reject(error);
              console.log(error);
  
              return error;
      });
    }
    

   

    async addProductToCart(id, price, name, stock, image){

        var ord=this.state.order
        if(ord.find(x=>x.id===id)){
          ord.find(x=>x.id===id).quan+=1
        }else{
          ord.push({id:id, quan:1, price:price, name:name, stock:stock, image:image})
        }
        await this.setState({order:ord})
        console.log(this.state.order)
        Alert.alert('Success', 'The product has been added to your cart')
    }
    async searchByTitle(){
      var search=this.state.searchTitle
      await this.setState({searchTitle:''})
      var arr=[]
      // alert(JSON.stringify(this.state.tools));
      for(i=0; i < this.state.tools.length; i++){
        if(this.state.tools[i].tool_name.toLowerCase().includes(search.toLowerCase())){
          arr.push(this.state.tools[i])
        }
      }
      console.log(arr)
      this.setState({tools:arr})
      this.setState({showSearchBar:false, resetbutton:true})
    }
    async resetFilters(){
      this.setState({resetbutton:false, tools:this.state.toolsTemp})
      await this.getTools()
    }
    
    async onRefreshtask(){
      this.setState({refreshing:true})
      await this.getTools()
      this.setState({refreshing:false})
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


    onSeeking(value){
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
        this.setState({ currentTime: data.currentTime});
        
    };
    onPause(){
        this.setState({paused: !this.state.paused})
    }
    async video(vid){
      console.log("videoooooo "+ vid);
      await this.setState({videoLink:vid})
      await this.setState({videoModal:true})




      // alert(this.state.videoLink);
    }

    // myfunc(id,price,name){
    //    console.log("tools id "+id);
    //    console .log("price "+price);
    //    console .log("name"+name);
    // }


    render() {
    
      var id=0;
      var price=0;
      var name="";
      var stock = 0;
      var image = "";

     
      // var stock;
      // var image;
      //const { navigation } = this.props;

      // const { navigation } = (
      //   <Tools navigation={navigation} />
      // );
        return (
            <View style={styles.container}>
              <View style={{ flexDirection:'row', width:'100%', height:55,backgroundColor:'#f5f5f5' ,alignItems:'center', justifyContent:'space-between', paddingHorizontal:12}}>
                  <Text style={{fontSize:17, fontFamily:'Montserrat-Bold'}}>Tools</Text>

                  <View style={{flexDirection:'row'}}>
                  {
                    !this.state.showSearchBar && !this.state.cModal && !this.state.resetbutton?
                    <View style={{alignSelf:'center', paddingRight:5}}>
                      <TouchableOpacity onPress={()=>
                          // this.placeOrder()
                          this.setState({showSearchBar:true})
                      }><Image source={require('../Logos/searchdark.png')} style={{height:25, width:25}}/>
                      </TouchableOpacity>
                    </View>
                    :null
                  }
                  {
                    !this.state.cModal?
                    <View style={{alignSelf:'center', paddingRight:5}}>
                      <TouchableOpacity onPress={()=>
                          // this.placeOrder()
                          this.setState({cModal:true})
                      }>
                          <View style={{padding:5, paddingHorizontal:10, borderRadius:10, backgroundColor:'#32a84e'}}>
                              <Text style={{fontFamily:'Montserrat-Bold', color:'white', fontSize:10}}>
                                  Change Category
                              </Text>
                          </View>
                      </TouchableOpacity>
                    </View>
                    :null
                  }
                  {
                    !this.state.cModal?
                    <View style={{alignSelf:'center'}}>
                      <TouchableOpacity onPress={()=>{
                        if(this.state.order.length>0){
                          this.props.navigation.navigate('Cart', {orders:this.state.order})
                        }
                        else{
                          Toast.show('Your cart is empty.', {
                            duration:Toast.duration.LONG
                          })
                        }

                        }}>
                        <View style={{padding:5, paddingHorizontal:10, borderRadius:10, backgroundColor:'#32a84e'}}>
                          <Text style={{color:'white', fontFamily:'Montserrat-Bold', fontSize:10}}>View Cart</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    :null
                  }
                  </View>
              </View>
              {
                  !this.state.cModal && this.state.showSearchBar?
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
              :
              null}
              {
                this.state.resetbutton?
                <View style={{width:'90%', alignSelf:'center'}}>
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

                {
                  !this.state.cModal?
                  <FlatList style={styles.list}
                // contentContainerStyle={styles.listContainer}
                data={this.state.tools}
                horizontal={false}
                numColumns={2}
                keyExtractor= {(item) => {
                    return item.id;
                }}
                renderItem={(post) => {
                    const item = post.item;
                    return (
                    <View style={styles.card}>
                    
                        <View style={styles.cardHeader}>
                          <View style={{ width:'100%'}}>
                            {
                              this.state.order[this.state.order.indexOf(this.state.order.find(x=>x.id===item.id))]?
                              <View style={{alignSelf:'flex-end', width:20, height:20, borderRadius:10, backgroundColor:'#32a84e', justifyContent:'center', alignItems:'center'}}>
                                {/* <TouchableOpacity onPress={()=>this.video(item.link)}>
                                <Text style={{padding:10}}>Video</Text>
                                </TouchableOpacity> */}
                                <Text style={{borderRadius:5, color:'white'}}>
                                      {this.state.order[this.state.order.indexOf(this.state.order.find(x=>x.id===item.id))].quan}
                                </Text>
                              </View>:
                              <View style={{width:20, height:20}}>
                                
                              </View>
                            }
                            <TouchableOpacity onPress={()=>this.video(item.link)}>
                              <Image style={{height:30, width:30, resizeMode:'contain'}} source={require('../Logos/youtube.png')}/>

                            <Text style={{fontSize:10}}>{'Click to play video'}</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize:10}}>{'Category: '+item.category}</Text>
                            <Text style={styles.title}>{item.tool_name}</Text>
                            <Text style={styles.price}>{'Price: Rs. '+item.price}</Text>
                            <Text style={styles.price}>{'In Stock : '+item.in_stock}</Text>
                          </View>
                        </View>

                        <Image style={styles.cardImage} source={{uri:item.image}}/>
                        
                        <View style={styles.cardFooter}>
                          <View style={[styles.socialBarContainer, {borderRightColor:'white', borderRightWidth:1}]}>
                              <View style={styles.socialBarSection}>
                              <TouchableOpacity style={styles.socialBarButton} onPress={() => this.props.navigation.navigate('ToolDetails',{item: item, func: this.addProductToCart.bind(this).bind(id).bind(price).bind(name).bind(stock).bind(image)})}>
                                  <Text style={[styles.socialBarLabel, styles.buyNow,]}>Details</Text>
                              </TouchableOpacity>
                              </View>
                          </View>
                          <View style={styles.socialBarContainer}>
                              <View style={styles.socialBarSection}>
                              <TouchableOpacity style={styles.socialBarButton} onPress={() => this.addProductToCart(item.id, item.price, item.tool_name, item.in_stock, item.image)}>
                                  {/* <Image style={styles.icon} source={{uri: 'https://png.icons8.com/nolan/96/3498db/add-shopping-cart.png'}}/> */}
                                  <Text style={[styles.socialBarLabel, styles.buyNow]}>Add to cart</Text>
                              </TouchableOpacity>
                              </View>
                          </View>
                        </View>
                        
                    </View>
                    )
                }}/>
                 :null
                } 
                <NavigationEvents
                  onWillFocus={
                  ()=>  this.setState({order:this.state.order})
                  // this.test
                  }
                />
                {
                  this.state.cModal?
                    <View style={{padding:20, borderRadius:20, alignItems:'center'}}>
                      {
                        this.state.categories.map((item)=>{
                          return(
                            <View style={{flexDirection:'row', padding:10, borderRadius:15, marginBottom:10, elevation:10, backgroundColor:'white'}}>
                              <Image style={{height:60, width:60, borderRadius:30}} source={{uri:item.image}}/>
                              <View style={{width:'70%', alignItems:'center', justifyContent:'space-between'}}>
                                <Text>
                                  {item.name}
                                </Text>
                                <View style={{backgroundColor:'#32a84e', padding:5, borderRadius:5, alignSelf:'center'}}>
                                    <TouchableOpacity onPress={()=>{
                                        arr=[]
                                        arr=this.state.allTools.filter((item1)=>item1.tool_category_id===item.id)
                                        this.setState({cModal:false, tools:arr, toolsTemp:arr})
                                        // this.setState({pModal:true})
                                    }
                                    }>
                                        <Text style={{color:'white'}}>
                                            Select
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                     :null
                } 
                {/* <YouTube
                  videoId="KVZ-P-ZI6W4" // The YouTube video ID
                  play // control playback of video with true/false
                  fullscreen // control whether the video should play in fullscreen or inline
                  loop // control whether the video should loop when ended
                  onReady={e => this.setState({ isReady: true })}
                  onChangeState={e => this.setState({ status: e.state })}
                  onChangeQuality={e => this.setState({ quality: e.quality })}
                  onError={e => this.setState({ error: e.error })}
                  style={{ alignSelf: 'stretch', height: 300 }}
                /> */}
                
                <Modal
                  style={{flex:1}}
                  animationType="slide"
                  transparent={false}
                  visible={this.state.videoModal}
                  onRequestClose={() => {
                      this.setState({videoModal:false});
                  }}>

                  <View style={{padding:5, alignSelf:'center'}}>
                    {/* <Video source={{uri:item.video_url}}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}                                      // Store reference
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={this.videoError}               // Callback when video cannot be loaded
                        style={{height:200, width:200}} /> */}

                        {/* <View  style={{height:300, width:300}}> */}








                        <Video source={{uri: this.state.videoLink}}        // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                 // Pauses playback entirely.
                            onLoad={this.onLoad}            // Callback when video loads
                            onProgress={this.onProgress}    // Callback every ~250ms with currentTime
                            paused={this.state.paused}
                            onEnd={this.onEnd}
                            style={{height:300, width:300}}
                            repeat={true} 
                            /> 


{/* </View> */}
                            <Slider
                                value={this.state.currentTime}
                                minimumValue={0}
                                maximumValue={this.state.duration}
                                onSlidingComplete={value =>  this.onSeeking(value)}
                                trackStyle={styles.trackStyle}
                                thumbStyle={styles.thumbStyle}
                                minimumTrackTintColor='#333'
  
                                />
                                <View style={styles.timeDurationContainer}>
                                    <Text>{this.msToTime(this.state.currentTime)}</Text>
                                    <Text>{ this.msToTime(this.state.duration)}</Text>
                                </View>
  
                                <View style={styles.bContainer}>
                                <TouchableOpacity style={styles.btnContainer} onPress={this.onPause.bind(this)}>
                                    {!this.state.paused ? (
                                            <Image
                                            style={{width: 40, height: 40}}
                                            source={require('../Logos/pause.png')}
                                        />
                                    ) : (
                                    <Image
                                    style={{width: 40, height: 40}}
                                    source={require('../Logos/play.png')}
                                    />
                                    )}
                                </TouchableOpacity>
                            </View>
                    </View>
                </Modal>


            </View>
        );
    }

    test(e){
      console.log(e)
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex:1,
      },
      list: {
        paddingHorizontal: 5,
        backgroundColor:"#E6E6E6",
      },
      // listContainer:{
      //   alignItems:'center'
      // },
      // separator: {
      //   marginTop: 0,
      // },
      /******** card **************/
      card:{
        shadowColor: '#00000021',
        shadowOffset: {
          width: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor:"white",
        flexBasis: '47%',
        marginHorizontal: 5,
      },
      cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        paddingTop:5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
      },
      cardFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 10,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
        backgroundColor:'#32a84e'
      },
      cardImage:{
        flex: 1,
        height: 150,
        width: null,
      },
      /******** card components **************/
      title:{
        fontSize:18,
        flex:1,
      },
      price:{
        fontSize:12,
        color: "green",
        marginTop: 5
      },
      buyNow:{
        color: "white",
        // paddingHorizontal:10,
        fontSize:10,
        // borderRadius:10,
      },
      icon: {
        width:25,
        height:25,
      },
      /******** social bar ******************/
      socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // width:'100%',
        flex:1,
        paddingVertical:10
      },
      socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
      },
      socialBarlabel: {
        marginLeft: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
      },
      socialBarButton:{
        flexDirection: 'row',
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
    });
//make this component available to the app
 export default withNavigation(Tools);



