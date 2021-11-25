import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';

import { StackActions, NavigationActions } from 'react-navigation';
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu:[
        {name:'Profile', func:'1'},
        {name:'My Skills', func:'2'},

        // {name:'Add Gig', func:'3'},
        // {name:'Gig Offers', func:'4'},
        // {name:'My Gigs', func:'5'},

        // {name:'Payment history', func:'6'},
        {name:'Payment methods', func:'7'},
        {name:'Change Password', func:'8'},
        {name:'About Us', func:'9'},
        {name:'Terms & Conditions', func:'10'},
        {name:'Privacy Policy', func:'11'},
        {name:'Contact Us', func:'12'},
        {name:'Logout', func:'13'},
      ]
    };
  }
  async componentDidMount(){
    const value = await AsyncStorage.getItem('userID')
    await this.setState({uid:value})
  }
  async prof(){
    console.log('editProf')
    this.props.navigation.navigate('ViewProf', {ProfileId:this.state.uid, Type:'1'})
  }
  async mySkills(){
    console.log('mySkills')
    this.props.navigation.navigate('Skills');
  }
  async paymentHistory(){
    console.log('paymentHistory')
    this.props.navigation.navigate('PayH')
  }
  async paymentMethods(){
    console.log('paymentMethods')
    this.props.navigation.navigate('PayM')
  }
  async changePass(){
    console.log('changePass')
    this.props.navigation.navigate('Pass')
  }
  async aboutUs(){
    console.log('aboutUs')
    this.props.navigation.navigate('About')
  }
  async AddGig(){
    // console.warn('aboutUs')
    this.props.navigation.navigate('AddGig')
  }
  async MyGigs(){
    this.props.navigation.navigate('MyGigs')
  }
  async termsCon(){
    console.log('termsCon')
    this.props.navigation.navigate('Tnc')
  }
  async privPol(){
    console.log('privPol')
    this.props.navigation.navigate('PrivPol')
  }
  async contUs(){
    console.log('contUs')
    this.props.navigation.navigate('Contact')
  }
  async showOffer(){
    // console.log('contUs')
    this.props.navigation.navigate('ShowOffers')
  }
  async logout(){
    console.log('logout')
    await AsyncStorage.setItem('Signed', '0')
    this.props.navigation.dispatch(resetAction);
  }
  menu(a){
    if(a==='1'){
      this.prof()
    }else if(a==='2'){
      this.mySkills()
    }else if(a==='3'){
      this.AddGig()


    }else if(a==='4'){
      this.showOffer()


    }else if(a==='5'){

      this.MyGigs()

    }else if(a==='6'){

      this.paymentHistory()

    }else if(a==='7'){

      this.paymentMethods()

    }else if(a==='8'){

      this.changePass()

    }else if(a==='9'){

      this.aboutUs()

    }else if(a==='10'){
      this.termsCon()

    }else if(a==='11'){

      this.privPol()

     
    }
    else if(a==='12'){
      this.contUs()

    }
    else if(a==='13'){
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Yes', onPress: ()=> this.logout()},
        ],
        { cancelable: false }
      )
    }
    else if(a==='14'){
      this.MyGigs()
    }
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{width:'100%', height:55,backgroundColor:'#f5f5f5' ,justifyContent:'center', paddingLeft:12}}>
          <Text style={{fontSize:17, fontWeight:'bold'}}>More</Text>
        </View>
        <ScrollView>
          <View style={{width:'100%'}}>
              <FlatList 
                enableEmptySections={true}
                data={this.state.menu}
                renderItem={({item}) => {
                    // const rowData=service.image;
                    return (
                        <View style={{marginTop:5}}>
                          <TouchableOpacity onPress={()=>this.menu(item.func)}>
                            <View style={{width:'100%',flexDirection:'row', padding:15, paddingBottom:20, borderBottomColor:'#cfcfcf', borderBottomWidth:0.7}}>
                              
                                <Text>
                                  {item.name}
                                </Text>
                            </View>
                          </TouchableOpacity>   
                        </View>
                    )
                }
              }/>
            </View>
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(More);
