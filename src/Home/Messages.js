import React, { Component } from 'react';
import { 
  View, Text, TouchableOpacity, Image,
  RefreshControl , StyleSheet
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:'',
      chatsPoster:[],
      chatsTasker:[],
      refreshing:false,
    };
  }
  async componentWillMount() {
    const value = await AsyncStorage.getItem('userID')
    await this.setState({uid:value})
    await this.sendToServer()
  }
  async onRefreshtask(){
    this.setState({refreshing:true})
    await this.sendToServer()
    this.setState({refreshing:false})
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
    async sendToServer(){
      // console.log(uid)
      const url='https://www.hazirsir.com/web_service/read_chat_head.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
              // Showing response message coming from server after inserting records.
              // resolve(responseJson);
              console.warn(JSON.stringify(responseJson[0]));
              if(responseJson!=='Record doesnot exist' && responseJson!=='Wrong Credentials!'){
                await this.setState({chatsTasker:responseJson[1], chatsPoster:responseJson[0]})
              }
              if(responseJson==='Record doesnot exist'){
                await this.setState({chatsTasker:[], chatsPoster:[]})
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
    return (
      <View style={{flex:1}}>
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefreshtask()} />
        }>
          <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
            <Text style={{fontSize:17, fontWeight:'bold'}}>Inbox</Text>
          </View>
          { 
            this.state.chatsPoster.length>0 || this.state.chatsTasker.length>0?
            <View>
              {
                this.state.chatsTasker.length>0?
                <Text style={styles.typeHeading}>AS TASKER</Text>:null
              }
              <FlatList
                data={this.state.chatsTasker}
                renderItem={({item, index})=>{return(
                  <View>
                    {
                      this.state.chatsTasker.length>0?
                      <View style={{backgroundColor:'#f5f5f5', marginTop:5}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('AChat', 
                            {
                              Type:'tasker',
                              Desc:item.description,
                              Skill:item.skill_name,
                              Title:item.title, Date:item.work_date,
                              Prof:item.client_id, Order:item.id,
                              ChatName:item.client_name,
                              status:item.status
                              })}>
                          <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around', paddingVertical:10}}>
                            <View style={{width:'20%', justifyContent:'center'}}>
                            <Image 
                              style={[
                                {width:65, height:65, borderRadius:32}
                              ]}    
                              source={{uri:item.client_image}}/>
                            </View>
                            <View style={{width:'70%', justifyContent:'space-between'}}>
                              <Text>
                                {item.client_name}
                              </Text>
                              <Text style={{fontSize:12}}>{item.title}</Text>
                              <View style={{flexDirection:'row'}}>
                                <Image 
                                  style={[
                                    {width:15, height:15}
                                  ]}    
                                  source={require('../Logos/calendar.png')}/>
                                  <Text style={{width:'85%', fontSize:10}}>{' '+item.work_date}</Text>
                              </View>
                              {/* <View style={{flexDirection:'row', marginTop:15}}>
                                <Image 
                                  style={[
                                    {width:15, height:15}
                                  ]}    
                                  source={require('../Logos/physical.png')}/>
                                  <Text style={{width:'85%', fontSize:10}}>{' '+item.place}</Text>
                              </View> */}
                            </View>
                          </View>
                        </TouchableOpacity>  
                      </View>:null
                    }
                  </View>
                )
                }}
              />
              {
                this.state.chatsPoster.length>0?
                <Text style={styles.typeHeading}>AS POSTER</Text>:null
              }
              <FlatList
                data={this.state.chatsPoster}
                renderItem={({item, index})=>{return(
                  <View>
                    {
                      this.state.chatsPoster.length>0?
                      <View style={{backgroundColor:'#f5f5f5', marginTop:5}}>
                        <TouchableOpacity 
                            onPress={()=>
                              this.props.navigation.navigate(
                                'AChat', 
                                {
                                  Type:'poster', 
                                  Desc:item.description, 
                                  Skill:item.skill_name, 
                                  Title:item.title, 
                                  Date:item.work_date, 
                                  Prof:item.worker_id, 
                                  Order:item.id, 
                                  ChatName:item.worker_name,
                              status:item.status

                                }
                              )
                            }>
                          <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around', paddingVertical:10}}>
                            <View style={{width:'20%', justifyContent:'center'}}>
                            <Image 
                              style={[
                                {width:65, height:65, borderRadius:32}
                              ]}    
                              source={{uri:item.client_image}}/>
                            </View>
                            <View style={{width:'70%', justifyContent:'space-between'}}>
                              <Text>
                                {item.worker_name}
                              </Text>
                              <Text style={{fontSize:12}}>{item.title}</Text>
                              <View style={{flexDirection:'row'}}>
                                <Image 
                                  style={[
                                    {width:15, height:15}
                                  ]}    
                                  source={require('../Logos/calendar.png')}/>
                                  <Text style={{width:'85%', fontSize:10}}>{' '+item.work_date}</Text>
                              </View>
                              {/* <View style={{flexDirection:'row', marginTop:15}}>
                                <Image 
                                  style={[
                                    {width:15, height:15}
                                  ]}    
                                  source={require('../Logos/physical.png')}/>
                                  <Text style={{width:'85%', fontSize:10}}>{' '+item.place}</Text>
                              </View> */}
                            </View>
                          </View>
                        </TouchableOpacity>  
                      </View>:null
                    }
                  </View>
                )
                }}
              />
            </View>:<Text style={styles.typeHeading}>You don't have any chats.</Text> 
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  typeHeading:{
    alignSelf:'center',
    fontSize:10,
    paddingVertical:5
  }
})
export default withNavigation(Messages);
