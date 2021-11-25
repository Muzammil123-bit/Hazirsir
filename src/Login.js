import React, { Component } from 'react';
import { 
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Image,
    Modal,
    TouchableOpacity,
  ToastAndroid, ActivityIndicator } from 'react-native';


// import firebase from 'react-native-firebase';
// import PushNotification from 'react-native-push-notification'
import { firebase } from '@react-native-firebase/auth';
import { firebase as fcm } from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import { LoginManager, LoginButton, AccessToken } from "react-native-fbsdk";
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Signup' })],
});
const resetAction1 = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Home' })],
  // actions: [NavigationActions.navigate({ routeName: 'Skills' })],
});

const resetAction2 = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'signupreg' })],
});


class Login extends Component {
  
    constructor(props) {
        super(props);
    }
    
    state = {
        pass: '', email: '', loggedIn: null, 
        phone:'', code:'', 
        ID:'',dName:'',photo:'',fcm:'',
        modal1Visible:false,
        modal2Visible:false,
        loadingModal:false,
        confirm:'', 
        country: '', 
        region: '' ,

    };
  
    async componentDidMount(){
        console.log('loginpage');
        GoogleSignin.configure({
        webClientId: '914422540898-l2dh89tm8j89e9olgmu5a8dq08fga8br.apps.googleusercontent.com',
        
        });

    //     PushNotification.configure({
    //       // (optional) Called when Token is generated (iOS and Android)
    //       onRegister: function(token) {
    //         console.log('TOKEN:', token)
    //       },
    // // (required) Called when a remote or local notification is opened or received
    //       onNotification: function(notification) {
    //         console.log('REMOTE NOTIFICATION ==>', notification)
    // // process the notification here
    //       },
    //       // Android only: GCM or FCM Sender ID
    //       senderID: "914422540898",
    
    //       popInitialNotification: true,
    //       requestPermissions: true
    //     })
    
    }



    selectCountry (val) {

      this.setState({ country: val });
    }
   
    selectRegion (val) {
      this.setState({ region: val });
    }



    async phoneAuth(){
        const { confirm } = await auth().signInWithPhoneNumber(this.state.phone);
        try {
            await confirm(this.state.code); // User entered code
            // Successful login - onAuthStateChanged is triggered
          } catch (e) {
            console.error(e); // Invalid code
          }
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              // Stop the login flow / Navigate to next page
            }
          });
    }
    
    async register(){
        console.log(this.state.fcm)
        var data=[];
        if(this.state.method==='google'){
          data=
            [
                'google',
                this.state.ID,
                this.state.email,
                this.state.fcm
            ];
            console.warn(this.state.ID)
        }else if(this.state.method==='fb'){
          data=
            [
                'facebook',
                this.state.ID,  //fbid
                this.state.email,
                this.state.fcm
            ];
        }else if(this.state.method==='phone'){
          data=
            [
                'phone',  //type
                '+92'+this.state.phone,  //phonenumber
                this.state.fcm
            ];
        }else if(this.state.method==='email'){
          console.log(this.state.email)
          console.log(this.state.pass)
          data=
            [
                'email',
                this.state.email,
                this.state.pass,
                this.state.fcm
            ];
        }
        const url='https://www.hazirsir.com/web_service/login.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        // if(uname==='' || pass===''){
        // ToastAndroid.show('Username or Password cannot be empty!', ToastAndroid.SHORT);
        // }
        // else{
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
              this.setState({loadingModal:false})
                // Showing response message coming from server after inserting records.
                // resolve(responseJson);
                console.log("server response");
                // alert(JSON.stringify(responseJson));
                if(responseJson==='Wrong credentials!'){
                    ToastAndroid.show(responseJson, ToastAndroid.SHORT);
                }else{
                  this.saveServerResp(responseJson);
                
                }
                
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                // alert(error);

                return error;
        });
        // }
        
    }
    async saveServerResp(responseJson){
        await this.setState({SignInResp:responseJson, loadingModal:false});
        console.log(this.state.SignInResp+'<---SignInResp');
        if(responseJson==='Wrong credentials!'){
            ToastAndroid.show(responseJson, ToastAndroid.SHORT);
        }else{
            await this.storeData();
            // this.props.navigation.navigate('Home');
            this.props.navigation.dispatch(resetAction1)
        }
        // this.props.navigation.navigate('Details',{categories:this.state.SignInResp});
    }
    storeData = async () => {
      try {
        await AsyncStorage.setItem('Signed', '1')
        await AsyncStorage.setItem('NewOld', 'Old')
        console.log(this.state.SignInResp)
        await AsyncStorage.setItem('userID', this.state.SignInResp)
      } catch (e) {
        // saving error
      }
    }
    async withEmail() {

      const text = this.state.pass;

      if(text.length < 6) {
        
       Alert.alert('Password length is short.');
         console.log('Password length is short.');
      }
      else{
      
      try {
        await auth().signInWithEmailAndPassword(this.state.email, this.state.pass);
        // user has a device token
        var a=firebase.auth().currentUser.uid;

        
        
        
        const fcmToken = await fcm.messaging().getToken();
        if (fcmToken) {
          console.log(JSON.stringify(firebase.auth().currentUser));
          console.log(a+'<---uid exists');
          await this.setState({ID:a, fcm:fcmToken, method:'email'});
          console.log(this.state.ID)
          console.log(fcmToken);
          console.log("login to be called");
          this.register();
        } else {
            // user doesn't have a device token yet
            console.log('token doesnt exist');
        }


        
      } catch (e) {
        console.log(e.message);
        if(e.message==='[auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.'){
          ToastAndroid.show('User does not exist.', ToastAndroid.SHORT)
        }else{
          ToastAndroid.show('Invalid input!', ToastAndroid.SHORT)
        }
      }
    }
    }
    async onFBButtonPress(){
        this.setState({loadingModal:true})
        console.log('loginfb');
        // console.log(firebase.auth().currentUser.uid);
        // 
        try {
        LoginManager.setLoginBehavior('NATIVE_ONLY');
        result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    } catch (error) {
        LoginManager.setLoginBehavior('WEB_ONLY');
        result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    }
  
        if (result.isCancelled) {
          Alert.alert('Signin cancelled.');
        } else {
          const data = await AccessToken.getCurrentAccessToken();
          if (!data) {
            throw new Error('Something went wrong obtaining the users access token');
          }
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          await firebase.auth().signInWithCredential(credential);
          console.log('logged in');
          console.log(data.accessToken);
          const response = await fetch(`https://graph.facebook.com/v4.0/me?access_token=${data.accessToken}&fields=name,email,id,picture.type(large)`);
          var userInfo = await response.json();
          console.log(userInfo)
          await this.setState({
            dName:userInfo.name,
            ID:userInfo.id,
            photo:userInfo.picture.data.url,
            email:userInfo.email,
            method:'fb'
          });
          const fcmToken = await fcm.messaging().getToken();
          if (fcmToken) {
              // user has a device token
              console.log(fcmToken);
              await this.setState({fcm:fcmToken})
          } else {
              // user doesn't have a device token yet
              console.log('token doesnt exist');
          }
          console.log(this.state.dName)
          console.log(this.state.ID)
          console.log(this.state.email)
          console.log(this.state.photo)
          this.register();
        }
        (error) => {
          Alert.alert('Sign in error', error);
        }
      }
    async googleLogin(){
        try {
            this.setState({loadingModal:true})
        
            const data = await GoogleSignin.signIn();
        
            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
            // login with credential
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        
            console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
            console.log(JSON.stringify(firebase.auth().currentUser.providerData));
            var a=firebase.auth().currentUser.providerData[0];
            console.log(a.uid+'<---uid exists');
            
            await this.setState({dName:a.displayName,photo:a.photoURL,ID:a.uid,method:'google', email:a.email});
            console.log(this.state.dName)
            console.log(this.state.photo)
            console.log(this.state.ID)
            
            const fcmToken = await fcm.messaging().getToken();
            if (fcmToken) {
                console.log(fcmToken);
                await this.setState({fcm:fcmToken})
            } else {
                console.log('token doesnt exist');
            }
            this.register();
        } catch (e) {
            console.error(e);
        }
    }
    async onLoginOrRegister(){
      this.setState({method:'phone'})
      console.log('a')
      const phoneNumber = this.state.phone;
      await firebase.auth().signInWithPhoneNumber('+92'+phoneNumber)
        .then(async (confirmResult) => {
          // This means that the SMS has been sent to the user
          // You need to:
          //   1) Save the `confirmResult` object to use later
          if(confirmResult._verificationId===null){
            console.log('verCode is null')
            console.log(confirmResult)
            const fcmToken = await fcm.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                console.log(fcmToken);
                await this.setState({fcm:fcmToken})
            } else {
                // user doesn't have a device token yet
                console.log('token doesnt exist');
            }
            
            this.register();
          }else{
            this.setState({ confirm: confirmResult,modal1Visible:false,modal2Visible:true });
            console.log(confirmResult)
          }
          
          //   3) Show the verification code form
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
    }
    async onVerificationCode(){
      const confirmResult=this.state.confirm;
      const verificationCode= this.state.code;
      if(this.state.confirm){
        await confirmResult.confirm(verificationCode)
        .then( async (user) => {
          console.log('code correct')
          const fcmToken = await fcm.messaging().getToken();
          if (fcmToken) {
              // user has a device token
              console.log(fcmToken);
              await this.setState({fcm:fcmToken})
          } else {
              // user doesn't have a device token yet
              console.log('token doesnt exist');
          }
          this.register();
          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
      }
    }
  render() {
 
    return (
    //   <View>
    //     <Text> Login </Text>
    //     <GoogleSigninButton
    //         style={{ width: 192, height: 48 }}
    //         size={GoogleSigninButton.Size.Wide}
    //         color={GoogleSigninButton.Color.Dark}
    //         onPress={this._signIn}
    //         disabled={this.state.isSigninInProgress} />
    //   </View>
    <ScrollView 
      // style={{backgroundColor: '#B0E0E6',}}
    >   


      <Modal
        style={{flex:1}}
        animationType="slide"
        transparent={false}
        visible={this.state.modal1Visible}
        onRequestClose={() => {
            this.setState({modal1Visible:false});
        }}>
          <View style={[styles.container, {marginTop:20}]}>

          <Text style={{marginVertical:10}}>
                Enter your mobile number
                </Text> 

            <View style={styles.inputContainer}>
              <View  style={[styles.inputs, {flexDirection:'row'}]}>

                <TextInput
                      style={styles.inputs}
                      value={this.state.phone}
                      onChangeText={(phone) => this.setState({phone})}
                      keyboardType={'numeric'}
                      placeholder="3XX-XXXXXXX"
                      underlineColorAndroid='transparent'/>
                
              </View>
            </View>

           {/*    <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
                  onPress={()=>this.onLoginOrRegister()}
                  >
                  <View style={styles.socialButtonContent}>
                   <Image style={styles.icon} source={{uri: 'https://png.icons8.com/facebook/androidL/40/FFFFFF'}}/> 
                  <Text style={styles.loginText}>Phone Number Verification</Text>
                  </View>
              </TouchableOpacity>*/}
          </View>
      </Modal>



      <Modal
        style={{flex:1}}
        animationType="slide"
        transparent={false}
        visible={this.state.modal2Visible}
        onRequestClose={() => {
            this.setState({modal2Visible:false});
        }}>
          <View style={[styles.container, {marginTop:20}]}>

<Text style={{marginVertical:10}}>
      Enter authentication code received on mobile number
      </Text> 

            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                    value={this.state.code}
                    onChangeText={(code) => this.setState({code})}
                    keyboardType={'numeric'}
                    placeholder="Code"
                    // keyboardType="email-address"
                    underlineColorAndroid='transparent'/>
            </View>
              <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
                  onPress={()=>this.onVerificationCode()}>
                  <View style={styles.socialButtonContent}>
                  {/* <Image style={styles.icon} source={{uri: 'https://png.icons8.com/facebook/androidL/40/FFFFFF'}}/> */}
                  <Text style={styles.loginText}>Phone Number Verification</Text>
                  </View>
              </TouchableOpacity>
          </View>
      </Modal>


      <Modal
        style={{flex:1}}
        animationType="slide"
        transparent={true}
        visible={this.state.loadingModal}
        >
          <View style={{flex:1, justifyContent:'center'}}>
            <View style={{padding:20, backgroundColor:'white', borderWidth:5, borderColor:'gray', alignSelf:'center', borderRadius:30}}>
              <ActivityIndicator size='large' color='gray' />
            </View>
            
          </View>
      </Modal>


      <Image source={require('./Logos/logo__.png')}
       style={{width: 350, height: 150, alignSelf:"center", resizeMode:"contain"}} />

      <View style={[styles.container, {marginTop:35}]}>

      
            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
           
        

        <View style={styles.inputContainer}>
            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}
            <TextInput style={styles.inputs}
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'/>
        </View>
        
        <View style={styles.inputContainer}>
            {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/envelope/androidL/40/3498db'}}/> */}
            <TextInput style={styles.inputs}
                value={this.state.pass}
                onChangeText={(pass) => this.setState({pass})}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'/>
        </View>
    
        {/* <TouchableOpacity style={styles.restoreButtonContainer}>
            <Text>Forgot?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
            onPress={this.withEmail.bind(this)}>
            <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>


        <Text 
              style={{color:'gray', marginVertical:20, fontStyle:'italic'}}
              >-------------------------  or sign in with  -------------------------</Text>







            
        <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
            onPress={this.onFBButtonPress.bind(this)}>
            <View style={styles.socialButtonContent}>
              
            <Image style={styles.icon} 
             source={require('./Logos/fb_logo.png')}/>
            <Text style={{color: 'white', marginLeft: 10}}>Facebook</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.buttonContainer, styles.googleButton]}
            onPress={this.googleLogin.bind(this)}>
            <View style={styles.socialButtonContent}>
            <Image style={styles.icon}
             source={require('./Logos/google-logo.png')}/>
            <Text 
              style={{ marginLeft: 10}}
              >Gmail</Text>
            </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
            onPress={()=>this.setState({modal1Visible:true})}>
            <View style={styles.socialButtonContent}>
            {/* <Image style={styles.icon} source={{uri: 'https://png.icons8.com/facebook/androidL/40/FFFFFF'}}/> 
            <Text style={styles.loginText}>Phone Number</Text>
            </View>
        </TouchableOpacity> */}
        
        <TouchableOpacity style={[styles.buttonContainer]}
            onPress={()=>this.props.navigation.dispatch(resetAction)}>
            <View style={styles.socialButtonContent}>
            {/* <Image style={styles.icon} source={{uri: 'https://png.icons8.com/facebook/androidL/40/FFFFFF'}}/> */}
            <Text style={{color:"black"}}>Not a member?</Text><Text style={{color:"#0883ff"}}>Register here.</Text>
            </View>
        </TouchableOpacity>
        </View>
        </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      padding:5,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      padding:5,
      borderColor: 'gray',
      backgroundColor: '#FFFFFF',
      borderRadius:5,
      borderWidth: 1,
      width:'85%',
      height:45,
      marginBottom:15,
      flexDirection: 'row',
      alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        alignSelf: 'stretch',
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    icon:{
      width:30,
      height:30,
      alignItems: 'flex-start',
      alignSelf: 'flex-start'
    },
    inputIcon:{
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
      height:38,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:'85%',
      borderRadius:30,
    },
    loginButton: {
      backgroundColor: '#6cb505',
    },
    fabookButton: {
      backgroundColor: "#0883ff",
    },
    googleButton: {
      borderColor:'grey',
      borderWidth:1,
      // backgroundColor: "#ff0000",
    },
    loginText: {
      color: 'white',
    },
    restoreButtonContainer:{
      width:250,
      marginBottom:15,
      alignItems: 'flex-end'
    },
    socialButtonContent:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', 
    },

    socialButtonContent_1:{
     
      justifyContent: 'flex-start',
      alignItems: 'flex-start', 
    },
    socialIcon:{
      color: "#FFFFFF",
      marginRight:5
    }
  });
export default Login;
