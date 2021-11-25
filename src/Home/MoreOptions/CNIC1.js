import React, { Component } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Image,
    ImageBackground, 
    ToastAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';  
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-tiny-toast'
import { ScrollView, FlatList } from 'react-native-gesture-handler';

class CNIC1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs:[]
        };
    }


    async componentDidMount(){
        // const screenWidth = Math.round(Dimensions.get('window').width);
        // await this.setState({width3rd:Math.round(screenWidth/3)})
        const value = await AsyncStorage.getItem('userID')
        await this.setState({uid:value})
        console.log(this.state.uid)
    }

    openCam = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.launchCamera(options, (response) => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log('response', JSON.stringify(response));
            // this.setState({
            //   filePath: response,
            //   fileData: response.data,
            //   fileUri: response.uri
            // });
          }
        });
      }


    render() {
        return (
            <View style={styles.container}>
                <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                    <Text style={{fontSize:17, fontWeight:'bold'}}>CNIC Verification</Text>
                </View>
                
                <View style={{width:'100%', justifyContent:'center', paddingHorizontal:10}}>
                    <Text style={{fontSize:10}}>FRONT SIDE</Text>
                </View>
                
                
        

                <View>
                
                    
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
                
                </View>


            
            </View>
            
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

export default CNIC1;