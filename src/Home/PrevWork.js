//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';  
import { FlatList } from 'react-native-gesture-handler' 
import { Rating, AirbnbRating } from 'react-native-ratings';

// create a component
class PrevWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid:'',
            skillid:'',
            reviews:[],
            imageFullModal:false,
            largePhoto:'',
        };
      }
    async componentDidMount(){
      var worker_id = this.props.navigation.getParam('worker_id', '0');
      await this.setState({uid:worker_id})
      var skill_id = this.props.navigation.getParam('skill_id', '0');
    //   console.log("skillid");
    //   console.log(skill_id);
      await this.setState({skillid:skill_id})
     await this.fetchreviews();
    }
    openImage(a){
      this.setState({imageFullModal:true, largePhoto:a})
    }

    async fetchreviews(){
        console.log(this.state.uid);
        const url='https://www.hazirsir.com/web_service/worker_related_work.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [this.state.uid,this.state.skillid],
            })
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log(responseJson);
                if(responseJson!=""){
                    await this.setState({
                        reviews:responseJson,
                      })
                }
               
               
    
    
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);
    
                return error;
        });
      }

      render() {
          if(this.state.reviews!=""){

            return (
                <View style={styles.container}>
                    <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
                        <Text style={{fontSize:17, fontFamily:'Montserrat-Bold'}}>All Reviews</Text>
                    </View>
                    <View style={{marginBottom:50}}>
                        <FlatList
                            data={this.state.reviews}
                            renderItem={({item})=>{return(
                                <View style={{
                                    marginBottom:10,
                                    borderRadius:10,
                                    elevation:5,
                                    padding:10,
                                    margin:10,
                                    backgroundColor:'white'}}>
                                    <View style={{width:'100%', alignItems:'center', flexDirection:"row"}}>
                                        <View style={{alignSelf:'center'}}>
                                            <Image 
                                                style={{width:70, height:70, borderRadius:35}} 
                                                source={{uri:item.poster_photo}}/>
                                        </View>
                                        <View style={{paddingLeft:20}}>
                                            <Text style={{paddingBottom:20}}>{item.poster_name.split(' ')[0]}</Text>
                                            <Text style={{fontSize:12}}>{'Work type: '+item.skill_name}</Text>
                                            <Text style={{fontSize:12}}>{'Task title: '+item.task}</Text>
                                            <View style={{paddingVertical:10, flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12}}>{'Rating: '+item.rating+'/5  '}</Text>
                                                <Rating readonly={true} startingValue={item.rating} imageSize={20} />
                                            </View>
                                            <Text style={{fontSize:12}}>{'Comments: '+item.review}</Text>
                                        </View>
                                    </View>
                                    {
                                        item.start_pic!=='' || item.center_pic!=='' || item.end_pic!==''?
                                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20}}>
                                            {item.start_pic!==""?
                                            <View style={{width:'30%', alignItems:'center'}}>
                                                <Text>Start</Text>
                                                <TouchableOpacity 
                                                onPress={()=>{this.openImage(item.start_pic)}}
                                                >
                                                    <View style={{width:'100%'}}>
                                                        <Image 
                                                            style={{width:100, height:100, resizeMode:'contain', borderRadius:5}} 
                                                            source={{uri:item.start_pic}}/>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>:null}
                                            {item.center_pic!==""?
                                            <View style={{width:'30%', alignItems:'center'}}>
                                                <Text>Working</Text>
                                                <TouchableOpacity 
                                                onPress={()=>{this.openImage(item.center_pic)}}
                                                >
                                                    <View style={{width:'100%'}}>
                                                        <Image 
                                                            style={{width:100, height:100, resizeMode:'contain', borderRadius:5}} 
                                                            source={{uri:item.center_pic}}/>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>:null}
                                            {item.end_pic!==""?
                                            <View style={{width:'30%', alignItems:'center'}}>
                                                <Text>End</Text>
                                                <TouchableOpacity 
                                                onPress={()=>{this.openImage(item.end_pic)}}
                                                >
                                                    <View style={{width:'100%'}}>
                                                        <Image 
                                                            style={{width:100, height:100, resizeMode:'contain', borderRadius:5}} 
                                                            source={{uri:item.end_pic}}/>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>  :null}
                                        </View>:<Text style={{fontSize:10, paddingTop:20}}>No photos of work available</Text>
                                    }
                                   
                                </View>
                            )
                            }}
                        />
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
          else{
              return(
                  <View style={styles.container1}><Text>No Reviews Related to skill.</Text></View>
              );
          }
        
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container1: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center', 
    },
});

//make this component available to the app
export default PrevWork;
