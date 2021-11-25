import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
         
      
      <View style={styles.header}>
              <Text style={styles.headerTitle}>
              Payment History
              </Text>
          </View>

          <View  style={styles.postContent}>

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
  }
});

export default PaymentHistory;
