import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
              <Text style={styles.headerTitle}>
                About Us
              </Text>
          </View>

          <View style={styles.postContent}>
             

              <Text style={styles.postDescription}>
              Get any work done with Amazon Experts. {"\n"}{"\n"}

              Amazon Experts is a community of talent available to work for you remotely, online or in-person at the click of a button. {"\n"}{"\n"}
 
We are here to help people solve their pending work or when they find themselves in the middle of No where or when you are just Stuck, that's where we come and say Amazon Experts! {"\n"}{"\n"}
 
From simple to complicated tasks, Amazon Experts can help you complete your home cleaning, handyman jobs, gardening, photography, graphic design or even build a website. You simply post a task for FREE and then choose from rated and reviewed people ready to work straight away. {"\n"}{"\n"}
 
Connecting people ready to work, with people who need work done. Download Amazon Experts app and get your things done easily. We will say Amazon Experts and take you from 'things to do' to 'things done'. {"\n"}{"\n"}

Amazon Experts enables you to get everyday tasks done on-demand by connecting with reliable experts in real-time. Simply post a task and get quotes from Taskers. Choose a Tasker and get the work done in no time.{"\n"}{"\n"}
 
Amazon Experts. Make life simple.

              </Text>

          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
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
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  postContent: {
    flex: 1,
    padding:30,
  },
  postTitle:{
    fontSize:26,
    fontWeight:'600',
  },
  postDescription:{
    fontSize:16,
    marginTop:10,
  },
  tags:{
    color: '#00BFFF',
    marginTop:10,
  },
  date:{
    color: '#696969',
    marginTop:10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
  },
  profile:{
    flexDirection: 'row',
    marginTop:20
  },
  name:{
    fontSize:22,
    color:"#00BFFF",
    fontWeight:'600',
    alignSelf:'center',
    marginLeft:10
  }, 
  shareButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  }
});
export default AboutUs;