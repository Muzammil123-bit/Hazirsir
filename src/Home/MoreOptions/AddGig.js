import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ToastAndroid } from 'react-native';

import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { FlatGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'AddPackages' })],
});
// this.props.navigation.navigate('Cnic')
class AddGig extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    uid: '',
    skills: [],
    width3rd: '',
    selectedSkills: [],
    Selected_skill: ''
  };
  async componentDidMount() {
    const value = await AsyncStorage.getItem('userID')
    this.setState({ uid: value })
    const screenWidth = Math.round(Dimensions.get('window').width);
    await this.setState({ width3rd: Math.round(screenWidth / 3) })
    console.log(screenWidth + ' ' + this.state.width3rd)
    await this.sendToServer();


  }
  async sendToServer() {
    // console.log(uid)
    const url = 'https://www.hazirsir.com/web_service/read_skill.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
        console.log(responseJson);
        await this.setState({ skills: responseJson[2] })
        return responseJson;
      })
      .catch((error) => {
        // reject(error);
        console.log(error);

        return error;
      });
  }


  async sendSkills() {

    if (this.state.Selected_skill === '') {
      alert("Please Select Skill");

    } else {
      this.props.navigation.navigate("AddPackages"
        ,
        {
          Skill_Id: this.state.Selected_skill,

        })

    }



  }


  async selectSkill(id, a, data) {

    // alert(id)

    if (this.state.selectedSkills.length < 1 || this.state.selectedSkills.includes(id)) {
      // data.item.isSelect = !data.item.isSelect;
      // data.item.selectedClass = data.item.isSelect
      // ? styles.selected: styles.list;
      if (this.state.selectedSkills.includes(id)) {
        var array = this.state.selectedSkills;
        var index = array.indexOf(id);
        array.splice(index, 1);
        await this.setState({ selectedSkills: array })
        await this.setState({ Selected_skill: array })
      }
      else {
        await this.setState({ selectedSkills: this.state.selectedSkills.concat(id) })
      }
      await this.setState({ Selected_skill: id })

    } else {
      ToastAndroid.show('Selected skills cannot be more than 1', ToastAndroid.SHORT);
    }

    console.log(this.state.selectedSkills);
    // console.log(a)
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ flex: 1, padding: 10 }}>

            <View style={{ width: '100%', flexDirection: "row", height: 50 }}>

              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold', width: '50%', alignSelf: 'center' }}> Select Category </Text>

            </View>


            <View>
              <Text style={{ marginBottom: 5, }}> Please select Category </Text>
            </View>
            <View>
              {
                this.state.skills.length > 0 ?
                  <FlatGrid
                    itemDimension={Number(this.state.width3rd) - 10}
                    items={this.state.skills}
                    spacing={0}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => this.selectSkill(item.id, index, item)}>
                        <View style={{ padding: 10, alignSelf: 'center', alignItems: 'center' }}>
                          <Image
                            style={[
                              styles.icon, styles.inputIcon,
                              {
                                opacity: this.state.selectedSkills.includes(item.id)
                                  ? 0.3
                                  : 1
                              }
                            ]}
                            source={{ uri: item.image }} />
                          <Text style={{ fontSize: 12, alignSelf: 'center', textAlign: 'center' }}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  : <Text>Loading...</Text>
              }

            </View>
          </View>
        </ScrollView>
        <View style={{ width: '100%', flexDirection: "row", borderTopColor: 'gray', borderWidth: 1, height: 50 }}>
          {/* <Text style={{paddingLeft:15, width:'50%', alignSelf:'center'}}>{this.state.selectedSkills.length+' categories selected.'}</Text> */}
          <Text style={{ paddingLeft: 15, width: '50%', alignSelf: 'center' }}>{""}</Text>
          <View style={{ width: '50%' }}>
            <TouchableOpacity onPress={() => this.sendSkills()}>
              <View style={{ backgroundColor: '#32a84e', borderRadius: 5, height: 35, width: 150, alignSelf: 'center', marginTop: 7 }}>
                <Text style={{ alignSelf: 'center', marginTop: 5, fontSize: 18, color: 'white' }}>
                  Next
                                </Text>
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
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 5,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '85%',
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
export default AddGig;
