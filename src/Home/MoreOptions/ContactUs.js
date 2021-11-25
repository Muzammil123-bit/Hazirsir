import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Linking } from 'react-native';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      ph: '',
      email: '',
      subject: '',
      Message: '',



    };
  }
  async send() {
    console.log(this.state.Name);
    console.log(this.state.ph);
    console.log(this.state.email);
    console.log(this.state.subject);
    console.log(this.state.Message);



    const url = 'https://www.hazirsir.com/web_service/contact_us.php';
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        z: [this.state.Name, this.state.ph, this.state.email, this.state.subject, this.state.Message],
      })
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log('response');
        console.log(responseJson);
        if (responseJson.toString().includes("Sent Successfully!")) {
          alert(responseJson);
          this.setState({
            Name: '',
            ph: '',
            email: '',
            subject: '',
            Message: ''
          })


        }
        else {
          alert("hhhh");

        }
      })
  }


  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Contact Us {"\n"}{"\n"}
            </Text>
          </View>


          <View style={styles.postContent}>
            <View>

              <Text>{"\n"}</Text>


              <Text>Please Email us using the contact form or call us.</Text>
            </View>

            <Text>{"\n"}</Text>


            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput style={styles.inputContainer}
                value={this.state.Name}
                onChangeText={(Name) => this.setState({ Name })}
                placeholder="Full Name"
                secureTextEntry={false}
                underlineColorAndroid='transparent' />

            </View>
            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput style={styles.inputContainer}
                value={this.state.ph}
                onChangeText={(ph) => this.setState({ ph })}
                placeholder="Phone no"
                secureTextEntry={false}
                keyboardType='phone-pad'
                underlineColorAndroid='transparent' />

            </View>






            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput style={styles.inputContainer}
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
                placeholder="Email"
                secureTextEntry={false}
                underlineColorAndroid='transparent' />

            </View>
            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput style={styles.inputContainer}
                value={this.state.subject}
                onChangeText={(subject) => this.setState({ subject })}
                placeholder="subject"
                secureTextEntry={false}
                underlineColorAndroid='transparent' />

            </View>
            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput style={styles.inputContainer1}
                value={this.state.Message}
                onChangeText={(Message) => this.setState({ Message })}
                placeholder="Your Message"
                secureTextEntry={false}
                underlineColorAndroid='transparent' />



            </View>

            <Text>{"\n"}{"\n"}{"\n"}</Text>

            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.send()}>
              <Text style={styles.loginText}>SEND</Text>
            </TouchableOpacity>


          </View>





          <View style={styles.postContent}>


            <Text style={styles.postDescription}>

              Contact no: +9232-00045364 {"\n"}{"\n"}
              Email: support@afp.org.pk  {"\n"}{"\n"}

              Address: {"\n"}
              </Text>

            <TouchableOpacity onPress={() => Linking.openURL('https://maps.app.goo.gl/Pk4ehQqnuHHdNVE2A')}>
              <Text style={{ color: 'blue' }}>
                https://maps.app.goo.gl/Pk4ehQqnuHHdNVE2A
                </Text>
            </TouchableOpacity>


            <Text style={styles.postDescription}>
             Amazon Fba Pakistan Entrepreneurs Institute (AFP Entrepreneurs Institute) suite 4, 2nd floor, sun flower plaza, main boulevard Liberty, next to Monal Restaurant, Lahore, 54000
              </Text>

          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: 45,
    marginBottom: 15,

  },
  inputContainer1: {
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: 120,
    marginBottom: 15,
    paddingLeft: 16,
    paddingRight: 16
  },
  loginButton: {
    backgroundColor: '#6cb505',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: "#32a84e",
  },
  loginButtonSection: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '85%',
    borderRadius: 30,
    alignSelf: 'center'
  },
  headerTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  postContent: {
    flex: 1,
    padding: 30,
  },
  postTitle: {
    fontSize: 26,
    fontWeight: '600',
  },
  postDescription: {
    fontSize: 16,
    marginTop: 10,
  },
  tags: {
    color: '#00BFFF',
    marginTop: 10,
  },
  date: {
    color: '#696969',
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
  },
  profile: {
    flexDirection: 'row',
    marginTop: 20
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  }
});
export default ContactUs;


// Address:
// {"\n"}{"\n"}
//  https://maps.app.goo.gl/Pk4ehQqnuHHdNVE2A

// {"\n"}{"\n"}

// Amazon Fba Pakistan Entrepreneurs Institute (AFP Entrepreneurs Institute)
// suite 4, 2nd floor, sun flower plaza, main boulevard Liberty, next to Monal Restaurant, Lahore, 54000