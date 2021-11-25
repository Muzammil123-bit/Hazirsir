import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ToastAndroid, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';  
import { firebase } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { firebase as fcm } from '@react-native-firebase/messaging';


class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  state = {
    password: '',
    currentpassword: '',
    uid: '', 
  };

  async componentDidMount(){
    const value = await AsyncStorage.getItem('userID')
    await this.setState({uid:value})

}

reauthenticate = (currentPassword) =>{
  try{

    var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
 return user.reauthenticateWithCredential(cred);

  }
  catch(e){
    console.log(e.message);
  }
  
}

 async change_password(){

  const currentPassword = this.state.currentpassword;
  const newPassword = this.state.password;


  this.reauthenticate(currentPassword).then(() => {
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(() => {
      console.log("Password updated!");
    }).catch((error) => { console.log(error); });
  }).catch((error) => { console.log(error); });

  
  

    var data=[];
    data=
            [
                this.state.uid,
                currentPassword,
                newPassword
            ];

            const url='https://www.hazirsir.com/web_service/update_password.php';

            await fetch(url, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  z: data,
                  
              })
          })

          .then((response) => response.json())
          .then((responseJson) => {
              // Showing response message coming from server after inserting records.
              // resolve(responseJson);
             // console.log(responseJson);
              if(responseJson==='Wrong credentials!'){
                  ToastAndroid.show(responseJson, ToastAndroid.SHORT);
              }else{
                Alert.alert(responseJson);
                this.props.navigation.navigate('More')
                

              
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
      <View style={styles.container}>


<View style={styles.header}>
              <Text style={styles.headerTitle}>
              Change Password
              </Text>
          </View>


          <View  style={styles.postContent}>
        <View style={styles.inputContainer}>
            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

            <TextInput style={styles.inputContainer}
                value={this.state.currentpassword}
                onChangeText={(currentpassword) => this.setState({currentpassword})}
                placeholder="Current Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'/>

        </View>

          <View style={styles.inputContainer}>
            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

            <TextInput style={styles.inputContainer}
                value={this.state.password}
                onChangeText={(password) => this.setState({password})}
                placeholder="New Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'/>

        </View>
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
             onPress={()=>this.change_password()}>
            <Text style={styles.loginText}>Change Password</Text>
        </TouchableOpacity>

        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  
  header:{
    padding:30,
    alignItems: 'center',
    backgroundColor: "#32a84e",
  },
  headerTitle:{
    fontSize:30,
    color:"#FFFFFF",
    marginTop:10,
  },
  postContent: {
    flex: 1,
    padding:30,
  },
  inputContainer: {
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius:5,
    borderWidth: 1,
    width:'100%',
    height:45,
    marginBottom:15,
  },
  buttonContainer: {
    height:38, 
    justifyContent: 'center',
    alignItems: 'center',  
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: '#6cb505',
  }
});

export default ChangePassword;
