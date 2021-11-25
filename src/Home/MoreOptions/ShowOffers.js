import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, 
    StatusBar,Dimensions, Image
} from 'react-native';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Active from "./ActiveOffers";
import Received from "./ReceivedOffer";
import Completed from "./CompletedOffer";
var screen_size_height = Dimensions.get('window').height;
var screen_size_width = Dimensions.get('window').width;
class ShowOffers extends Component {
  constructor(props) {
    super(props);
    
  }

  state = {
    index: 0,
    routes: [
      { key: "first", title: "Received", indx: 0},
      { key: "second", title: "Active", indx: 1},
      { key: "third", title: "Completed", indx: 2}
    ],
    email: "",
    selectedItem: 0

  };


  componentDidMount = async () => {
    const active = new Active();
    active.navigate_data(this.props.navigation);
    const received = new Received();
    // received.navigate_data(this.props.navigation);
    const completed = new Completed();
    completed.navigate_data(this.props.navigation);
  };
  _handleIndexChange = index => {
    this.setState({ index });
    this.setState({selectedItem: index});
    //  alert(index);
  }

  render() {
    return (
      
      <ScrollView>
        <View style={styles.container}>
         
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
                // renderIcon={({ route, focused, color }) => (
                //   <Icon name={"images"} color="#fff" />
                // )}
                renderLabel={({ route, focused, color }) => (
            //   <View style={{marginHorizontal:5, width:'33%', borderWidth:1, borderRadius:5,backgroundColor:'#d3dfe8'}}>

                    <View style={{flexDirection:'row' ,width:'100%',justifyContent:'center', height:16, alignSelf:'center', marginTop:4,
                    borderWidth:1, borderRadius:5,backgroundColor: this.state.selectedItem === route.indx ? '#d3dfe8' : "white", width:screen_size_width* .3, height : 20}}>
                    <Text style={{ marginLeft:12, marginTop:12, marginBottom:12 ,alignSelf:'center', fontSize:11}}>
                        {route.title}
                    </Text>
                    <Image 
                        style={[
                          {width:12, height:12, marginLeft:3, alignSelf:'center',}
                        ]} 
                        source={require('../../Logos/both.png')}/>
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
      </ScrollView>
   
   );
  }
}
const s_he = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#f3f3f3"

  },
  header:{
    padding:30,
    alignItems: 'center',
    backgroundColor: "#32a84e",
  },
  tab_Style: {
    top: s_he,
    backgroundColor: "#E8E6EE"
  }
  
});
export default ShowOffers;