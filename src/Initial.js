import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
const resetActionOk = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});
class Initial extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    } 
  
    async componentDidMount(){
        console.log('init mounted');
        await this.getData();        
    } 
    async getData(){

        await AsyncStorage.setItem('phone_auth', '22')

        const value = await AsyncStorage.getItem('Signed')
        const value_tasker = await AsyncStorage.getItem('tasker_signed')
        // const user = await AsyncStorage.getItem('userID')
       
        if(value==='1') {
            console.log('val 1')
            // alert(value);
            
            this.props.navigation.dispatch(resetActionOk);
        }
        else if(value==='2') {

            if (value_tasker === null || value_tasker === "") {
                this.props.navigation.navigate('signupreg');
                
            } else {
                

            if (value_tasker === "skill") {
                
            this.props.navigation.navigate('Skills');

            } else if (value_tasker === "cnic") {
            this.props.navigation.navigate('Cnic');
                
            }
            else
            {
                this.props.navigation.navigate('signupreg');
            }

        }
        }

        else{
            console.log('async strg val is null<---'+value)
          //   this.componentWillUnmount();
          //   this.props.navigation.navigate('Login');
        //   this.props.navigation.navigate('signupreg');
            this.props.navigation.dispatch(resetAction);
        }
    }
    render() {
        return (
            <View style={{marginLeft:15, marginRight:15, marginTop:10}}> 
                <ActivityIndicator size='large' />
            </View>
        );
  }
}

export default Initial;
