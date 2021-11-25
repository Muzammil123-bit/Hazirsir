import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { 
  // Rating,
  AirbnbRating 
} from 'react-native-ratings';
import AsyncStorage from '@react-native-community/async-storage';  

class Rating_gig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:'',
     
      taskTitle: '',
      skillName: '',
      user_tasker_id: '',
      gig_id: '',
      review: '',
      rating: ''


    };
  }
  async componentDidMount(){
    const user = await AsyncStorage.getItem('userID')
    var order = this.props.navigation.getParam('OID', '0');
    var user_tasker_id = this.props.navigation.getParam('user_tasker_id', '0');
    var gig_title = this.props.navigation.getParam('gig_title', '0');
    var work = this.props.navigation.getParam('package_detail', '0');
    var gig_id = this.props.navigation.getParam('gig_id', '0');

    // alert(user_tasker_id);
    await this.setState({uid:user, taskTitle:gig_title, skillName:work, user_tasker_id, gig_id  })
  }
  async addReview(){
    const url='https://www.hazirsir.com/web_service/add_review_gig.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            z: [this.state.gig_id, this.state.user_tasker_id, this.state.uid, this.state.review, this.state.rating],
        })
    })
        .then((response) => response.json())
        .then(async (responseJson) => {
            // Showing response message coming from server after inserting records.
            // resolve(responseJson);
            if(responseJson==='Record created successfully'){
              this.props.navigation.goBack()
            }
            // alert(responseJson);
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
            <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
              <Text style={{fontSize:17, fontFamily:'Montserrat-Bold'}}>Review</Text>
            </View>
            <View style={{padding:10}}>
              <View style={{width:'100%', flexDirection:'row', alignItems:'center', paddingLeft:12}}>
                  <Text style={{fontSize:13, fontFamily:'Montserrat-Bold'}}>Gig Title: </Text>
                  <Text style={{fontSize:12}}>{this.state.taskTitle}</Text>
              </View>
              <View style={{width:'100%', flexDirection:'row', alignItems:'center', paddingLeft:12}}>
                  <Text style={{fontSize:13, fontFamily:'Montserrat-Bold'}}>Package: </Text>
                  <Text style={{fontSize:12}}>{this.state.skillName}</Text>
              </View>
             
              <View style={{height:40, justifyContent:'center', marginTop:15}}>
                <AirbnbRating 
                  isDisabled={false}
                  showRating={false}
                  defaultRating={0}
                  size={30}
                  onFinishRating={(rating) => {
                    this.setState({rating})
                  }} 
                />
              </View>
              <View style={styles.inputContainer}>
                  <TextInput style={styles.inputs}
                      value={this.state.review}
                      onChangeText={(review) => {
                        this.setState({review})
                      }}
                      placeholder="Add Review"
                      underlineColorAndroid='transparent'/>
              </View>
              <View style={{backgroundColor:'#32a84e', padding:15, borderRadius:5, alignSelf:'center'}}>
                <TouchableOpacity onPress={()=>this.addReview()}>
                    <Text style={{fontFamily:'Montserrat-Bold', color:'white'}}>
                      Add review
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
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
})
export default Rating_gig;
