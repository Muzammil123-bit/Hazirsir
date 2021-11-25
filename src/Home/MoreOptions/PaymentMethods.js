import React, { Component } from 'react';
import { View, CheckBox,Text, StyleSheet } from 'react-native';

class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = { //checked:true
    };
  }


     
  render() {
    return (
      <View style={styles.container}>
         
      
      <View style={styles.header}>
              <Text style={styles.headerTitle}>
              Payment Methods
              </Text>
          </View>

          <View  style={styles.postContent}>
      <View style={{ flexDirection: 'column'}}>
      <View style={{ flexDirection: 'row' }}>
       <View >
    <Text>{'\n'}{'\n'}{'\n'}</Text>
    </View>
    
        <CheckBox
          value={true}
          
          
         // onValueChange={() => this.setState({ checked: !this.state.checked })}
        />
        <Text style={{marginTop: 5}}> Cash On Delivery</Text>
      </View>
    </View>
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

export default PaymentMethods;
