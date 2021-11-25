import React, { Component } from 'react';
import { 
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Image,
    Modal,
    TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';

    import DB from './DB';
    import Country from './Country_t';
    import State from './state_t';
    import City from './City_t';
    
    
    
    const db = new DB();
    const CountryDB = new Country();
    const StateDB = new State();
    const CityDB = new City();

// import firebase from 'react-native-firebase';
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
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
const resetAction1 = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Skills' })],
});

const resetAction2 = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'signupreg' })],
});


class Signup extends Component {
  
    constructor(props) {
        super(props);
    }
    
    state = {
      password: '',
        pass: '', email: '', loggedIn: null, 
        phone:'', code:'', 
        ID:'',dName:'',photo:'',fcm:'',
        modal1Visible:false,
        modal2Visible:false,
        confirm:'', 
        loadingModal:false,

    };
  
    async componentDidMount(){
        console.log('loginpage');
        GoogleSignin.configure({
        // iosClientId: Constants.GOOGLE_LOGIN_CLIENT_ID_IOS,
        webClientId: '914422540898-l2dh89tm8j89e9olgmu5a8dq08fga8br.apps.googleusercontent.com',
        
        //   offlineAccess: false
        });
        // firebase.auth().onAuthStateChanged((user) => {
        // if(user){
        //     this.setState({loggedIn:true, 
        //         ID:firebase.auth().currentUser.uid.toString(), 
        //         Email:firebase.auth().currentUser.email.toString()});

        // } else {
        //     this.setState({loggedIn:false});
        // }
        // });
    
    }
    // async phoneAuth(){
    //     const { confirm } = await auth().signInWithPhoneNumber(this.state.phone);
    //     try {
    //         await confirm(this.state.code); // User entered code
    //         // Successful login - onAuthStateChanged is triggered
    //       } catch (e) {
    //         console.error(e); // Invalid code
    //       }
    //       firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //           // Stop the login flow / Navigate to next page
    //         }
    //       });

    // }

    store_data_sqlite = async(res) =>
    {


      // alert(JSON.stringify(res));

      let s_data = [];
      let ss_data = [];
      let sss_data = [];

      await db.clearDB();

        for (let index = 0; index < res[1].length; index++) {
      const elementt = res[1][index];
  
     s_data.push({
       c_id: elementt.id,
       value: elementt.name,
     });
  }

    for (let index = 0; index < s_data.length; index++) {
      const elementt = s_data[index];
  
      await CountryDB.addCategory(elementt);
    }

    var ff = await CountryDB.listCategory();

    // alert("country  "+JSON.stringify(ff));


      for (let index = 0; index < res[2].length; index++) {
    const elementt = res[2][index];

  ss_data.push({
    c_id: elementt.id,
    value: elementt.name,
    country_id: elementt.country_id,
  });
}


  for (let index = 0; index < ss_data.length; index++) {
    const elementt = ss_data[index];

    await StateDB.addCategory(elementt);
  }


 var ss = await StateDB.listCategory_all();

    // alert("state  "+JSON.stringify(ss));


    for (let index = 0; index < res[3].length; index++) {
      const elementt = res[3][index];
  
    sss_data.push({
      c_id: elementt.id,
      value: elementt.name,
      state_id: elementt.state_id,
    });
  }
  
  
    // alert(JSON.stringify(s_data));
  
  
    for (let index = 0; index < sss_data.length; index++) {
      const elementt = sss_data[index];
  
      await CityDB.addCategory(elementt);
    }
  
  
     var cc = await CityDB.listCategory_all();

//  alert("city  "+JSON.stringify(cc));
//  alert("city  "+JSON.stringify(res[0]));


      this.saveServerResp(res[0]);
     

    }




    
    async register(){
        console.log(this.state.fcm);
        
        // alert("fgf");
        const uname=this.state.username;
        const pass=this.state.password;
        var data=[];
        if(this.state.method==='google'){
          data=
            [
                
                'google',
                this.state.fcm,
                'other',
                this.state.email,
                this.state.ID,
                this.state.dName,
                this.state.photo
            ];
        }else if(this.state.method==='fb'){
          data=
            [
                'facebook',
                this.state.fcm,
                'other',//usertype
                this.state.email,
                this.state.ID,//fbid
                this.state.dName,
                this.state.photo
            ];
        }else if(this.state.method==='phone'){
          data=
            [
                'phone',//type
                this.state.fcm,
                'other',//usertype
                '+92'+this.state.phone,//phonenumber
            ];
        }else if(this.state.method==='email'){
          data=
            [
                'email',
                this.state.fcm,
                'other',//usertype
                this.state.email,
                this.state.password,
                this.state.ID,//fbid
            ];
        }
        const url='https://www.hazirsir.com/web_service/register.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
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
                console.warn(responseJson);
                this.store_data_sqlite(responseJson);
                console.log("qqqqqqqqqqqqqqqqqqqqqq "+ JSON.stringify(responseJson));
                
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);

                return error;
        });
        // }
        
    }




    
    async saveServerResp(responseJson){
        await this.setState({SignInResp:responseJson, loadingModal:false});
        // console.log(this.state.SignInResp+'<---SignInResp');
        // console.log(this.state.SignInResp.split("~")[0])
        if(this.state.SignInResp.split("~")[0].toString().includes('created successfully')){
            await this.storeData();
            this.props.navigation.dispatch(resetAction2)
        }else if(responseJson==='Already exists'){
            ToastAndroid.show('This user already registered please try signing in', ToastAndroid.SHORT);
        }
        else if(responseJson==='A')
        {
          ToastAndroid.show('This user already registered please try signing in', ToastAndroid.SHORT);
        }
        else
        {
          ToastAndroid.show(''+responseJson, ToastAndroid.SHORT);
        }
        // this.props.navigation.navigate('Details',{categories:this.state.SignInResp});
    }
    storeData = async () => {
      try {

        if(this.state.method==='phone')
        {
          await AsyncStorage.setItem('phone_auth', '1')
          await AsyncStorage.setItem('phone_num', '+92'+this.state.phone)
        }

        await AsyncStorage.setItem('Signed', '2')


        // await AsyncStorage.setItem('NewOld', 'New')
        // console.log(this.state.SignInResp.split("~")[1])
        await AsyncStorage.setItem('userID', this.state.SignInResp.split("~")[1])
     //   alert(this.state.SignInResp.split("~")[1]);
      } catch (e) {
        // saving error
      }
    }


    async withEmail() {
  
      const text = this.state.password;

   if(text.length < 6) {
     
    Alert.alert('Password length is short.');
      console.log('Password length is short.');
   }
   else{
  
      try {
        await auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
        const fcmToken = await fcm.messaging().getToken();
          if (fcmToken) {
              // user has a device token
              var a=firebase.auth().currentUser.uid;
              
              console.log(JSON.stringify(firebase.auth().currentUser));
              console.log(a+'<---uid exists');
              await this.setState({ID:a, fcm:fcmToken, method:'email'});
              console.log(this.state.ID)
              console.log(fcmToken);
              this.register();
          } else {
              // user doesn't have a device token yet
              console.log('token doesnt exist');
          }
      } catch (e) {
        console.log(e.message);
        
        ToastAndroid.show('Invalid or already in use.', ToastAndroid.SHORT);

      }
    }
    }


    async onFBButtonPress(){
      this.setState({loadingModal:true})
        console.log('loginfb');
        // console.log(firebase.auth().currentUser.uid);
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
        if (result.isCancelled) {
          Alert.alert('Signin cancelled.');
        } else {
          const data = await AccessToken.getCurrentAccessToken();
          if (!data) {
            ToastAndroid.show('Something went wrong obtaining the users access token', ToastAndroid.SHORT);
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
            
            await this.setState({email:a.email, dName:a.displayName,photo:a.photoURL,ID:a.uid,method:'google'});
            console.log(this.state.email)
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
            console.log(e);
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
          
          
          //   2) Hide the phone number form
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
      console.log('inside phone verification');

      const confirmResult=this.state.confirm;
      const verificationCode= this.state.code;

      if(this.state.confirm){
        await confirmResult.confirm(verificationCode).then( async (user) => {
          console.log('code correct')
          const fcmToken = await fcm.messaging().getToken();
          if (fcmToken) {
              // user has a device token
              console.log(fcmToken);
              
          // Alert.alert('Suucessfully login');
              await this.setState({fcm:fcmToken})
          } else {
              // user doesn't have a device token yet
              console.log('token doesnt exist');
          }
            this.register();
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
        });
      }


    }


  render() {
    return (
    
    <ScrollView 
    >   


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
                      // keyboardType="email-address"
                      underlineColorAndroid='transparent'/>
                
              </View>
            </View>


              <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
                  onPress={()=>this.onLoginOrRegister()}
                  >
                  <View style={styles.socialButtonContent}>
                  <Text style={styles.loginText}>Phone Number Verification</Text>
                  </View>
              </TouchableOpacity>
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



      <Image source={require('./Logos/logo__.png')}
       style={{width: 350, height: 150, alignSelf:"center", resizeMode:"contain"}} />


      <View style={[styles.container, {marginTop:35}]}>
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
                value={this.state.password}
                onChangeText={(password) => this.setState({password})}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'/>
        </View>
    
        {/* <TouchableOpacity style={styles.restoreButtonContainer}>
            <Text>Forgot?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
            onPress={this.withEmail.bind(this)}>
            <Text style={styles.loginText}>Sign up</Text>
        </TouchableOpacity>

        

        <Text 
              style={{color:'gray', marginVertical:20, fontStyle:'italic'}}
              >-------------------------  or sign up with  -------------------------</Text>

            
        <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}
            onPress={this.onFBButtonPress.bind(this)}>
            <View style={styles.socialButtonContent}>
            <Image style={styles.icon} source={require('./Logos/fb_logo.png')}/>
            <Text style={styles.loginText}>Facebook</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.buttonContainer, styles.googleButton]}
            onPress={this.googleLogin.bind(this)}>
            <View style={styles.socialButtonContent}>
            <Image style={styles.icon} source={require('./Logos/google-logo.png')}/>
            <Text 
              // style={styles.loginText}
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
            <Text style={{color:"black"}}>Already a member? </Text><Text style={{color:"#0883ff"}}>Signin here.</Text>
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
        alignSelf: 'stretch',
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    icon:{
      width:30,
      height:30,
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
    socialIcon:{
      color: "#FFFFFF",
      marginRight:5
    }
  });
export default Signup;
