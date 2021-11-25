import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, ToastAndroid, StyleSheet, Modal, ActivityIndicator, CheckBox
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { firebase as fcm } from '@react-native-firebase/messaging';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

import { Dropdown } from 'react-native-material-dropdown';

import ModalDropdown from 'react-native-modal-dropdown';

// import CheckBox from 'react-native-check-box'

const resetAction2 = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Skills' })],
});


const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Home' })],
});


import DB from './DB';
import Country from './Country_t';
import State from './state_t';
import City from './City_t';



const db = new DB();
const CountryDB = new Country();
const StateDB = new State();
const CityDB = new City();

let DEMO_OPTIONS_2 = [];

let data_array = [];

class signupreg extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  state = {
    p_no_s: '',
    Name_s: '',
    modal1Visible: true,
    modal2Visible: false,

    city_s: '',
    country_s: '',
    country_state_arr: '',
    state_state_arr: '',
    city_state_arr: '',
    State_s: '',
    loadingModal: false,
    uid: '',
    disable_resend: false,
    State_ss: 'dfdfdfdf',

    state_valueee: '',
    city_value: '',
    checked: false,
    timer: 59,


  };

  async componentDidMount() {
    const value = await AsyncStorage.getItem('userID')
    await this.setState({ uid: value })

    this.setState({ modal2Visible: false });
    this.setState({ loadingModal: false })
    this.setState({ checked: false })
    this.setState({ disable_resend: false })
    this.setState({ timer: 59 })


    setTimeout(() => {
      this.get_country_data();
    }, 500);



  }

  componentDidUpdate() {
    if (this.state.timer === 1) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this._interval);
  }




  get_country_data = async () => {

    var ff = await CountryDB.listCategory();
    // const categories_Show = await StateDB.listCategory();
    // const categories_Show = await CityDB.listCategory();



    this.setState({ country_state_arr: ff })

    // alert(JSON.stringify(ff));
  }


  async change_pass() {

    const value = await AsyncStorage.getItem('phone_auth')
    const ph_no = await AsyncStorage.getItem('phone_num')
    this.change_password();
  }



  async resend_code() {
    this.setState({ loadingModal: true });
    const phoneNumber = this.state.p_no_s;
    await firebase.auth().signInWithPhoneNumber('+92' + phoneNumber)
      .then(async (confirmResult) => {

        if (confirmResult._verificationId === null) {
          console.log('verCode is null')
          console.log(confirmResult)
     //     alert(confirmResult);
          this.setState({ loadingModal: false });

        } else {
          this.setState({ loadingModal: false });
          this.setState({ confirm: confirmResult });
          this.setState({ disable_resend: true });

          setTimeout(() => {
            this.setState({ disable_resend: false });
            this.setState({ timer: 59 })
          }, 59000);
          this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
          );
        }

      })
      .catch((error) => {
        const { code, message } = error;
        alert(error);
        this.setState({ loadingModal: false });
      });
  }

 
  async change_p() {
    this.setState({ loadingModal: true });
    const Name_s = this.state.Name_s;
    const city_s = this.state.city_s;
    const p_no_s = this.state.p_no_s;
    const country_s = this.state.country_s;
    const State_s = this.state.State_s;
    if (Name_s === "" || Name_s === null || Name_s === undefined || Name_s === "undefined" || Name_s.length === 0) {
      alert("Please Enter Name");
      this.setState({ loadingModal: false });
    }
    else if (p_no_s === "" || p_no_s === null || p_no_s === undefined) {

      alert("Please Enter Phone Number");
      this.setState({ loadingModal: false });
    }
    else if (city_s === "" || city_s === null || city_s === undefined) {
      alert("Please Enter City Name");
      this.setState({ loadingModal: false });
    }
    else if (State_s === "" || State_s === null || State_s === undefined) {
      alert("Please Enter State Name");
      this.setState({ loadingModal: false });
    }
    else if (country_s === "" || country_s === null || country_s === undefined) {
      alert("Please Enter Country Name");
      this.setState({ loadingModal: false });
    }
    else {
      const phoneNumber = this.state.p_no_s;
      await firebase.auth().signInWithPhoneNumber('+92' + phoneNumber)
        .then(async (confirmResult) => {
          if (confirmResult._verificationId === null) {
            console.log('verCode is null')
            console.log(confirmResult)
    //        alert(confirmResult);
            this.setState({ loadingModal: false });

          } else{
            this.setState({ loadingModal: false });

            this.setState({ confirm: confirmResult});
            this.setState({modal2Visible: true});
            // setTimeout(() => {
            //   this.onVerificationCode2();
            // }, 300);
            this._interval = setInterval(() => {
              this.onVerificationCode2();
            }, 7000);
          
          }
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          if (error.toString().includes("invalid")) {
            alert("Please Enter Valid Phone Number");
          }
          else {
            alert(error);
          }
          this.setState({ loadingModal: false });
        });
    }
  }

  async change_password() {
    const Name_s = this.state.Name_s;
    const city_s = this.state.city_s;
    const p_no_s = this.state.p_no_s;
    const country_s = this.state.country_s;
    const State_s = this.state.State_s;
    if (Name_s === "" || Name_s === null || Name_s === undefined || Name_s === "undefined" || Name_s.length === 0) {
      alert("Please Enter Name");
      this.setState({ loadingModal: false });
    }

    else if (p_no_s === "" || p_no_s === null || p_no_s === undefined) {

      alert("Please Enter Phone Number");
      this.setState({ loadingModal: false });
    }
    else if (city_s === "" || city_s === null || city_s === undefined) {
      alert("Please Enter City Name");
      this.setState({ loadingModal: false });
    }
    else if (State_s === "" || State_s === null || State_s === undefined) {
      alert("Please Enter State Name");
      this.setState({ loadingModal: false });
    }
    else if (country_s === "" || country_s === null || country_s === undefined) {
      alert("Please Enter Country Name");
      this.setState({ loadingModal: false });
    }
    else {

      var data = [];
      data =
        [
          this.state.uid,
          Name_s,
          city_s,
          country_s,
          p_no_s
        ];

        // alert(JSON.stringify(data))
      const url = 'https://www.hazirsir.com/web_service/update_details.php';
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
          this.setState({ loadingModal: false });
          if (responseJson === 'true') {
            this.saveServerResp();
            if (this.state.checked) {
              this.props.navigation.dispatch(resetAction2)
            }
            else {
              this.props.navigation.dispatch(resetAction)
            }
          } else {
            Alert.alert(responseJson);
          }
          return responseJson;
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loadingModal: false });
          return error;
        });
    }
  }


  
  async onVerificationCode2() {
    const confirmResult = this.state.confirm;
    this.setState({ loadingModal: false });
    console.warn(firebase.auth().currentUser);
    if (this.state.confirm) {
      await confirmResult.confirm("889977").then(async (user) => {
        console.warn('code correct')
        this.setState({ modal2Visible: false });
        this.ge_passwordchan();
      })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          if (error.toString().includes("session-expired")) {
            this.setState({ modal2Visible: false });

            this.change_password();
          }
          else {
            // alert(error);
          }
        });
    }
  }


  

  async onVerificationCode() {
    alert('inside phone verification');
    console.log('inside phone verification');
    this.setState({ loadingModal: true });
    const confirmResult = this.state.confirm;
    const verificationCode = this.state.code;
  
        if (verificationCode === "" || verificationCode === null
          || verificationCode === undefined || verificationCode === "undefined" || verificationCode.length === 0) {
          alert("Please Enter Code");
          this.setState({ loadingModal: false });
        }
        else {

          this.setState({ loadingModal: false });

          console.warn(firebase.auth().currentUser);
          if (this.state.confirm) {
          
            await confirmResult.confirm(verificationCode).then(async (user) => {
              console.warn('code correct')
              this.setState({ modal2Visible: false });

              this.change_password();
            
            })
              .catch((error) => {
                const { code, message } = error;
                console.log(error)
                if (error.toString().includes("invalid")) {
                  alert("Verification code is invalid");
                }
                else {
                  alert(error);
                }
                this.setState({ loadingModal: false });
              });
          }
        }
  }


  async saveServerResp() {

    await this.storeData();
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('NewOld', 'New')
    } catch (e) {
    }
  }

  onChangeTexttt = async (text) => {
    // alert(JSON.stringify(text))
    this.setState({ city_s: text })
    this.setState({ city_value: text })
  }

  onChangeTextt = async (text) => {
    // alert(JSON.stringify(text.c_id));

    // this.setState({city_state_arr: []})
    // alert("hhh  "+text);

    this.setState({ city_value: "" })



    let DEMO_OPTIONS_4 = [];
    let city_array = [];
    // city_array = await CityDB.listCategory(text.c_id);
    city_array = await CityDB.listCategory_all();
    this.setState({ city_state_arr: city_array })

    this.setState({ State_s: text })

    this.setState({ state_valueee: text })

    //    DEMO_OPTIONS_4 = await StateDB.listCategory_all();
    // for (let index = 0; index < DEMO_OPTIONS_4.length; index++) {
    //   const elementt = DEMO_OPTIONS_4[index];

    //   if(elementt.value === text)
    //   {



    // city_array = await CityDB.listCategory_all();

    // alert(JSON.stringify(elementt)+"   "+JSON.stringify(city_array));




    //     }

    // }



  }

  onChangeText = async (text) => {
    // alert(text);

    this.setState({ state_valueee: "" })



    let DEMO_OPTIONS_3 = [];
    let state_array = [];

    //    DEMO_OPTIONS_3 = await CountryDB.listCategory();
    // for (let index = 0; index < DEMO_OPTIONS_3.length; index++) {
    //   const elementt = DEMO_OPTIONS_3[index];

    //   if(elementt.value === text)
    //   {
      

      state_array = await StateDB.listCategory_all();
    // state_array = await StateDB.listCategory(text.c_id);


    // alert(JSON.stringify(state_array));



    //     }

    // }
    this.setState({ state_state_arr: state_array })
    this.setState({ country_s: text })



    //this.sendDataOnline();
  }



  render() {



    return (



      <ScrollView
      >


        {this.state.loadingModal &&

          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={true}
          // visible={this.state.loadingModal}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ padding: 20, backgroundColor: 'white', borderWidth: 5, borderColor: 'gray', alignSelf: 'center', borderRadius: 30 }}>
                <ActivityIndicator size='large' color='gray' />
              </View>

            </View>
          </Modal>
        }

        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={false}
          visible={this.state.modal2Visible}
          onRequestClose={() => {
            this.setState({ modal2Visible: false });
          }}
        // visible={this.state.modal2Visible}
        >
          <View style={styles.container}>



            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Verify Phone
              </Text>
            </View>

            <View style={{ marginTop: 50 }}>



              <Text style={{ marginVertical: 10, alignSelf: 'center' }}>
                Enter authentication code
      </Text>

              <View style={styles.inputContainerr}>
                <TextInput style={styles.inputs}
                  value={this.state.code}
                  onChangeText={(code) => this.setState({ code })}
                  keyboardType={'numeric'}
                  placeholder="Code"
                  underlineColorAndroid='transparent' />
              </View>
              <TouchableOpacity style={[styles.buttonContainerr, styles.fabookButton]}
                onPress={() => this.onVerificationCode()}>
                <View style={styles.socialButtonContent}>
                  <Text style={styles.loginText}>Phone Number Verification</Text>
                </View>
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={[styles.button_resend, styles.fabookButton]}
              disabled={this.state.disable_resend}
              onPress={() =>
                this.resend_code()
              }>
              <View style={styles.socialButtonContent}>

                <Text style={styles.loginText}>Resend Code</Text>
              </View>
            </TouchableOpacity>

            {this.state.disable_resend ?
              <Text style={{ alignSelf: "flex-end", marginRight: "20%" }}>Resend Code {this.state.timer}</Text>
              :
              <Text style={{ alignSelf: "flex-end", marginRight: "20%" }}></Text>
            }

          </View>
        </Modal>





        <View style={styles.container}>


          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Registration
              </Text>
          </View>



          <View style={styles.postContent}>
            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput
                value={this.state.Name_s}
                onChangeText={(Name_s) => this.setState({ Name_s })}
                placeholder="Name"
                underlineColorAndroid='transparent' />

            </View>

            <View style={styles.inputContainer}>
              {/* <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/password/androidL/40/3498db'}}/> */}

              <TextInput
                value={this.state.p_no_s}
                onChangeText={(p_no_s) => this.setState({ p_no_s })}
                placeholder="3XX-XXXXXXX"
                keyboardType='phone-pad'
                underlineColorAndroid='transparent' />

            </View>


            <View style={styles.inputContainer}>
              <Dropdown

                label="Country" data={this.state.country_state_arr}
                // onChangeText={this.onChangeText}
                onChangeText={(data) => this.onChangeText(data)}

              />
            </View>

            <View style={styles.inputContainer}>
              <Dropdown

                label="State" data={this.state.state_state_arr}
                onChangeText={(data) => this.onChangeTextt(data)}
                value={this.state.state_valueee}
              />
            </View>


            <View style={styles.inputContainer}>
              <Dropdown

                label="City" data={this.state.city_state_arr}
                onChangeText={(data) => this.onChangeTexttt(data)}
                value={this.state.city_value}
              />
            </View>



            <View style={{
              flexDirection: "row",
              marginBottom: 12
            }}>
              <CheckBox
                value={this.state.checked}
                onValueChange={() => this.setState({ checked: !this.state.checked })}
                style={{ alignSelf: "center" }}
              />
              <Text style={{ margin: 8 }}>{"Do you also want to be a tasker and earn daily money by doing tasks in the app ? NOTE: (you can register as a tasker later on too)"}</Text>

            </View>


            {/* {this.state.checked &&
            <Text>Is CheckBox selected: {this.state.checked ? "👍" : "👎"}</Text> 

            } */}



            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.change_pass()}>
              <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>



          </View>
        </View>
        {/* </Modal> */}

      </ScrollView>



    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: "#00b5ec",
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 10,
  },
  postContent: {
    flex: 1,
    padding: 30,
  },


  inputContainer: {
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: 65,
    marginBottom: 15,
  },
  buttonContainer: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#6cb505',
  },
  inputContainerr: {
    padding: 5,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    width: '85%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    alignSelf: 'stretch',
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainerr: {
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '85%',
    borderRadius: 30,
  },
  button_resend: {
    height: 38,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "flex-end",
    marginBottom: 20,
    // width: '85%',
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 20
  },

  fabookButton: {
    backgroundColor: "#32a84e",
  },
  loginText: {
    color: 'white',
  },

  socialButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },



  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    height: 500,
    paddingVertical: 100,
    paddingLeft: 20,
  },
  textButton: {
    color: 'deepskyblue',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'deepskyblue',
    margin: 2,
  },


  dropdown_2: {
    alignSelf: 'center',
    width: '100%',
    height: 45,

    borderWidth: 2,
    borderRadius: 8,
    borderTopColor: '#000000',
    backgroundColor: '#dfdfdf',
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    alignSelf: 'center',
    width: '100%',
    height: 200,
    borderWidth: 3,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },






});

export default signupreg;
