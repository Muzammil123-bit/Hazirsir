import React, { Component } from 'react';
import { View, TextInput,
    Picker,
    Text,
    Modal,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Slider,
    ToastAndroid,Alert,Linking,
    ActivityIndicator } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';  
import ImageView from 'react-native-image-view'; 
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
navigator.geolocation = require('@react-native-community/geolocation');
import DatePicker from 'react-native-datepicker'
import { NavigationEvents } from 'react-navigation';
import  MapView, {PROVIDER_GOOGLE, Marker, AnimatedRegion} from 'react-native-maps';
class TaskDetails extends Component {
  constructor(props) {
    super(props);
        this.state = {
            uid:'',
            postId:'',
            order_status_s: '',
            skillid:'',
            post:[],
            img:[],
            aud:[],
            vid:[],
            comments:[],
            replies:[],
            offers:[],
            photo:'',
            width3rd:'',
            isImageViewVisible:false,
            // activetab:0,
            // imageIndex:0,
            images:[],
            commentImg:[],
            imgStat:'no',
            comment:'',


            commentImgR:[],
            imgStatR:'no',
            commentR:'',
            render_element_s: false,



            currentTime: null,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: true,
            screenType:'content',


            currentTimeVid: null,
            durationVid: 0,
            isFullScreenVid: false,
            isLoadingVid: true,
            pausedVid: true,
            screenTypeVid:'content',

            imageFullModal:false,
            lat:'',
            long:'',
            clat:'',
            clong:'',
            largePhoto:'',
            reply:[],

            offerModal:false, bidAmount:'', bidComment:'', bidTime:'Morning',
            todaydate: new Date(),
            ago:'',
            verStat:'',
            coordinate: new AnimatedRegion({
                // latitude: 37.78825,
                // longitude: -122.4324
                latitude1: null,
                longitude1: null
            })

        };
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
        this.setState({
        paused: !this.state.paused
        })
    }






    msToTimeVid(time) {
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
    onSeekingVid(value){
        console.log(Math.round(value))
        this.seekVid(Math.round(value));
        }
        seekVid(time) {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
        currentPositionVid: time, 
        });
        }
        onLoadVid = data => {
        console.log(this.msToTime(data.duration))

        this.setState({ durationVid: data.duration, isLoadingVid: false })
        };
        onEndVid = () => this.setState({ pausedVid: true });
        onProgressVid = data => {
        console.log(data)
        if (!this.state.pausedVid) 
        this.setState({ currentTimeVid: data.currentTime});
        
        };
        onPauseVid(){
        this.setState({
        pausedVid: !this.state.pausedVid
        })
    }
    async componentDidMount(){
        
        const screenWidth = Math.round(Dimensions.get('window').width);
        await this.setState({width3rd:Math.round(screenWidth/3)})
        console.log(screenWidth+' '+this.state.width3rd)
        
        const { navigation } = this.props;
        var postId = navigation.getParam('PostId', '0');
        var order_s = navigation.getParam('order_statuss', '0');
        
        const value = await AsyncStorage.getItem('userID')
        await this.setState({uid:value, postId:postId, order_status_s: order_s})
     //   console.log(this.state.postId)
        await this.fetchpost();
        // console.log("skillid")
        await this.setState({skillid:this.state.post[0].skillid})
        this.setState({secondTime:true})
       // await this.location_get();
    //    alert(this.state.order_status_s);
        
    }
    async fetchpost(){
        console.log('hello');
        const url='https://www.hazirsir.com/web_service/read_order_details.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [this.state.uid, this.state.postId],
            })
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('response');
                console.log(responseJson);
                if(responseJson!=='Record doesnot exist'){


                    // alert(JSON.stringify(responseJson[0]));

                    await this.setState({
                        post:responseJson[0],
                        img:responseJson[1],
                        aud:responseJson[2],
                        vid:responseJson[3],
                        comments:responseJson[4],
                        replies:responseJson[5],
                        offers:responseJson[6]
                    })
                    this.timeDiff()
                    var images=[]
                    for(i=0;i<this.state.img.length;i++){
                        await images.push({'name':this.state.img[i].image_url, 'index':[i]});
                    }
                    this.state.comments.forEach(function (element, index) {
                        element.status = false;
                        element.index = index;
                    });
                    
                    await this.setState({
                        postOwner:this.state.post[0].user_id,
                        photo:this.state.post[0].client_image,
                        bidAmount:this.state.post[0].budget, 
                        idTime:this.state.post[0].work_time,
                        bidDate:this.state.post[0].date,
                        verStat:this.state.post[0].cnic_status,
                        lat:this.state.post[0].latitude,
                        long:this.state.post[0].longitude,
                        p_namme:this.state.post[0].p_name,
                     
                    })
                    // console.log(this.state.post[0].user_id)
                    
                    console.log(this.state.post[0].p_name)
                    // console.log(this.state.long)
                    //  console.log(this.state.lat)

                    this.renderElement();

                }

               // console.log(this.state.post[0].skillid);
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);

                return error;
        });
    }







  //for replies

    async addCommR(cid){
        this.setState({loadingModal:true})
        console.log('addcommR');
        console.log(this.state.uid);;
        var uploaddata=[]
        if(this.state.commentImgR.length>0){
        this.setState({imgStatR:'yes'})
        for (var i=0; i < this.state.commentImgR.length ; ++i){
            await uploaddata.push({'name':'image[]', 'filename': 'photo'+[i], 'type':this.state.commentImgR[i].mime, 'data':this.state.commentImgR[i].data});
        }
        }
        await uploaddata.push({'name':'uid', 'data':this.state.uid});
        await uploaddata.push({'name':'order_id', 'data':this.state.postId});
        await uploaddata.push({'name':'reply', 'data':this.state.commentR});
        await uploaddata.push({'name':'image', 'data':this.state.imgStatR});
        await uploaddata.push({'name':'comment_id', 'data':cid});
        console.log(uploaddata)
        
        const url='https://www.hazirsir.com/web_service/add_reply.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
            //console.log('okkkkkkkkk');
            var res1=responseJson.data;
              console.log(res1);
           // console.log(responseJson);
            console.log(responseJson.data);
            
           
            if(res1.includes('Record created successfully')){
                console.log('okkk');
                this.onPostR(cid);
            }
            this.setState({loadingModal:false})
            return responseJson;
        })
        .catch((error) => {
            reject(error);
            console.log(error);

            return error;
        });
        }.bind(this));
        
    }
  
    async onPostR(cid){
        await this.setState({commentImgR:[], imgStatR:'no', commentR:'',})
        await this.fetchpost();
        console.log('onpostR')
    }




    openGalR(){
        ImagePicker.openPicker({
        compressImageMaxHeight:700,
        compressImageMaxWidth:700,
        compressImageQuality:0.35,
        mediaType:'photo',
        includeBase64:true,
        multiple: false
        }).then(async images => {
        console.log(images);
        var temp=[]
        temp[0]=images
        await this.setState({commentImgR:temp})
        console.log(this.state.commentImgR)
        });
    }
    openCamR(){
        ImagePicker.openCamera({
        compressImageMaxHeight:700,
        compressImageMaxWidth:700,
        compressImageQuality:0.35,
        includeBase64:true,
        // cropping:true
        }).then(async image => {
        console.log(image);
        // this.setState({imgs:this.state.imgs.push(image)})
        var temp=this.state.commentImgR
        temp[0]=image
        this.setState({commentImgR:temp})
        // await this.state.imgs.push(image)
        console.log(this.state.commentImgR)
        });
    }

    async delPhotoR(){
        await this.setState({commentImgR:[], imgStatR:'no'})
        console.log(this.state.commentImgR)
    }

    toggleReply(id){
        var comm = this.state.comments
        comm.forEach((elem) => {
        //   elem.status = false
        if (elem.index === id) {
            elem.status?elem.status=false:elem.status=true
        }else{
            elem.status=false
        }
        })
        this.setState({ comments:comm })
        console.log(this.state.comments[id].status)
        console.log(this.state.comments[id].c_name)
    
    }
  //for replies










    async addComm(){
        this.setState({loadingModal:true})
        console.log('addcomm');
        console.log(this.state.uid);;
        var uploaddata=[]
        if(this.state.commentImg.length>0){
        this.setState({imgStat:'yes'})
        for (var i=0; i < this.state.commentImg.length ; ++i){
            await uploaddata.push({'name':'image[]', 'filename': 'photo'+[i], 'type':this.state.commentImg[i].mime, 'data':this.state.commentImg[i].data});
        }
        }
        await uploaddata.push({'name':'uid', 'data':this.state.uid});
        await uploaddata.push({'name':'order_id', 'data':this.state.postId});
        await uploaddata.push({'name':'comment', 'data':this.state.comment});
        await uploaddata.push({'name':'image', 'data':this.state.imgStat});
        console.log(uploaddata)
        
        const url='https://www.hazirsir.com/web_service/add_comment.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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

              var res=responseJson.data;
              console.log(res);
              
              if(res.includes('Success')){
                console.log('injjhhjjg!!!!');
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
        }.bind(this));
        
    }
  
    async onPost(){
        console.log('inpost');
        await this.setState({commentImg:[], imgStat:'no', comment:''})
        this.fetchpost();
        console.log('onpost')
    }






    openGal(){
        ImagePicker.openPicker({
        compressImageMaxHeight:700,
        compressImageMaxWidth:700,
        compressImageQuality:0.35,
        mediaType:'photo',
        includeBase64:true,
        multiple: false
        }).then(async images => {
        console.log(images);
        var temp=[]
        temp[0]=images
        await this.setState({commentImg:temp})
        console.log(this.state.commentImg)
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
        var temp=this.state.commentImg
        temp[0]=image
        this.setState({commentImg:temp})
        // await this.state.imgs.push(image)
        console.log(this.state.commentImg)
        });
    }

    async delPhoto(){
        await this.setState({commentImg:[], imgStat:'no'})
        console.log(this.state.commentImg)
    }

    openImage(a){
        this.setState({imageFullModal:true, largePhoto:a})
    }



    async apply(){
        if(this.state.bidAmount==='' || this.state.bidComment===''){
            ToastAndroid.show('Fill all fields first.', ToastAndroid.SHORT);
        }
        else{
            const url='https://www.hazirsir.com/web_service/apply_work.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
            // const url='https://www.quaidstp.com/projects/test/test2.php';
            await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    z: [this.state.uid,this.state.post[0].id,this.state.bidComment,this.state.bidAmount, this.state.bidDate, this.state.bidTime]
                })
            })
                .then((response) =>
                    response.json()             
                    )
                .then(async (responseJson) => {
                    // Showing response message coming from server after inserting records.
                    // resolve(responseJson);
                    console.log(responseJson);
                    this.setState({offerModal:false})
                    ToastAndroid.show(responseJson, ToastAndroid.SHORT);
                    Alert.alert(
                        'Hardware',
                        'do you want to order any thing from the E-store',
                        [
                          {text: 'No', onPress: () => this.fetchpost(), style: 'cancel'},
                          {text: 'Yes', onPress: ()=> this.props.navigation.navigate('Tools')},
                        ],
                        { cancelable: false }
                      );
                    //this.fetchpost()
                   
                    return responseJson;
                })
                
                .catch((error) => {
                    // reject(error);
                    console.log(error);

                    return error;
            });
           
           
        }
    }
    timeDiff(){
        var creation
        var todaydate= new Date()
        if(this.state.post.length>0){
            creation=this.state.post[0].datetime
            console.log(creation)
            console.log(todaydate)
            console.log(todaydate.toISOString())
            console.log(todaydate.toISOString().substr(0, 10))
            
            var date1 = new Date(creation.substr(0, 10)); 
            var date2 = new Date(todaydate.toISOString().substr(0, 10)); 

            // var date1 = new Date(creation); 
            // var date2 = new Date(todaydate); 
            
            // To calculate the time difference of two dates 
            var timeDiff = date2.getTime() - date1.getTime(); 
            console.log(timeDiff)
            // To calculate the no. of days between two dates 
            var dayDiff = timeDiff / (1000 * 3600 * 24); 
            console.log(dayDiff)
            if(dayDiff>0){
                this.setState({ago:dayDiff+' days ago'})
            }else{
                this.setState({ago:'Today'})
            }
        }
    }
    async accept(budget, workdate, time, workerId){
        console.log('accept')
        const url='https://www.hazirsir.com/web_service/assign_order.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        // const url='https://www.quaidstp.com/projects/test/test2.php';
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [workerId,this.state.post[0].id, budget, workdate, time]
            })
        })
            .then((response) =>
                response.json()             
                )
            .then(async (responseJson) => {
                // Showing response message coming from server after inserting records.
                // resolve(responseJson);
                console.log(responseJson);
                if(responseJson==='Record created successfully'){
                this.props.navigation.goBack()
                }
                ToastAndroid.show(responseJson, ToastAndroid.SHORT);
                return responseJson;
               
            })
            .catch((error) => {
                // reject(error);
                console.log(error);

                return error;
        });
        Alert.alert(
            'Hardware',
            'Do you want to add any tools from the wholesale store?',
            [
              {text: 'No', onPress: () => console.log('NO is pressed'), style: 'cancel'},
              {text: 'Yes', onPress: ()=> this.props.navigation.navigate('Tools')},
            ],
            { cancelable: false }
          );
    }

    
        generateRoute = async () => {
           

            let abc ='';
            
            console.log('get location');
            navigator.geolocation.getCurrentPosition(
            async position => {
            console.log("Position===>", position);
            await this.setState({
                clat:position.coords.latitude,
                clong:position.coords.longitude
            });
          this.setval(position.coords.latitude,position.coords.longitude)
        },
          error => Alert.alert(error.message),
          { enableHighAccuracy: true, timeout: 20000}
        );

          };



         setval(val1,val2){
            let ways = '';
            let destination = '';
             ways = ways + this.state.lat + ',' + this.state.long;
            if (ways === '' || ways === null) {
              Toast_('No Route is generated!');
              return;
            }

            currentLocation =
            val1 + ',' + val2;
            let url =
              'https://www.google.com/maps/dir/?api=1&origin=' +
              currentLocation +
              '&destination=' +
              currentLocation +
              '&waypoints=' +
              ways;
            console.log('url', url);
           
            Linking.canOpenURL(url)
              .then(supported => {
                if (!supported) {
                  console.warn("Can't handle url: " + url);
                } else {
                  return Linking.openURL(url);
                }
              })
              .catch(err => console.warn('An error occurred', err));
          }
      
          renderElement(){

           

            if(this.state.uid!==this.state.postOwner)
            {
                if(this.state.order_status_s==='Open')
                {
                    
                    this.setState({render_element_s:true})
                    
                }
                else
                {
                    this.setState({render_element_s:false})
                }
                
            }
            else
            {
                this.setState({render_element_s:false})
            }
           
            }
         


    // location_get(){
    //     console.log('get location');
    //     navigator.geolocation.getCurrentPosition(
    //     async position => {
    //     console.log("Position===>", position);
    //     await this.setState({
    //         lat:position.coords.latitude,
    //         clat:position.coords.latitude,
    //         long:position.coords.longitude,
    //         clong:position.coords.longitude,
    //         coordinate: position.coords
    //     });
    //     console.log(this.state.long+'<-long,lat->'+this.state.lat)
    // },
    //   error => Alert.alert(error.message),
    //   { enableHighAccuracy: true, timeout: 20000}
    // );

        
    // };

  render() {

    var name=this.state.p_namme;
    if (name==null){
      name="NA";
    }else{
      name=name.split(' ')[0]
    }

    var loca_mark=name+" Place";


    return (
        <ScrollView>
            <View style={{flex:1}}>
                <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                    <Text style={{fontSize:17, fontWeight:'bold'}}>Task Detail</Text>
                </View>


                <View style={styles.mainViews}>
                    <Text style={{fontSize:this.state.post.length>0?20:15}}>{this.state.post.length>0?this.state.post[0].title:'Loading...'}</Text>
                </View>
                
                
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ViewProf', {ProfileId:this.state.post[0].user_id, OrderId:this.state.post[0].id})}}>
                    <View style={[styles.mainViews, {flexDirection:'row', justifyContent:'center', alignItems:'center'}]}>
                        <View style={{width:'20%', alignItems:'center', justifyContent:'center'}}>
                            <Image 
                                style={{width:40, height:40, borderRadius:32}}    
                                source={{uri:this.state.photo}}/>
                        </View>
                        <View style={{borderBottomColor:'#d1d1d1', width:'80%', flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottomWidth:0.5, paddingBottom:20}}>
                            <View>
                                <Text style={{fontSize:10}}>Posted by</Text>
                                <Text style={{paddingTop:10}}>{this.state.post.length>0?name:'Loading...'}</Text>
                            </View>
                            <View>
                                <Text>{this.state.post.length>0?this.state.ago:'Loading...'}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                
                
                <View style={[styles.mainViews, {flexDirection:'row'}]}>
                    <View style={{width:'20%', alignItems:'center'}}>
                        <Image 
                            style={[
                                {width:25, height:25, marginLeft:3}
                            ]}    
                            source={require('../Logos/physical.png')}/>
                    </View>
                    <View style={{borderBottomColor:'#d1d1d1', width:'80%', flexDirection:'row', justifyContent:'space-between', borderBottomWidth:0.5, paddingBottom:20}}>
                        <View>
                            <Text style={{fontSize:10}}>Location</Text>
                            <Text style={{fontSize:10, paddingTop:5}}>{this.state.post.length>0?this.state.post[0].place:'Loading...'}</Text>
                        {this.state.lat==='NA'?
                            null
                            :
                            <View style={{paddingBottom:'10%'}}>
                            <MapView  
          style={styles.map}  
          showsUserLocation={false}  
          showsMyLocationButton={true}
          zoomEnabled={true} 
          mapType="standard"
          zoomControlEnabled={true}  
          region={{  
            latitude: Number(this.state.lat),   
            longitude: Number(this.state.long),  
            latitudeDelta: 0.003,  
            longitudeDelta: 0.003,  
          }}
          onPress={this.generateRoute}
          >  
            <Marker  
            coordinate={{ latitude: Number(this.state.lat), longitude: Number(this.state.long)}}  
            title={"Location"}  
            description={loca_mark}  
          />  
        </MapView>  
              </View>    
                       
        }
                        </View>
                    
                    </View>
               
                </View>
                
                
                <View style={[styles.mainViews, {flexDirection:'row'}]}>
                    <View style={{width:'20%', alignItems:'center'}}>
                        <Image 
                            style={[
                                {width:25, height:25, marginLeft:3}
                            ]}    
                            source={require('../Logos/calendar.png')}/>
                    </View>
                    <View style={{borderBottomColor:'#d1d1d1', width:'80%', borderBottomWidth:0.5, paddingBottom:20}}>
                        <Text style={{fontSize:10}}>Due date</Text>
                        <Text style={{paddingTop:10}}>{this.state.post.length>0?this.state.post[0].date:'Loading...'}</Text>
                    </View>
                </View>

                
                <View style={[styles.mainViews, {flexDirection:'row'}]}>
                    <View style={{width:'20%', alignItems:'center'}}>
                        <Image 
                            style={[
                                {width:25, height:25, marginLeft:3}
                            ]}    
                            source={require('../Logos/timeofday.png')}/>
                    </View>
                    <View style={{borderBottomColor:'#d1d1d1', width:'80%', borderBottomWidth:0.5, paddingBottom:20}}>
                        <Text style={{fontSize:10}}>Time of day</Text>
                        <Text style={{paddingTop:10}}>{this.state.post.length>0?this.state.post[0].work_time:'Loading...'}</Text>
                    </View>
                </View>
                
                    
               
                    {/* this.state.order_status_s==='Open' ? */}
                
                {/* { this.renderElement()} */}


                  {
                    this.state.render_element_s?
                    <View style={styles.mainViews, {marginHorizontal:10, paddingVertical:10, alignItems:'center', backgroundColor:'#d1d1d1', borderRadius:5, }}>
                        <View><Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>
                            Task Budget
                        </Text></View>
                        <View><Text style={styles.mainViews}>{this.state.post.length>0?'Rs. '+this.state.post[0].budget:'Loading...'}</Text>
                        </View>
                        <TouchableOpacity onPress={async ()=>{
                            var stat=this.state.verStat
                            if(stat==='false'){
                                this.props.navigation.navigate('Cnic')
                              }else if(stat==='checking'){
                                ToastAndroid.show('Your verification process has not been completed yet.', ToastAndroid.SHORT)
                              }else if(stat==='true'){
                                this.setState({offerModal:true})
                               // console.log('navigation');
                        
                              }
                            }}>
                            <View style={[styles.mainViews, {backgroundColor:'#32a84e', borderRadius:5, marginTop:5}]}>
                                <Text style={{color:'white'}}>Make Offer</Text>
                            </View>
                        </TouchableOpacity>
                    </View>:null
                }








                    
                

                <View style={styles.mainViews}>
                    <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Task detail</Text>
                    <Text style={styles.mainViews}>{this.state.post.length>0?this.state.post[0].description:'Loading...'}</Text>
                </View>
                {this.state.img.length>0?
                    <View style={{flex:1, padding:10}}> 
                        <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Photos</Text> 
                        <View>
                            <FlatGrid
                            itemDimension={Number(this.state.width3rd)-15}
                            items={this.state.img}
                            spacing={3}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity 
                            //         onPress={() => {
                            //     this.setState({
                            //         imageIndex: index,
                            //         isImageViewVisible: true,
                            //     });
                            // }}
                                onPress={()=>{this.openImage(item.image_url)}}
                                >
                                    <View style={{padding:5, alignSelf:'center'}}>
                                        <Image 
                                            style={[
                                                styles.icon, styles.inputIcon,
                                            ]} 
                                            source={{uri:item.image_url}}/>
                                    </View>
                                </TouchableOpacity>
                            )}
                            />
                        </View>
                    </View>:null
                }
                {this.state.aud.length>0?
                    <View style={{flex:1, padding:10}}> 
                        <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Audio</Text> 
                        <View>
                            <FlatGrid
                            itemDimension={Number(this.state.width3rd)-10}
                            items={this.state.aud}
                            spacing={0}
                            renderItem={({ item, index }) => (
                                    <View style={{padding:5, alignSelf:'center'}}>
                                    {/* <Video source={{uri:item.video_url}}   // Can be a URL or a local file.
                                        ref={(ref) => {
                                            this.player = ref
                                        }}                                      // Store reference
                                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                        onError={this.videoError}               // Callback when video cannot be loaded
                                        style={{height:200, width:200}} /> */}
                                        <Video source={{uri: item.audio_url}}        // Can be a URL or a local file.
                                            ref="audioElement"              // Pauses playback entirely.
                                            onLoad={this.onLoad}            // Callback when video loads
                                            onProgress={this.onProgress}    // Callback every ~250ms with currentTime
                                            paused={this.state.paused}
                                            onEnd={this.onEnd}
                                            style={{height:0, width:0}}
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
                            )}
                            />
                        </View>
                    </View>:null
                }
                {this.state.vid.length>0?
                    <View style={{flex:1, padding:10}}> 
                        <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Video</Text> 
                        <View>
                            <FlatGrid
                            itemDimension={Number(this.state.width3rd*2)-10}
                            items={this.state.vid}
                            spacing={0}
                            renderItem={({ item, index }) => (
                                <View style={{padding:5, alignSelf:'center'}}>
                                {/* <Video source={{uri:item.video_url}}   // Can be a URL or a local file.
                                    ref={(ref) => {
                                        this.player = ref
                                    }}                                      // Store reference
                                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                    onError={this.videoError}               // Callback when video cannot be loaded
                                    style={{height:200, width:200}} /> */}
                                    <Video source={{uri: item.video_url}}        // Can be a URL or a local file.
                                        ref={(ref) => {
                                            this.player = ref
                                        }}                              // Pauses playback entirely.
                                        onLoad={this.onLoadVid}            // Callback when video loads
                                        onProgress={this.onProgressVid}    // Callback every ~250ms with currentTime
                                        paused={this.state.pausedVid}
                                        onEnd={this.onEndVid}
                                        style={{height:200, width:200}}
                                        repeat={true} 
                                        /> 
                                        <Slider
                                            value={this.state.currentTimeVid}
                                            minimumValue={0}
                                            maximumValue={this.state.durationVid}
                                            onSlidingComplete={value =>  this.onSeekingVid(value)}
                                            trackStyle={styles.trackStyle}
                                            thumbStyle={styles.thumbStyle}
                                            minimumTrackTintColor='#333'

                                            />
                                            <View style={styles.timeDurationContainer}>
                                                <Text>{this.msToTimeVid(this.state.currentTimeVid)}</Text>
                                                <Text>{ this.msToTimeVid(this.state.durationVid)}</Text>
                                            </View>

                                            <View style={styles.bContainer}>
                                            <TouchableOpacity style={styles.btnContainer} onPress={this.onPauseVid.bind(this)}>
                                                {!this.state.pausedVid ? (
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
                            )}
                            />
                        </View>
                    </View>:null
                }
                {/* <ImageView
                    isTapZoomEnabled
                    isPinchZoomEnabled
                    isSwipeCloseEnabled
                    glideAlways
                    images={this.state.images}
                    // imageIndex={this.state.imageIndex}
                    animationType="fade"
                    isVisible={this.state.isImageViewVisible}
                    // renderFooter={this.renderFooter}
                    onClose={() => this.setState({isImageViewVisible: false})}
                    onImageChange={index => {
                        console.log(index);
                    }}
                /> */}
                <View style={styles.mainViews}>
                    <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Offers</Text>
                    {
                        this.state.offers.length<1?
                        <Text style={{left:10, color:'gray'}}>No offers yet</Text>:null
                    }
                    <View>
                        <FlatList 
                            enableEmptySections={true}
                            data={this.state.offers}
                            renderItem={({item}) => {
                                // const rowData=service.image;
                                return (
                                    
                                <View>
                                    {
                                    this.state.offers.length>0?
                                    <View style={{backgroundColor:'white', marginTop:5}}>
                                        <View style={{width:'100%',flexDirection:'row', justifyContent:'center', paddingVertical:10}}>
                                            <View style={{width:'20%'}}>
                                            <TouchableOpacity onPress={()=>{
                                                this.props.navigation.navigate('ViewProf', 
                                                    {
                                                        ProfileId:item.worker_id,
                                                        OrderId:this.state.post[0].id,
                                                        From:this.state.uid===this.state.post[0].user_id?' ':'Offers'
                                                    }
                                                )}}>
                                                <View>
                                                    <Image 
                                                    style={[{width:65, height:65, borderRadius:32}]}    
                                                    source={{uri:item.worker_pic}}/>
                                                </View>
                                            </TouchableOpacity>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text>
                                                    {item.worker_name}
                                                </Text>
                                                <View style={{width:'85%',paddingVertical:3, borderRadius:5, backgroundColor:'#32a84e', justifyContent:'center', alignItems:'center'}}>
                                                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('PrevWork', {worker_id:item.worker_id, skill_id:this.state.skillid})}}>
                                                        <Text style={{color:'white'}}>Previous Works</Text>
                                                    </TouchableOpacity>
                                                    </View>
                                                <View>
                                                    {/* <Image 
                                                    style={[
                                                        {width:18, height:18, marginLeft:3}
                                                    ]}    
                                                    source={require('../Logos/physical.png')}/> */}
                                                    <Text style={{width:'85%', fontSize:10}}>{'Offer date: '}</Text>
                                                    <Text style={{fontSize:10}}>{item.available_date+' '+item.time}</Text>
                                                    <Text style={{fontSize:10}}>{'Message: '}</Text>
                                                    <Text style={{width:'85%', fontSize:10}}>{item.comment}</Text>
                                                 
                                                </View>
                                            </View>
                                            <View style={{width:'20%'}}>
                                                <Text>
                                                    {'Budget '+item.price}
                                                </Text>
                                                {
                                                    this.state.uid===this.state.postOwner?
                                                    <View style={{paddingVertical:3, borderRadius:5, backgroundColor:'#32a84e', justifyContent:'center', alignItems:'center'}}>
                                                    <TouchableOpacity onPress={()=>{
                                                        Alert.alert(
                                                            'Accept Offer',
                                                            'Do you want to assign this task to '+item.worker_name+'?',
                                                            [
                                                              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                              {text: 'Yes', onPress: ()=> this.accept(item.price, item.available_date, item.time, item.worker_id)},
                                                            ],
                                                            { cancelable: false }
                                                        )
                                                    }}>
                                                        <Text style={{color:'white'}}>Accept</Text>
                                                    </TouchableOpacity>
                                                    </View>
                                                    :null
                                                }
                                                
                                            </View>
                                        </View> 
                                    </View>
                                    :
                                    null
                                    }
                                </View>  
                                )
                            }
                        }/>
                    </View>
                </View>
                
                <View style={styles.mainViews}>
                    <Text style={[styles.mainViews, {fontSize:20, fontWeight:'bold'}]}>Comments</Text>
                    <View>
                        <View style={[styles.mainViews, {flexDirection:'row', justifyContent:'center', alignItems:'center'}]}>
                            <View style={{width:'20%', alignItems:'center', justifyContent:'center'}}>
                                <Image 
                                    style={{width:40, height:40, borderRadius:32}}    
                                    source={{uri:this.state.photo}}/>
                            </View>
                            <View style={{borderBottomColor:'#d1d1d1', width:'80%', flexDirection:'column', alignItems:'center', justifyContent:'space-between', borderBottomWidth:0.5, paddingBottom:20}}>
                                <View style={styles.inputContainer}>
                                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/envelope/androidL/40/3498db'}}/> */}
                                    <TextInput style={{width:'100%', }}
                                        fontStyle={'Montserrat-Medium'}
                                        value={this.state.comment}
                                        onChangeText={(comment) => this.setState({comment})}
                                        placeholder={this.state.post.length>0?("Ask "+name+" a question"):'loading..'}
                                        underlineColorAndroid='transparent'/>
                                </View>
                                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
                                    <View>
                                        <TouchableOpacity onPress={()=>this.openGal()}>
                                            <Image 
                                                    style={[
                                                        {marginTop:7, width:20, height:20}
                                                    ]} 
                                                    source={require('../Logos/attachImg.png')}/>
                                        </TouchableOpacity>  
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={()=>this.openCam()}>
                                            <Image 
                                                    style={[
                                                        {marginTop:7, width:20, height:20}
                                                    ]} 
                                                    source={require('../Logos/openCam2.png')}/>
                                        </TouchableOpacity> 
                                    </View>
                                    {
                                        this.state.commentImg.length>0?
                                        <View>
                                            <TouchableOpacity onPress={()=>this.delPhoto()}>
                                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                                                    <Image 
                                                        style={[
                                                            {marginTop:7, width:20, height:20}
                                                        ]} 
                                                        source={require('../Logos/delPhoto.png')}/>
                                                    <Text style={{color:'red', top:3}}>Remove image</Text> 
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        :null
                                    }
                                    <View style={{alignSelf:'flex-end'}}>
                                        <TouchableOpacity onPress={()=>{if(this.state.comment!==''){this.addComm()}}}>
                                            <Image 
                                                    style={[
                                                        {marginTop:7, width:20, height:20}
                                                    ]} 
                                                    source={require('../Logos/sendComment.png')}/>
                                        </TouchableOpacity> 
                                    </View>
                                </View> 
                            </View>
                        </View>

                        <FlatList 
                            enableEmptySections={true}
                            data={this.state.comments}
                            renderItem={({item, index}) => {
                                // const rowData=service.image;
                                return (
                                    
                                <View>
                                    {
                                    this.state.comments.length>0?
                                    <View style={{backgroundColor:'#c2c2c2', marginTop:5, paddingVertical:15, borderRadius:10}}>
                                        <View style={{width:'100%',flexDirection:'row'}}>
                                            <View style={{width:'10%'}}>
                                            <Image 
                                            style={[
                                                {width:20, height:20, borderRadius:10}
                                            ]}    
                                            source={{uri:item.c_photo}}/>
                                            </View>
                                            <View>
                                                <Text>{item.c_name}</Text>
                                            </View>
                                        </View>  
                                        <View style={{marginTop:10 ,padding:10 ,marginHorizontal:10, paddingHorizontal:10, borderRadius:5, borderBottomStartRadius:item.comment_url?0:5, borderBottomEndRadius:item.comment_url?0:5, backgroundColor:'#f5f5f5'}}>
                                            <Text>{item.comment}</Text>
                                        </View>
                                        {
                                            item.comment_url?
                                            <View style={{borderBottomStartRadius:5, borderBottomEndRadius:5, marginHorizontal:10, paddingHorizontal:10, alignItems:'center', paddingBottom:10, backgroundColor:'#f5f5f5'}}>
                                                <TouchableOpacity onPress={()=>{this.openImage(item.comment_url)}}>
                                                    <Image 
                                                        style={[
                                                            {width:100, height:100, borderRadius:20, resizeMode:'contain'}
                                                        ]}    
                                                        source={{uri:item.comment_url}}/>
                                                </TouchableOpacity>
                                            </View>
                                            :null
                                        }
                                        <View style={{alignItems:'flex-end', marginRight:10}}>
                                            {
                                                !item.status?
                                                <TouchableOpacity onPress={()=>{this.toggleReply(index)}}>
                                                    <View>
                                                        <Text style={{fontSize:13}}>
                                                            Reply
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>:
                                                <View style={{alignItems:'flex-end'}}>
                                                    <TouchableOpacity onPress={()=>{this.toggleReply(index)}}>
                                                        <View>
                                                            <Text style={{fontSize:13}}>
                                                                Hide
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={{borderRadius:10, borderColor:'#d1d1d1', width:'70%', alignItems:'center', justifyContent:'space-between', borderWidth:0.5, padding:10}}>
                                                        <View style={styles.inputContainer}>
                                                            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/envelope/androidL/40/3498db'}}/> */}
                                                            <TextInput style={styles.inputs}
                                                                value={this.state.commentR}
                                                                onChangeText={(commentR) => this.setState({commentR})}
                                                                placeholder={'Reply for the above comment'}
                                                                underlineColorAndroid='transparent'/>
                                                        </View>
                                                        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
                                                            <View>
                                                                <TouchableOpacity onPress={()=>this.openGalR()}>
                                                                    <Image 
                                                                            style={[
                                                                                {marginTop:7, width:20, height:20}
                                                                            ]} 
                                                                            source={require('../Logos/attachImg.png')}/>
                                                                </TouchableOpacity>  
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity onPress={()=>this.openCamR()}>
                                                                    <Image 
                                                                            style={[
                                                                                {marginTop:7, width:20, height:20}
                                                                            ]} 
                                                                            source={require('../Logos/openCam2.png')}/>
                                                                </TouchableOpacity> 
                                                            </View>
                                                            {
                                                                this.state.commentImgR.length>0?
                                                                <View>
                                                                    <TouchableOpacity onPress={()=>this.delPhotoR()}>
                                                                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                                                                            <Image 
                                                                                style={[
                                                                                    {marginTop:7, width:20, height:20}
                                                                                ]} 
                                                                                source={require('../Logos/delPhoto.png')}/>
                                                                            <Text style={{color:'red', top:3}}>Remove image</Text> 
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                :null
                                                            }
                                                            <View style={{alignSelf:'flex-end'}}>
                                                                <TouchableOpacity onPress={()=>{if(this.state.commentR!==''){this.addCommR(item.id)}}}>
                                                                    <Image 
                                                                            style={[
                                                                                {marginTop:7, width:20, height:20}
                                                                            ]} 
                                                                            source={require('../Logos/sendComment.png')}/>
                                                                </TouchableOpacity> 
                                                            </View>
                                                        </View> 
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                        {this.state.replies.map((a)=>{return (
                                            <View>
                                            {
                                            this.state.replies.length>0 && a.comment_id===item.id?
                                                <View style={{width:'100%',alignItems:'flex-end', backgroundColor:'#c2c2c2', marginTop:5, paddingVertical:15}}>
                                                    <View style={{flexDirection:'row-reverse', paddingVertical:5}}>
                                                        <View style={{width:'10%'}}>
                                                        <Image 
                                                        style={[
                                                            {width:20, height:20, borderRadius:10}
                                                        ]}    
                                                        source={{uri:a.client_picture}}/>
                                                        </View>
                                                        <View>
                                                            <Text>{a.client_name}</Text>
                                                        </View>
                                                    </View>  
                                                    <View style={{margin:10, padding:10, borderRadius:5, backgroundColor:'#f5f5f5', alignItems:'flex-end'}}>
                                                        <Text>{a.reply}</Text>
                                                    </View>
                                                    {
                                                        a.reply_image_url?
                                                        <View style={{width:'100%', alignItems:'center', backgroundColor:'#f5f5f5', paddingBottom:10}}>
                                                            <TouchableOpacity onPress={()=>{this.openImage(a.reply_image_url)}}>
                                                                <Image 
                                                                    style={[
                                                                        {width:100, height:100, borderRadius:20, resizeMode:'contain'}
                                                                    ]}    
                                                                    source={{uri:a.reply_image_url}}/>
                                                            </TouchableOpacity>
                                                        </View>
                                                        :null
                                                    }

                                                    
                                                    {/* thisis for adding reply feature to replies */}
                                                    {/* <View style={{alignItems:'flex-end', marginRight:10}}>
                                                        {
                                                            !a.status?
                                                            <TouchableOpacity onPress={()=>{this.toggleReply(index)}}>
                                                                <View>
                                                                    <Text style={{fontSize:13}}>
                                                                        Reply
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>:
                                                            <View style={{alignItems:'flex-end'}}>
                                                                <TouchableOpacity onPress={()=>{this.toggleReply(index)}}>
                                                                    <View>
                                                                        <Text style={{fontSize:13}}>
                                                                            Hide
                                                                        </Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                <View style={{borderRadius:10, borderColor:'#d1d1d1', width:'70%', alignItems:'center', justifyContent:'space-between', borderWidth:0.5, padding:10}}>
                                                                    <View style={styles.inputContainer}>
                                                                        <TextInput style={styles.inputs}
                                                                            value={this.state.commentR}
                                                                            onChangeText={(commentR) => this.setState({commentR})}
                                                                            placeholder={'Reply for the above comment'}
                                                                            underlineColorAndroid='transparent'/>
                                                                    </View>
                                                                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
                                                                        <View>
                                                                            <TouchableOpacity onPress={()=>this.openGalR()}>
                                                                                <Image 
                                                                                        style={[
                                                                                            {marginTop:7, width:20, height:20}
                                                                                        ]} 
                                                                                        source={require('../Logos/attachImg.png')}/>
                                                                            </TouchableOpacity>  
                                                                        </View>
                                                                        <View>
                                                                            <TouchableOpacity onPress={()=>this.openCamR()}>
                                                                                <Image 
                                                                                        style={[
                                                                                            {marginTop:7, width:20, height:20}
                                                                                        ]} 
                                                                                        source={require('../Logos/openCam2.png')}/>
                                                                            </TouchableOpacity> 
                                                                        </View>
                                                                        {
                                                                            this.state.commentImgR.length>0?
                                                                            <View>
                                                                                <TouchableOpacity onPress={()=>this.delPhotoR()}>
                                                                                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                                                                                        <Image 
                                                                                            style={[
                                                                                                {marginTop:7, width:20, height:20}
                                                                                            ]} 
                                                                                            source={require('../Logos/delPhoto.png')}/>
                                                                                        <Text style={{color:'red', top:3}}>Remove image</Text> 
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            :null
                                                                        }
                                                                        <View style={{alignSelf:'flex-end'}}>
                                                                            <TouchableOpacity onPress={()=>{if(this.state.commentR!==''){this.addCommR(a.id)}}}>
                                                                                <Image 
                                                                                        style={[
                                                                                            {marginTop:7, width:20, height:20}
                                                                                        ]} 
                                                                                        source={require('../Logos/sendComment.png')}/>
                                                                            </TouchableOpacity> 
                                                                        </View>
                                                                    </View> 
                                                                </View>
                                                            </View>
                                                        }
                                                    </View> */}
                                                </View>
                                                :
                                                null
                                                }
                                            </View>  
                                        )})}
                                    </View>
                                    :
                                    null
                                    }
                                </View>  
                                )
                            }
                        }/>
                        
                    </View>
                </View>
            </View>
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
                            {width:'100%', height:'100%',  resizeMode : 'contain', margin: 5 }
                        ]}    
                        source={{uri:this.state.largePhoto}}/>
                    </View>
                    
                    :
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text>Loading</Text>
                    </View>
                }
            </Modal>
            <Modal
                style={{flex:1}}
                animationType="slide"
                transparent={false}
                visible={this.state.offerModal}
                onRequestClose={() => {
                    this.setState({offerModal:false, bidAmount:'', bidComment:'', bidTime:''});
                }}>
                {
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', height:'100%', width:'100%', borderWidth:1 }}>
                        <Text style={{marginTop:15}}>Pick due date</Text>
                        <View style={styles.inputContainerBid}>
                        <DatePicker
                        style={{width: '100%'}}
                        date={this.state.bidDate}
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
                        onDateChange={async (date) => {await this.setState({bidDate: date})}}
                        />
                        </View>
                        <Text style={{marginTop:15}}>Select time of day</Text>
                        <View style={styles.inputContainerBid}>
                            <Picker selectedValue={this.state.bidTime} style={{left:8, height: 45, width: '100%'}} onValueChange={(itemValue, itemIndex) => this.setState({bidTime: itemValue})}>
                                <Picker.Item label="Morning" value="Morning" />
                                <Picker.Item label="Afternoon" value="Afternoon" />
                                <Picker.Item label="Evening" value="Evening" />
                                <Picker.Item label="Night" value="Night" />
                            </Picker>
                        </View>
                        <View style={styles.inputContainerBid}>
                            <TextInput style={styles.inputsBid}
                                value={this.state.bidComment}
                                onChangeText={(bidComment) => this.setState({bidComment})}
                                placeholder={this.state.post.length>0?("Any questions?"):'Loading..'}
                                underlineColorAndroid='transparent'/>
                        </View>
                        <View style={styles.inputContainerBid}>
                            <TextInput style={styles.inputsBid}
                                value={this.state.bidAmount}
                                placeholder={'Enter your bid amount'}
                                keyboardType={'numeric'}
                                onChangeText={(bidAmount) => this.setState({bidAmount})}
                                underlineColorAndroid='transparent'/>
                        </View>
                        <TouchableOpacity onPress={()=>this.apply()}>
                            <View style={[styles.mainViews, {backgroundColor:'#32a84e', borderRadius:5, marginTop:5}]}>
                                <Text style={{color:'white'}}>Make offer</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </Modal>
            <NavigationEvents
                onWillFocus={
                this.state.secondTime?() => this.fetchpost():null
                }
            />
        </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:200
      },
    mainViews: {
        padding:8,
        width:'100%',
    },
    icon:{
      width:Math.round(Math.round(Dimensions.get('window').width)/4),
      height:100
    },
    inputIcon:{
      justifyContent: 'center'
    },
    imgContainer:{
        backgroundColor:'#666',
        flex:2,
      },
      bContainer:{
        alignItems:'center'
      },

      map: {
        height:Math.round(Dimensions.get('window').height)-500,
        width:Math.round(Dimensions.get('window').width)-100,
        top: 20,
        left: 0,
        right: 0,
      },
    
      btnContainer:{ 
        padding: 10,
        margin: 10,
        borderRadius: 100,
        justifyContent:'center',
        alignItems: 'center', 
        borderWidth: 5,
        borderColor: '#ffffff',
    
    
      },
      progressContainer:{
        width:'100%',
        height: 2,
        backgroundColor:'#fff'
      },
      timeDurationContainer:{ 
        flexDirection: 'row',
        backgroundColor: '#d1d1d1',
        justifyContent:'space-between',
        borderRadius:10,
        padding:10,
    
    
      },
      trackStyle:{
        backgroundColor:'#666',
      },
      thumbStyle:{
        backgroundColor:'#d63031',
    
      },
      inputContainerBid: {
        padding:5,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
        borderRadius:5,
        borderWidth: 1,
        width:'50%',
        height:45,
        marginBottom:15,
        flexDirection: 'row',
        alignItems:'center'
      },
      inputsBid:{
          height:45,
          marginLeft:16,
          borderBottomColor: '#FFFFFF',
          flex:1,
      },
})
export default TaskDetails;
