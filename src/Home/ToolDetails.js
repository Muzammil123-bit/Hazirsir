//import liraries
import React, { Component } from 'react';
import { StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    Slider,
    ScrollView,
    FlatList,
    Button,} from 'react-native';
    import Video from 'react-native-video';
    import { NavigationEvents, withNavigation} from 'react-navigation';
import Tools from './Tools';

 

// create a component
class ToolDetails extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            link:'',
            currentTime: null,
            duration: 0,
            isLoading: true,
            paused: true,
        }
      }

    //   async componentDidMount(){
    //     const resp = await AsyncStorage.getItem('response')
    //     const response = JSON.parse(resp)


    //     console.log(response);
      
    //   }

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
        this.setState({
        paused: !this.state.paused
        })
    }

    addToCart = (id, price, name, stock, image) =>{
      // console.log(id);
      // console.log(price);

      const {params} = this.props.navigation.state;
     

      params.func(id,price,name,stock,image);
       
      // new Tools().myfunc();
     
        // Obj1.addProductToCart(id, price, name, stock, image);
        // Alert.alert("Success", "Product has beed added to cart")
    }

    
    render() {
        const { navigation } = this.props;
        const item = JSON.stringify(navigation.getParam('item'));
        const item1 = JSON.parse(item);
       // this.setState({link:item1['link']})
       // console.log(item1['tool_name']);
        return (
            <View style={styles.container}>
<View style={{ flexDirection:'row', width:'100%', height:55,backgroundColor:'#f5f5f5' ,alignItems:'center', justifyContent:'space-between', paddingHorizontal:12}}>            


<View style={{alignSelf:'center', paddingRight:5}}>
                      <TouchableOpacity onPress={()=>
                          // this.placeOrder()
                         this.props.navigation.navigate('Tools1')
                      }>
                          <View style={{padding:5, paddingHorizontal:10, borderRadius:10, backgroundColor:'#32a84e'}}>
                              <Text style={{fontFamily:'Montserrat-Bold', color:'white', fontSize:10}}>
                                  Change Category
                              </Text>
                          </View>
                      </TouchableOpacity>
                    </View>

</View>
<View>
                    <Text>{'\n'}</Text>
</View>

              <ScrollView>

                <View style={{alignItems:'center', marginHorizontal:30}}>
                  <Image style={styles.productImg} source={{uri:item1['image']}}/>
                  <Text style={styles.name}>{item1['tool_name']}</Text>
        <Text style={styles.price}>Rs {item1['price']}</Text>

        <Text style={{fontSize:17, fontFamily:'Montserrat-Bold', paddingLeft:5}}>Description</Text>

        <Text style={styles.description}>
                    {item1['description']}
                    </Text>
                  
                </View>

                <View style={{alignSelf:"center"}}><Text style={{fontSize:17, fontFamily:'Montserrat-Bold', paddingTop:10}}>Video Tutorial</Text></View>
              
                
                <View style={styles.separator}></View>

                
               
                <View style={{padding:5, alignSelf:'center'}}>
               
                <Video source={{uri: item1['link']}}        // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                 // Pauses playback entirely.
                            onLoad={this.onLoad}            // Callback when video loads
                            onProgress={this.onProgress}    // Callback every ~250ms with currentTime
                            paused={this.state.paused}
                            onEnd={this.onEnd}
                            style={{height:200, width:200}}
                            repeat={true} 
                            /> 
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
                                    {/* <Text>{this.msToTime(this.state.currentTime)}</Text> */}
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
                
                <View style={styles.addToCarContainer}>
                  <TouchableOpacity style={styles.shareButton} onPress={()=> this.addToCart(item1['id'],item1['price'],item1['tool_name'],item1['in_stock'],item1['image'])}>
                    <Text style={styles.shareButtonText}>Add To Cart</Text>  
                  </TouchableOpacity>
                </View> 
              </ScrollView>
            </View>
          );
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:20,
      },
      productImg:{
        width:200,
        height:200,
      },
      name:{
        fontSize:17,
         fontFamily:'Montserrat-Bold',
         color:"black",
      },
      price:{
        textAlign:'center',
        marginTop:10,
        color:"green",
        marginBottom:10,
      },
      description:{
        textAlign:'center',
        marginTop:10,
        color:"#696969",
      },
      star:{
        width:40,
        height:40,
      },
      btnColor: {
        height:30,
        width:30,
        borderRadius:30,
        marginHorizontal:3
      },
      loginButton: {
        backgroundColor: '#6cb505',
      },
      btnSize: {
        height:40,
        width:40,
        borderRadius:40,
        borderColor:'#778899',
        borderWidth:1,
        marginHorizontal:3,
        backgroundColor:'white',
    
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      starContainer:{
        justifyContent:'center', 
        marginHorizontal:30, 
        flexDirection:'row', 
        marginTop:20
      },
      contentColors:{ 
        justifyContent:'center', 
        marginHorizontal:30, 
        flexDirection:'row', 
        marginTop:20
      },
      contentSize:{ 
        justifyContent:'center', 
        marginHorizontal:30, 
        flexDirection:'row', 
        marginTop:20
      },
      separator:{
        height:2,
        backgroundColor:"#eeeeee",
        marginTop:5,
        marginHorizontal:30
      },
      shareButton: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:30,
        backgroundColor: "#32a84e",
        paddingBottom:7
      },
      shareButtonText:{
        color: "#FFFFFF",
        fontSize:20,
      },
      addToCarContainer:{
        marginHorizontal:30
      }
});

//make this component available to the app
export default withNavigation(ToolDetails);
