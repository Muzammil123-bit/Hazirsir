import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ToastAndroid, 
  StatusBar,Dimensions
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation, NavigationEvents } from 'react-navigation';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Active from "./MoreOptions/ActiveOffers";
import Received from "./MoreOptions/ReceivedOffer";
import Completed from "./MoreOptions/CompletedOffer";


import Active1 from "./MoreOptions/ActiveOffers1";
import Received1 from "./MoreOptions/ReceivedOffer1";
import Completed1 from "./MoreOptions/CompletedOffer1";

var screen_size_height = Dimensions.get('window').height;
var screen_size_width = Dimensions.get('window').width;
let routes1= [
  { key: "first", title: "Received", indx: 0},
  { key: "second", title: "Active", indx: 1},
  { key: "third", title: "Completed", indx: 2}
]
class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeP: [],
      assignedP: [],
      completedP: [],
      appliedT: [],
      assignedT: [],
      completedT: [],
      uid: '',
      nodata: false,
      refreshing: false,
      poster: true,
      tasker: false,
      offer_apply: false,
      offer_order: false,
      open: true,
      assigned: false,
      completed: false,

      applied: true,
      assignedTasker: false,
      completedTasker: false,

      index: 0,
      routes: [
        { key: "first", title: "Applied", indx: 0},
        { key: "second", title: "Active", indx: 1},
        { key: "third", title: "Completed", indx: 2}
      ],
      
      email: "",
      selectedItem: 0
    };
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem('userID')
    await this.setState({ uid: user })
    this.fetchmyposts();
    var rev = this.props.navigation.getParam('reviews', '1');
    if (rev === '1') {
      this.openSelected();
    }
    else if (rev === '2') {
      this.assignedSelected();
    }
    else if (rev === '3') {
      this.completedSelected();
    }
    else if (rev === '4') {
      this.setState({ poster: !this.state.poster })
      this.appliedSelected();
    }
    else if (rev === '5') {
      this.setState({ poster: !this.state.poster })
      this.assignedSelectedTasker();
    }
    else if (rev === '6') {
      this.setState({ poster: !this.state.poster })
      this.completedSelectedTasker();
    }

    const active = new Active();
    active.navigate_data(this.props.navigation);
    const received = new Received();
    // received.navigate_data(this.props.navigation);
    const completed = new Completed();
    completed.navigate_data("abc");
  }

  _handleIndexChange = index => {
    this.setState({ index });
    this.setState({selectedItem: index});
  }
  async fetchmyposts() {
    // console.log(uid)
    const user = this.state.uid
    const url = 'https://www.hazirsir.com/web_service/my_task.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [user],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        // console.warn("hhhhhhh "+JSON.stringify(responseJson[2]));
        // alert(JSON.stringify(responseJson[0]));
        if (responseJson !== 'Wrong Credentials!') {
          await this.setState({
            activeP: responseJson[0],
            assignedP: responseJson[1],
            completedP: responseJson[2],
            appliedT: responseJson[3],
            assignedT: responseJson[4],
            completedT: responseJson[5],
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
  async onRefreshtask() {
    this.setState({ refreshing: true })
    await this.fetchmyposts()
    this.setState({ refreshing: false })
  }
  openPost(id) {
    this.props.navigation.navigate('Task', { PostId: id })
  }

  openSelected() {
    this.setState({ open: true, assigned: false, completed: false })
  }
  assignedSelected() {
    this.setState({ assigned: true, open: false, completed: false })
  }
  completedSelected() {
    this.setState({ completed: true, open: false, assigned: false })
  }
  appliedSelected() {
    this.setState({ applied: true, assignedTasker: false, completedTasker: false })
  }
  assignedSelectedTasker() {
    this.setState({ assignedTasker: true, applied: false, completedTasker: false })
  }
  completedSelectedTasker() {
    this.setState({ completedTasker: true, applied: false, assignedTasker: false })
  }
  completeTask(oid, stat) {

    Alert.alert(
      'Finish',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.completeTaskService(oid, stat) },
      ],
      { cancelable: false }
    )
  }
  async completeTaskService(oid, stat) {
    var b = new Date().toISOString().substr(0, 10).split('-')
    var completeDate = b[2] + '-' + b[1] + '-' + b[0]
    console.log(completeDate)
    const url = 'https://www.hazirsir.com/web_service/complete_order.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [oid, this.state.uid, completeDate, stat],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        console.log(responseJson);
        this.fetchmyposts()
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }
  async approve(oid, stat, wId, work, date) {
    var b = new Date().toISOString().substr(0, 10).split('-')
    var completeDate = b[2] + '-' + b[1] + '-' + b[0]
    console.log(completeDate)
    const url = 'https://www.hazirsir.com/web_service/task_status.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [oid, this.state.uid, stat],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        // Showing response message coming from server after inserting records.
        // resolve(responseJson);
        this.fetchmyposts()
        // ToastAndroid.show(responseJson, ToastAndroid.SHORT)
        console.log(responseJson);
        Alert.alert(responseJson);
        if (responseJson === 'Record approved successfully') {
          this.props.navigation.navigate('Rate',
            {
              OID: oid,
              WID: wId,
              title: item.title,
              work: work,
              date: date
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
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', width: '100%', height: 55, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold' }}>My Task {'&'} Offers</Text>

            <View style={{ alignSelf: "center", flexDirection: "row" }}>


              <TouchableOpacity
                style={{ backgroundColor: "green", alignSelf: "center", borderRadius: 20 }}
                onPress={() => this.props.navigation.navigate('MyGigs')}
              >
                <Text style={{ color: "white", padding: 12, }}>My Offers</Text>

              </TouchableOpacity>
            </View>

          </View>
        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#f5f5f5', justifyContent: 'space-evenly', paddingBottom: 5, alignItems: 'center' }}>
        <View style={{backgroundColor: "green", alignSelf: "center", borderRadius: 20}}>
          <TouchableOpacity onPress={() => this.setState({ poster: true, tasker : false, offer_apply:false, offer_order:false })}>
            
            <Text style={{ padding: 12, color:'white', fontWeight: 'bold', opacity: this.state.poster ? 1 : 0.2 }}>Poster</Text>
          </TouchableOpacity>
          </View>
          <View style={{backgroundColor: "green", alignSelf: "center", borderRadius: 20}}>
          <TouchableOpacity onPress={() => this.setState({poster: false, tasker : true, offer_apply:false, offer_order:false  })}>
            <Text style={{padding: 12, color:'white', fontSize: 18, fontWeight: 'bold', opacity: this.state.tasker ? 1 : 0.2 }}>Tasker</Text>
          </TouchableOpacity>
          </View>
          <View style={{backgroundColor: "green", alignSelf: "center", borderRadius: 20}}>
          <TouchableOpacity onPress={()=>this.setState({poster: false, tasker : false, offer_apply:true, offer_order:false })}>
            <Text style={{padding: 12, color:'white', fontWeight:'bold', opacity:this.state.offer_apply?1:0.2}}>Offers Apply</Text>
          </TouchableOpacity>
          </View>
          <View style={{backgroundColor: "green", alignSelf: "center", borderRadius: 20}}>
          <TouchableOpacity onPress={()=>this.setState({poster: false, tasker : false, offer_apply:false, offer_order:true })}>
            <Text style={{padding: 12, color:'white', fontWeight:'bold', opacity:this.state.offer_order?1:0.2}}>Offers Order</Text>
          </TouchableOpacity>
          </View>
          
        </View>
        {
          this.state.poster &&
          <View style={{ width: '100%', backgroundColor: '#f5f5f5', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10 }}>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.open ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.openSelected()}>
                <View style={{ flexDirection: 'row', width: '100%', height: 16, alignSelf: 'center', justifyContent: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Active
                          </Text>
                  <Image
                    style={[
                      { width: 12, height: 12, marginLeft: 3 }
                    ]}
                    source={require('../Logos/openTask.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.assigned ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.assignedSelected()}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Assigned
                          </Text>
                  <Image
                    style={[
                      { width: 12, height: 12, marginLeft: 3 }
                    ]}
                    source={require('../Logos/assignedTask.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.completed ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.completedSelected()}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Completed
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
        }
        {
          this.state.tasker &&

          <View style={{ width: '100%', backgroundColor: '#f5f5f5', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 10 }}>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.applied ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.appliedSelected()}>
                <View style={{ flexDirection: 'row', width: '100%', height: 16, alignSelf: 'center', justifyContent: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Applied
                        </Text>
                  <Image
                    style={[
                      { width: 12, height: 12, marginLeft: 3 }
                    ]}
                    source={require('../Logos/openTask.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.assignedTasker ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.assignedSelectedTasker()}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Assigned
                        </Text>
                  <Image
                    style={[
                      { width: 12, height: 12, marginLeft: 3 }
                    ]}
                    source={require('../Logos/assignedTask.png')} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 5, width: '33%', borderWidth: 1, borderRadius: 5, backgroundColor: this.state.completedTasker ? '#d3dfe8' : 'white' }}>
              <TouchableOpacity onPress={() => this.completedSelectedTasker()}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 16, alignSelf: 'center', marginTop: 4 }}>
                  <Text style={{ marginBottom: 5, marginLeft: 5, alignSelf: 'center', fontSize: 11 }}>
                    Completed
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
      
      }

        {this.state.offer_apply &&

      <View style={styles.container1}>    
      <TabView
        navigationState={this.state}
        tabStyle={styles.tab_Style}
        lazy={true}
        renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: "transparent"
              }}
              style={{ backgroundColor: "transparent" }}
              renderLabel={({ route, focused, color }) => (
                  <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, marginTop:0,
                  borderWidth:1, borderRadius:5,backgroundColor: this.state.selectedItem === route.indx ? '#d3dfe8' : "white", width:screen_size_width* .3, height : 21.5}}>
                  <Text style={{ marginLeft:12, marginTop:12, marginBottom:12 ,alignSelf:'center', fontSize:11}}>
                      {route.title}
                  </Text>
                  <Image 
                      style={[
                        {width:12, height:12, marginLeft:3, alignSelf:'center',}
                      ]} 
                      source={require('../Logos/both.png')}/>
              </View>
              // </View>
              )}
            />
        )}
        style={{ marginTop: 0 }}
        renderScene={SceneMap({
          first: Received,
          second: Active,
          third: Completed
        })}
        onIndexChange={this._handleIndexChange}
        initialLayout={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
      />

      </View>
 
 

        }

        {this.state.offer_order &&

         
      <View style={styles.container1}>    
      <TabView
        // navigationState={this.state}
        navigationState={ this.state }
        tabStyle={styles.tab_Style}
        lazy={true}
        renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: "transparent"
              }}
              style={{ backgroundColor: "transparent" }}
              renderLabel={({ route, focused, color, }) => (
                  <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, marginTop:0,
                  borderWidth:1, borderRadius:5,backgroundColor: this.state.selectedItem === route.indx ? '#d3dfe8' : "white", width:screen_size_width* .3, height : 22}}>
                  <Text style={{ marginLeft:12, marginTop:12, marginBottom:12 ,alignSelf:'center', fontSize:11}}>
                      {routes1[route.indx].title}
                  </Text>
                  <Image 
                      style={[
                        {width:12, height:12, marginLeft:3, alignSelf:'center',}
                      ]} 
                      source={require('../Logos/both.png')}/>
              </View>
              // </View>
              )}
            />
        )}
        style={{ marginTop: 0 }}
        renderScene={SceneMap({
          first: Received1,
          second: Active1,
          third: Completed1
        })}
        onIndexChange={this._handleIndexChange}
        initialLayout={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
      />

      </View>
 
 


        }

{this.state.poster  &&



        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefreshtask()} />
          }
        >
          

          <View style={{ flex: 1, padding: 10, backgroundColor: '#f5f5f5' }}>
          
          

            <View>
            {
              this.state.nodata ? <Text style={{ color: 'gray' }}>No records found</Text> : <Text style={{ color: 'gray' }}>Drag down to refresh</Text>
            }
              {
                
                this.state.activeP.length > 0 && this.state.poster && this.state.open ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.activeP}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity onPress={() => this.openPost(item.id)}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                              </View>
                              <View style={{ width: '20%' }}>
                                <View>
                                  <Text>Open</Text>
                                </View>
                                <Text>{'Rs ' + item.budget}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>

                      )
                    }
                    } />
                  : null
              }




              {
                this.state.assignedP.length > 0 && this.state.poster && this.state.assigned ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.assignedP}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                'AChat',
                                {
                                  Type: 'poster',
                                  Desc: item.description,
                                  Skill: item.skill_name,
                                  Title: item.title,
                                  Date: item.work_date,
                                  Prof: item.worker_id,
                                  Order: item.id,
                                  ChatName: item.worker_name
                                }
                              )
                            }>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%', justifyContent: 'space-between' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                                {
                                  item.status === 'completed' ?
                                    <View style={{ width: '90%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>

                                      <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                          Alert.alert(
                                            'Approve',
                                            'Are you sure?',
                                            [
                                              { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                              { text: 'Yes', onPress: () => this.approve(item.id, 'approved', item.worker_id, item.skill_name, item.work_date) },
                                            ],
                                            { cancelable: false }
                                          )
                                        }}>
                                          <Text style={{ color: 'white', fontSize: 10 }}>Approve</Text>
                                        </TouchableOpacity>
                                      </View>
                                      <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                          Alert.alert(
                                            'Disapprove',
                                            'Are you sure?',
                                            [
                                              { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                              { text: 'Yes', onPress: () => this.approve(item.id, 'disapproved', item.worker_id, item.skill_name, item.work_date) },
                                            ],
                                            { cancelable: false }
                                          )
                                        }}>
                                          <Text style={{ color: 'white', fontSize: 10 }}>Disapprove</Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View> :
                                    null
                                }

                              </View>
                              <View style={{ width: '20%', alignItems: 'center' }}>
                                <Text>{'Rs ' + item.budget}</Text>
                              </View>


                            </View>
                          </TouchableOpacity>
                        </View>

                      )
                    }
                    } />
                  : null
              }


              {
                this.state.completedP.length > 0 && this.state.poster && this.state.completed ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.completedP}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate(
                              'AChat',
                              {
                                Type: 'poster',
                                Desc: item.description,
                                Skill: item.skill_name,
                                Title: item.title,
                                Date: item.work_date,
                                Prof: item.worker_id,
                                Order: item.id,
                                ChatName: item.worker_name,
                                From: 'completed',
                                status: "completed"
                              }
                            )
                          }>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                                {
                                  item.order_status === 'completed' ?
                                    <View style={{ width: '90%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>

                                      <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                          this.props.navigation.navigate('Rate',
                                            {
                                              OID: item.id,
                                              WID: item.worker_id,
                                              title: item.title,
                                              work: item.skill_name,
                                              date: item.work_date
                                            })
                                        }}>
                                          <Text style={{ color: 'white', fontSize: 10 }}>Add Review</Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View> :
                                    null
                                }
                              </View>
                              <View style={{ width: '20%' }}>
                                <Text>{'Rs ' + item.budget}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>

                      )
                    }
                    } />
                  : null
              }



              {
                this.state.appliedT.length > 0 && this.state.tasker && this.state.applied ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.appliedT}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity onPress={() => this.openPost(item.id)}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                              </View>
                              <View style={{ width: '20%' }}>
                                <View>
                                  <Text>Open</Text>
                                </View>
                                <Text>{'Rs ' + item.budget}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>

                      )
                    }
                    } />
                  : null
              }


              {
                this.state.assignedT.length > 0 && this.state.tasker && this.state.assignedTasker ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.assignedT}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('AChat',
                            {
                              Type: 'tasker',
                              Desc: item.description,
                              Skill: item.skill_name,
                              Title: item.title, Date: item.work_date,
                              Prof: item.client_id, Order: item.id,
                              ChatName: item.client_name
                            })}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                              </View>
                              <View style={{ width: '20%', justifyContent: 'space-around' }}>
                                <Text>{'Rs ' + item.budget}</Text>
                                {
                                  item.status === 'working' ?
                                    <View style={{ paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                      <TouchableOpacity onPress={() => this.completeTask(item.id, 'completed')}>
                                        <Text style={{ color: 'white' }}>Finish</Text>
                                      </TouchableOpacity>
                                    </View> :
                                    <View>
                                      {
                                        item.status === 'completed' ?
                                          <Text style={{ opacity: 0.5, fontSize: 13 }}>Completed</Text>
                                          :
                                          <View>
                                            {
                                              item.status === 'disapproved' ?
                                                <View>
                                                  <View style={{ paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => this.completeTask(item.id, 'completed')}>
                                                      <Text style={{ color: 'white' }}>Finish</Text>
                                                    </TouchableOpacity>
                                                  </View>

                                                  <Text style={{ opacity: 0.5, fontSize: 10 }}>Disapproved</Text>
                                                </View> : null
                                            }
                                          </View>
                                      }
                                    </View>
                                }
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>

                      )
                    }
                    } />
                  : null
              }


              {
                this.state.completedT.length > 0 && this.state.tasker && this.state.completedTasker ?
                  <FlatList
                    enableEmptySections={true}
                    data={this.state.completedT}
                    renderItem={({ item }) => {
                      // const rowData=service.image;
                      return (

                        <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                          <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate(
                              'AChat',
                              {
                                Type: 'tasker',
                                Desc: item.description,
                                Skill: item.skill_name,
                                Title: item.title,
                                Date: item.work_date,
                                Prof: item.worker_id,
                                Order: item.id,
                                ChatName: item.worker_name,
                                From: 'Completed',
                                status: "completed"

                              }
                            )
                          }>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                              <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Image
                                  style={[
                                    { width: 65, height: 65, borderRadius: 32 }
                                  ]}
                                  source={{ uri: item.client_image }} />
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text>
                                  {item.title}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                  <Image
                                    style={[
                                      { width: 18, height: 18 }
                                    ]}
                                    source={require('../Logos/physical.png')} />
                                  <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                                </View>
                              </View>
                              <View style={{ width: '20%' }}>
                                <View>
                                  {/* <Text>Open</Text> */}
                                </View>
                                <Text>{'Rs ' + item.budget}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                    } />
                  : null
              }
            </View>
          </View>
        </ScrollView>

     
}
{this.state.tasker  &&



      <ScrollView
  refreshControl={
    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefreshtask()} />
  }
>
  

  <View style={{ flex: 1, padding: 10, backgroundColor: '#f5f5f5' }}>
  
  

    <View>
    {
      this.state.nodata ? <Text style={{ color: 'gray' }}>No records found</Text> : <Text style={{ color: 'gray' }}>Drag down to refresh</Text>
    }
      {
        
        this.state.activeP.length > 0 && this.state.poster && this.state.open ?
          <FlatList
            enableEmptySections={true}
            data={this.state.activeP}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => this.openPost(item.id)}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                      </View>
                      <View style={{ width: '20%' }}>
                        <View>
                          <Text>Open</Text>
                        </View>
                        <Text>{'Rs ' + item.budget}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

              )
            }
            } />
          : null
      }




      {
        this.state.assignedP.length > 0 && this.state.poster && this.state.assigned ?
          <FlatList
            enableEmptySections={true}
            data={this.state.assignedP}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate(
                        'AChat',
                        {
                          Type: 'poster',
                          Desc: item.description,
                          Skill: item.skill_name,
                          Title: item.title,
                          Date: item.work_date,
                          Prof: item.worker_id,
                          Order: item.id,
                          ChatName: item.worker_name
                        }
                      )
                    }>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%', justifyContent: 'space-between' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                        {
                          item.status === 'completed' ?
                            <View style={{ width: '90%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>

                              <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                  Alert.alert(
                                    'Approve',
                                    'Are you sure?',
                                    [
                                      { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                      { text: 'Yes', onPress: () => this.approve(item.id, 'approved', item.worker_id, item.skill_name, item.work_date) },
                                    ],
                                    { cancelable: false }
                                  )
                                }}>
                                  <Text style={{ color: 'white', fontSize: 10 }}>Approve</Text>
                                </TouchableOpacity>
                              </View>
                              <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                  Alert.alert(
                                    'Disapprove',
                                    'Are you sure?',
                                    [
                                      { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                      { text: 'Yes', onPress: () => this.approve(item.id, 'disapproved', item.worker_id, item.skill_name, item.work_date) },
                                    ],
                                    { cancelable: false }
                                  )
                                }}>
                                  <Text style={{ color: 'white', fontSize: 10 }}>Disapprove</Text>
                                </TouchableOpacity>
                              </View>
                            </View> :
                            null
                        }

                      </View>
                      <View style={{ width: '20%', alignItems: 'center' }}>
                        <Text>{'Rs ' + item.budget}</Text>
                      </View>


                    </View>
                  </TouchableOpacity>
                </View>

              )
            }
            } />
          : null
      }


      {
        this.state.completedP.length > 0 && this.state.poster && this.state.completed ?
          <FlatList
            enableEmptySections={true}
            data={this.state.completedP}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate(
                      'AChat',
                      {
                        Type: 'poster',
                        Desc: item.description,
                        Skill: item.skill_name,
                        Title: item.title,
                        Date: item.work_date,
                        Prof: item.worker_id,
                        Order: item.id,
                        ChatName: item.worker_name,
                        From: 'completed',
                        status: "completed"
                      }
                    )
                  }>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                        {
                          item.order_status === 'completed' ?
                            <View style={{ width: '90%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>

                              <View style={{ paddingVertical: 7, width: '45%', paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                  this.props.navigation.navigate('Rate',
                                    {
                                      OID: item.id,
                                      WID: item.worker_id,
                                      title: item.title,
                                      work: item.skill_name,
                                      date: item.work_date
                                    })
                                }}>
                                  <Text style={{ color: 'white', fontSize: 10 }}>Add Review</Text>
                                </TouchableOpacity>
                              </View>
                            </View> :
                            null
                        }
                      </View>
                      <View style={{ width: '20%' }}>
                        <Text>{'Rs ' + item.budget}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

              )
            }
            } />
          : null
      }



      {
        this.state.appliedT.length > 0 && this.state.tasker && this.state.applied ?
          <FlatList
            enableEmptySections={true}
            data={this.state.appliedT}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => this.openPost(item.id)}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                      </View>
                      <View style={{ width: '20%' }}>
                        <View>
                          <Text>Open</Text>
                        </View>
                        <Text>{'Rs ' + item.budget}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

              )
            }
            } />
          : null
      }


      {
        this.state.assignedT.length > 0 && this.state.tasker && this.state.assignedTasker ?
          <FlatList
            enableEmptySections={true}
            data={this.state.assignedT}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AChat',
                    {
                      Type: 'tasker',
                      Desc: item.description,
                      Skill: item.skill_name,
                      Title: item.title, Date: item.work_date,
                      Prof: item.client_id, Order: item.id,
                      ChatName: item.client_name
                    })}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                      </View>
                      <View style={{ width: '20%', justifyContent: 'space-around' }}>
                        <Text>{'Rs ' + item.budget}</Text>
                        {
                          item.status === 'working' ?
                            <View style={{ paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                              <TouchableOpacity onPress={() => this.completeTask(item.id, 'completed')}>
                                <Text style={{ color: 'white' }}>Finish</Text>
                              </TouchableOpacity>
                            </View> :
                            <View>
                              {
                                item.status === 'completed' ?
                                  <Text style={{ opacity: 0.5, fontSize: 13 }}>Completed</Text>
                                  :
                                  <View>
                                    {
                                      item.status === 'disapproved' ?
                                        <View>
                                          <View style={{ paddingVertical: 3, borderRadius: 5, backgroundColor: '#32a84e', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.completeTask(item.id, 'completed')}>
                                              <Text style={{ color: 'white' }}>Finish</Text>
                                            </TouchableOpacity>
                                          </View>

                                          <Text style={{ opacity: 0.5, fontSize: 10 }}>Disapproved</Text>
                                        </View> : null
                                    }
                                  </View>
                              }
                            </View>
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

              )
            }
            } />
          : null
      }


      {
        this.state.completedT.length > 0 && this.state.tasker && this.state.completedTasker ?
          <FlatList
            enableEmptySections={true}
            data={this.state.completedT}
            renderItem={({ item }) => {
              // const rowData=service.image;
              return (

                <View style={{ backgroundColor: 'white', marginTop: 5 }}>
                  <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate(
                      'AChat',
                      {
                        Type: 'tasker',
                        Desc: item.description,
                        Skill: item.skill_name,
                        Title: item.title,
                        Date: item.work_date,
                        Prof: item.worker_id,
                        Order: item.id,
                        ChatName: item.worker_name,
                        From: 'Completed',
                        status: "completed"

                      }
                    )
                  }>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', padding: 10 }}>
                      <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Image
                          style={[
                            { width: 65, height: 65, borderRadius: 32 }
                          ]}
                          source={{ uri: item.client_image }} />
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text>
                          {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                          <Image
                            style={[
                              { width: 18, height: 18 }
                            ]}
                            source={require('../Logos/physical.png')} />
                          <Text style={{ width: '85%', fontSize: 10 }}>{item.place}</Text>
                        </View>
                      </View>
                      <View style={{ width: '20%' }}>
                        <View>
                          {/* <Text>Open</Text> */}
                        </View>
                        <Text>{'Rs ' + item.budget}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }
            } />
          : null
      }
    </View>
  </View>
</ScrollView>


     }

        <NavigationEvents
          onWillFocus={() => this.fetchmyposts()}
        />
      </View>
    );
  }
}

const s_he = StatusBar.currentHeight;
const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container1:{
    flex:1,
    backgroundColor: "#f3f3f3",
    marginTop:-12

  },
  header:{
    padding:30,
    alignItems: 'center',
    backgroundColor: "#32a84e",
  },
  tab_Style: {
    // top: s_he,
    backgroundColor: "#E8E6EE",
  },

  inputContainer: {
    padding: 5,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: 45,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  icon: {
    width: 60,
    height: 60,
  },
  inputIcon: {
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '85%',
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#6cb505',
  },
  fabookButton: {
    backgroundColor: "#0883ff",
  },
  googleButton: {
    borderColor: 'grey',
    borderWidth: 1,
    // backgroundColor: "#ff0000",
  },
  loginText: {
    color: 'white',
  },
  restoreButtonContainer: {
    width: 250,
    marginBottom: 15,
    alignItems: 'flex-end'
  },
  socialButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    color: "#FFFFFF",
    marginRight: 5
  }
});
export default withNavigation(MyTasks);
