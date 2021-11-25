import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import 'react-native-gesture-handler'
//import PushNotification from 'react-native-push-notification'
import { firebase } from '@react-native-firebase/messaging';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SignupScr from './src/Signup';
import signupreg from './src/signupreg';
import Login from './src/Login';
import SelectSkills from './src/SelectSkills';
import Initial from './src/Initial';
import HomeContainer from './src/Home/HomeContainer'
import PostTask from './src/Home/PostTask'
import TaskDetails from './src/Home/TaskDetails'
import ProfileEdit from './src/Home/MoreOptions/ProfileEdit'
import CNIC from './src/Home/MoreOptions/CNIC'
import Profile from './src/Home/Profile'
import PaymentHistory from './src/Home/MoreOptions/PaymentHistory'
import PaymentMethods from './src/Home/MoreOptions/PaymentMethods'
import ChangePassword from './src/Home/MoreOptions/ChangePassword'
import AboutUs from './src/Home/MoreOptions/AboutUs'
import AddGig from './src/Home/MoreOptions/AddGig'
import AddPackages from './src/Home/MoreOptions/AddPackages'
import AddRequirement from './src/Home/MoreOptions/AddRequirement'
import ShowOffers from './src/Home/MoreOptions/ShowOffers'
import TnC from './src/Home/MoreOptions/TnC'
import PrivacyPolicy from './src/Home/MoreOptions/PrivacyPolicy'
import ContactUs from './src/Home/MoreOptions/ContactUs'
import EarnMoney from './src/Home/EarnMoney';
import GigChat from './src/Home/GigChat'
import ChatScreen from './src/Home/ChatScreen';
import AssignedChat from './src/Home/AssignedChat';
import Rating from './src/Home/Rating';
import Rating_gig from './src/Home/Rating_gig';
import ViewRatings from './src/Home/ViewRatings';
import PrevWork from './src/Home/PrevWork';
import More from './src/Home/More';
import MyTasks from './src/Home/MyTasks';
import SubmitGigg from './src/Home/SubmitGigg';
import GigsDetails from './src/Home/GigsDetails';
import MyGigsDetails from './src/Home/MyGigsDetails';
import MyGigs from './src/Home/MyGigs';
import Cart from './src/Home/Cart';
import ToolDetails from './src/Home/ToolDetails';
import Tools from './src/Home/Tools';
import Tools1 from './src/Home/Tools1';
import { 
  setCustomText,
  setCustomTextInput, 
} from 'react-native-global-props';
import AsyncStorage from '@react-native-community/async-storage';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
    // this.messageListener = firebase.messaging().onMessage((message) => {
    //     // Process your message as required
    // });
    console.log('app.js')
    //this.checkPermission();
    //this.createNotificationListeners(); 
    setCustomText(customTextProps);
    setCustomTextInput(customTextProps);

    
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  async getToken() {
    console.log('getToken')
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('okay: '+fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log('okay: '+fcmToken)
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  // componentWillUnmount() {
  //   this.notificationListener();
  //   this.notificationOpenedListener();
  // }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  // showAlert(title, body) {
  //   Alert.alert(
  //     title, body,
  //     [
  //         { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     ],
  //     { cancelable: false },
  //   );
  // }
  

  render(){
    return <AppContainer/>;
  }
}
const RootStack= createStackNavigator({





  Signup: {
    screen: SignupScr,
    navigationOptions: {
      title: 'Sign up',
      headerStyle: {
        backgroundColor: '#00b5ec',
      },
      headerTintColor: '#fff',
    }
  },

  signupreg: {
    screen: signupreg,
    navigationOptions: {
      header:null
    }
  },
 

  Skills: {
    screen: SelectSkills,
    navigationOptions: {
      title: 'Select skills',
      headerStyle: {
      },
    }
  },
  Home:{
    screen: HomeContainer,
    navigationOptions:{
      header:null
    }
  },
  PostTask:{
    screen: PostTask,
    navigationOptions:{
      header:null
    }
  },
  Task:{
    screen: TaskDetails,
    navigationOptions:{
      header:null
    }
  },
  Earn:{
    screen: EarnMoney,
    navigationOptions:{
      header:null
    }
  },
  AChat:{
    screen: AssignedChat,
    navigationOptions:{
      header:null
    }
  },
  Rate:{
    screen: Rating,
    navigationOptions:{
      header:null
    }
  },
  Rating_gig:{
    screen: Rating_gig,
    navigationOptions:{
      header:null
    }
  },
  ViewRating:{
    screen: ViewRatings,
    navigationOptions:{
      header:null
    }
  },
  PrevWork:{
    screen: PrevWork,
    navigationOptions:{
      header:null
    }
  },
  More:{
    screen: More,
    navigationOptions:{
      header:null
    }
  },
  MyTasks:{
    screen: MyTasks,
    navigationOptions:{
      header:null
    }
  },

  
  

  Cart:{
    screen: Cart,
    navigationOptions:{
      header:null
    }
  },
  ToolDetails:{
    screen: ToolDetails,
    navigationOptions:{
      header:null
    }
  },
  Tools: {
    screen: Tools,
    navigationOptions:{
      title: 'Tools',
      headerStyle: {
      },
    }
  },
  Tools1: {
    screen: Tools1,
    navigationOptions:{
      title: 'Tools',
      headerStyle: {
      },
    }
  },
  Chat:{
    screen: ChatScreen,
    navigationOptions:{
      header:null
    }
  },
  Init:{
    screen: Initial,
    navigationOptions:{
      header:null
    }
  },
  EditProf:{
    screen: ProfileEdit,
    navigationOptions:{
      header:null
    }
  },
  Cnic:{
    screen: CNIC,
    navigationOptions:{
      header:null
    }
  },
  ViewProf:{
    screen: Profile,
    navigationOptions:{
      header:null
    }
  },
  PayH:{
    screen: PaymentHistory,
    navigationOptions:{
      header:null
    }
  },
  GigChat:{
    screen: GigChat,
    navigationOptions:{
      header:null
    }
  },
  PayM:{
    screen: PaymentMethods,
    navigationOptions:{
      header:null
    }
  },
  Pass:{
    screen: ChangePassword,
    navigationOptions:{
      header:null
    }
  },
  About:{
    screen: AboutUs,
    navigationOptions:{
      header:null
    }
  },
  AddGig:{
    screen: AddGig,
    navigationOptions:{
      header:null
    }
  },
  AddPackages:{
    screen: AddPackages,
    navigationOptions:{
      header:null
    }
  },
  AddRequirement:{
    screen: AddRequirement,
    navigationOptions:{
      header:null
    }
  },
  ShowOffers:{
    screen: ShowOffers,
    navigationOptions:{
      header:null
    }
  },
  SubmitGigg:{
    screen: SubmitGigg,
    navigationOptions:{
      header:null
    }
  },
  GigsDetails:{
    screen: GigsDetails,
    navigationOptions:{
      header:null
    }
  },
  MyGigsDetails:{
    screen: MyGigsDetails,
    navigationOptions:{
      header:null
    }
  },
  MyGigs:{
    screen: MyGigs,
    navigationOptions:{
      header:null
    }
  },
  Tnc:{
    screen: TnC,
    navigationOptions:{
      header:null
    }
  },
  PrivPol:{
    screen: PrivacyPolicy,
    navigationOptions:{
      header:null
    }
  },
  Contact:{
    screen: ContactUs,
    navigationOptions:{
      header:null
    }
  },
  Login:{
    screen: Login,
    navigationOptions:{
      title:'Login',
      headerStyle: {
        backgroundColor: '#00b5ec',
      },
      headerTintColor: '#fff',
    }
  },



},
{
  initialRouteName:'Init',
  defaultNavigationOptions:{
    // header:null
    // title: 'HazirSir',
    // headerStyle: {
    //   backgroundColor: '#00b5ec',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
  }
});
const customTextProps = { 
  style: { 
    fontFamily: 'Montserrat-Medium'
  }
}
const RootSwitch = createSwitchNavigator(
  { 
    RootStack,
   },
  { initialRouteName: "RootStack" }
);
const AppContainer = createAppContainer(RootSwitch);
export default App;