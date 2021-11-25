import React, { Component } from 'react';
import { 
    View, Text, StyleSheet,Alert, TouchableOpacity, Image,
    ImageBackground, 
    ToastAndroid
} from 'react-native';
// import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';  
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-tiny-toast'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });


class CNIC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs:[],
            ButtonStateHolder : true ,
        };
    }
    async componentDidMount(){
        // const screenWidth = Math.round(Dimensions.get('window').width);
        // await this.setState({width3rd:Math.round(screenWidth/3)})
        const value = await AsyncStorage.getItem('userID')
        await this.setState({uid:value})
        console.log(this.state.uid)
        await AsyncStorage.setItem('tasker_signed', 'cnic')

    }
    async savePhoto(){
      var uploaddata=[]
      if(this.state.imgs.length===3){
        // this.setState({imgStat:'yes'})
        for (var i=0; i < this.state.imgs.length ; ++i){
          await uploaddata.push({'name':'image[]', 'filename': 'photo'+[i], 'type':this.state.imgs[i].mime, 'data':this.state.imgs[i].data});
        }
        await uploaddata.push({'name':'uid','data' :this.state.uid})
        const url='https://www.hazirsir.com/web_service/upload_cnic_image.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
               this.storeData();

               this.props.navigation.dispatch(resetAction)
                // this.props.navigation.goBack()
                // this.props.navigation.navigate("Home")
                }else{
                    ToastAndroid.show(responseJson, ToastAndroid.SHORT)
                }
                return responseJson;
            })
            .catch((error) => {
                reject(error);
                console.log(error);
    
                return error;
            });
        }.bind(this));
        }else{
            Toast.show('Please add all photos.', {
              duration:Toast.duration.LONG
            })
        }
    }



    storeData = async () => {
        try {
     
          await AsyncStorage.setItem('Signed', '1')
         
        } catch (e) {
          // saving error
        }
      }


    openGal(a){
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
          if(a==='front'){
            temp[0]=images
          }
          else if (a==='back') {
            if(this.state.imgs.length===0){
                temp[0]='xyz'
                temp[1]=images
                console.log('back');
            }else{
                temp[0]=this.state.imgs[0]
                temp[1]=images
                console.log('back');
            }
           // temp[1]=image
            }
            else if (a==='photo') {
                if(this.state.imgs.length===0){
                    temp[0]='xyz'
                    temp[1]='abc'
                    temp[2]=images
                    console.log('photo');
                }else{
                    temp[0]=this.state.imgs[0]
                    temp[1]=this.state.imgs[1]
                    temp[2]=images
                    console.log('photo');
                }
                }
          await this.setState({imgs:temp})
          console.log(this.state.imgs)
        });
    }
    openCam(a){
        ImagePicker.openCamera({
          compressImageMaxHeight:700,
          compressImageMaxWidth:700,
          compressImageQuality:0.35,
          includeBase64:true,
          // cropping:true
        }).then(async image => {
          console.log(image);
          // this.setState({imgs:this.state.imgs.push(image)})
          var temp=[]
          if(a==='front'){
              if(this.state.imgs.length===0){
                temp[0]=image
               // temp[1]='abc'
                //temp[2]='ijk'
                console.log('front');
              }
        
         else {
               
               temp[1]=this.state.imgs[1];
               tem[2]=this.state.imgs[2]
               temp[0]=image;
               }
           
            }
        
          else if (a==='back') {
            if(this.state.imgs.length===0){
                temp[0]='xyz'
                temp[1]=image
                console.log('back');
            }else{
                temp[0]=this.state.imgs[0]
                temp[1]=image
                console.log('back');
            }
           // temp[1]=image
            }

            else if (a==='photo') {
                if(this.state.imgs.length===0){
                    temp[0]='xyz'
                    temp[1]='abc'
                    temp[2]=image
                    console.log('photo');
                }else{
                    temp[0]=this.state.imgs[0]
                    temp[1]=this.state.imgs[1]
                    temp[2]=image
                    console.log('photo');
                }
                }
                console.log("output!");
                //console.log(temp);
          this.setState({imgs:temp});
          console.log("state set!");
          console.log(this.state.imgs);
          
          // await this.state.imgs.push(image)
         // console.log(this.state.imgs)
        });
    }
    
    async delPhoto(a){
        if(a === 'front'){
            var temp=this.state.imgs
            if(this.state.imgs.length===3 || this.state.imgs.length===2){
                temp[0]='xyz'
                
                this.setState({imgs:temp})
            }
            else{
                this.setState({imgs:[]})

            }
        }else if (a === 'back'){ 
            var temp1=this.state.imgs
            if(this.state.imgs.length===3){
                temp1[1]='abc'
                temp1[0]=this.state.imgs[0]
                temp1[2]=this.state.imgs[2]
                this.setState({imgs:temp1})
            }
            else if (this.state.imgs.length===2){
             
             if(temp1[0] == null && temp1[2] !== null){
                temp1[1]='abc'
                temp1[0]='xyz'
                temp1[2]=this.state.imgs[2]
             }
             else {
                temp1[1]='abc'
                temp1[0]=his.state.imgs[0]
                temp1[2]='ijk'
             }

            }
            else{
                this.setState({imgs:[]})

            }

        }
        else if (a==='photo'){
            var temp3=[];
            temp3[0]=this.state.imgs[0];
            temp3[1]=this.state.imgs[1];
            this.setState({imgs:temp3});
        
        
            //this.setState({imgs:[]});
        }
        console.log(this.state.imgs)
    
}
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                    <Text style={{fontSize:17, fontWeight:'bold'}}>CNIC Verification</Text>
                </View>
                
                <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
                    <Text style={{fontSize:10}}>FRONT SIDE</Text>
                </View>
                <View>
                {
                    this.state.imgs[0] && this.state.imgs[0]!=='xyz'?
                    <View style={[styles.inputContainer, {height:180, flexDirection:'column'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <View style={{width:'85%', height:'70%', justifyContent:'center', alignItems:'center'}}>
                        {/* <ScrollView horizontal={true}> */}
                            <FlatList 
                                horizontal={true}
                                data={this.state.imgs}
                                renderItem={({item, index}) => {
                                    return (
                                        <View>
                                        {
                                            index===0?
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
                                                    <TouchableOpacity onPress={()=>this.delPhoto('front')}>
                                                        <View style={{margin:5}}>
                                                        <Image 
                                                            style={[
                                                                {width:25, height:25, marginLeft:3}
                                                            ]} 
                                                            source={require('../../Logos/delPhoto.png')}/>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ImageBackground>
                                            </View>:
                                            null
                                        
                                        }
                                        </View>
                                        
                                    )
                                }
                            }/>  
                        {/* </ScrollView> */}
                        </View>
                        
                    </View>
                    :
                    <View style={[styles.inputContainer, {paddingBottom:10, height:70, justifyContent:'space-evenly'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <TouchableOpacity onPress={()=>this.openGal('front')}>
                            <View style={{flexDirection:'row'}}>
                                <Image 
                                        style={[
                                            {marginTop:7, width:50, height:50, marginLeft:3}
                                        ]} 
                                        source={require('../../Logos/openGal.png')}/>
                            </View>
                        </TouchableOpacity>  
                        <TouchableOpacity onPress={()=>this.openCam('front')}>
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
                    <Text style={{fontSize:10}}>BACK SIDE</Text>
                </View>
                <View>
                {
                    this.state.imgs[1] && this.state.imgs[1]!=='abc'?
                    <View style={[styles.inputContainer, {height:180, flexDirection:'column'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <View style={{width:'85%', height:'70%', justifyContent:'center', alignItems:'center'}}>
                        {/* <ScrollView horizontal={true}> */}
                            <FlatList 
                                horizontal={true}
                                data={this.state.imgs}
                                renderItem={({item, index}) => {
                                    return (
                                        <View>
                                        {
                                            index===1?
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
                                                    <TouchableOpacity onPress={()=>this.delPhoto('back')}
                                                                disabled={!this.state.imgs[0]}
                                                                >
                                                        <View style={{margin:5}}>
                                                        <Image 
                                                            style={[
                                                                {width:25, height:25, marginLeft:3}
                                                            ]} 
                                                            source={require('../../Logos/delPhoto.png')}/>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ImageBackground>
                                            </View>:
                                            null
                                        
                                        }
                                        </View>
                                        
                                    )
                                }
                            }/>  
                        {/* </ScrollView> */}
                        </View>
                    </View>
                    :
                    <View style={[styles.inputContainer, {paddingBottom:10, height:70, justifyContent:'space-evenly'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <TouchableOpacity onPress={()=>{this.openGal('back'); 
                                                        Toast.show('Please upload first picture.', {
                                                            duration:Toast.duration.LONG
                                                          });}}
                                                     disabled={!this.state.imgs[0]}
                                                     >
                            <View style={{flexDirection:'row'}}>
                                <Image 
                                        style={[
                                            {marginTop:7, width:50, height:50, marginLeft:3}
                                        ]} 
                                        source={require('../../Logos/openGal.png')}/>
                            </View>
                        </TouchableOpacity>  
                        <TouchableOpacity onPress={()=>{this.openCam('back');
                                                    Toast.show('Please upload first picture.', {
                                                        duration:Toast.duration.LONG
                                                      });}}
                                                      disabled={!this.state.imgs[0]}>
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
                    <Text style={{fontSize:10}}>UPLOAD YOUR PHOTO</Text>
                </View>
                <View>
                {
                    this.state.imgs[2] && this.state.imgs[2]!=='ijk'?
                    <View style={[styles.inputContainer, {height:180, flexDirection:'column'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <View style={{width:'85%', height:'70%', justifyContent:'center', alignItems:'center'}}>
                        {/* <ScrollView horizontal={true}> */}
                            <FlatList 
                                horizontal={true}
                                data={this.state.imgs}
                                renderItem={({item, index}) => {
                                    return (
                                        <View>
                                        {
                                            index===2?
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
                                                    <TouchableOpacity onPress={()=>this.delPhoto('photo')}
                                                                          disabled={!this.state.imgs[1]}>
                                                        <View style={{margin:5}}>
                                                        <Image 
                                                            style={[
                                                                {width:25, height:25, marginLeft:3}
                                                            ]} 
                                                            source={require('../../Logos/delPhoto.png')}/>
                                                        </View>
                                                    </TouchableOpacity>
                                                </ImageBackground>
                                            </View>:
                                            null
                                        
                                        }
                                        </View>
                                        
                                    )
                                }
                            }/>  
                        {/* </ScrollView> */}
                        </View>
                    </View>
                    :
                    <View style={[styles.inputContainer, {paddingBottom:10, height:70, justifyContent:'space-evenly'}]}>
                        {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
                        
                        <TouchableOpacity onPress={()=>this.openGal('photo')}
                                           disabled={!this.state.imgs[1]}>
                            <View style={{flexDirection:'row'}}>
                                <Image 
                                        style={[
                                            {marginTop:7, width:50, height:50, marginLeft:3}
                                        ]} 
                                        source={require('../../Logos/openGal.png')}/>
                            </View>
                        </TouchableOpacity>  
                        <TouchableOpacity onPress={()=>this.openCam('photo')}
                                            disabled={!this.state.imgs[1]}>
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


                <View style={{width:'100%', justifyContent:'center', alignItems:'center', paddingHorizontal:10}}>
                    <TouchableOpacity onPress={()=>this.savePhoto()}>
                    <Image 
                        style={[
                            {width:30, height:30}
                        ]} 
                        source={require('../../Logos/sendComment.png')}/>
                    </TouchableOpacity>
                </View>

               


            </View>
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default CNIC;
