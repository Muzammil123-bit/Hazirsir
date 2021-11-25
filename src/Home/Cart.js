//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, Picker, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast'
import { WebView } from 'react-native-webview'

// create a component
class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            oid: '',
            order: [],
            phone: '',
            name_s: '',
            email_s: '',
            address: '',
            pType: 'cash',
            pModal: false,
            webModal: false
        };
    }
    async componentDidMount() {
        const value = await AsyncStorage.getItem('userID')
        var order = this.props.navigation.getParam('orders', '0');
        console.log(order)
        await this.setState({ uid: value, order: order })
        console.log(this.state.order)
    }
    async placeOrder() {

        if(this.state.name_s === "" )
        {
            Toast.show('Enter Your Name ', {
                duration: Toast.duration.LONG
            })
        }
        else if(this.state.phone === "")
        {
            Toast.show('Enter Your Phone Number ', {
                duration: Toast.duration.LONG
            })

        }
        else if( this.state.address === "")
        {
            Toast.show('Enter Your Address ', {
                duration: Toast.duration.LONG
            })

        }
        else
        {

            if(this.state.email_s === "" )
        {
            this.setState({ email_s: "NA" })
        }


            items = this.state.order
            arr = []
            for (a = 0, b = 0; a < items.length * 2; a += 2, b++) {
                arr[a] = items[b].id
                arr[a + 1] = items[b].quan
            }
            console.log(arr)
            const url = 'https://www.hazirsir.com/web_service/place_tool_order.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
            await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    z: [this.state.uid, this.state.pType, this.state.phone, this.state.address, this.state.name_s, this.state.email_s],
                    y: arr
                })
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    // resolve(responseJson);
                    // alert("respppp "+ JSON.stringify(responseJson))
                    if (responseJson === 'Record created successfully') {
                        await this.setState({ pModal: false })
                        this.emptyCart(0)
                        Toast.show('Order placed successfully.', {
                            duration: Toast.duration.LONG
                        })
                    }
                    if (this.state.pType === 'jazz' && responseJson.split('~')[0] === 'Record created successfully') {
                        await this.setState({ pModal: false })
                        await this.jazzcashPay(responseJson.split('~')[1])
                        // this.emptyCart(0)
                        Toast.show('Jazzcash, oid: ' + responseJson.split('~')[1], {
                            duration: Toast.duration.LONG
                        })
                    }
                    console.log(responseJson);
                    return responseJson;
                })
                .catch((error) => {
                    // reject(error);
                    // alert(error);
                    console.log(error);
    
                    return error;
                });



        }

      
    }
    _onNavigationStateChange(webViewState) {
        console.warn('webViewState\n', webViewState.url);
        const url = webViewState.url;
        if (
            url === 'https://www.hazirsir.com/' ||
            url === 'https://www.google.com/?gws_rd=ssl' ||
            url === 'https://www.google.com/'
        ) {
            this.emptyCart(0)
            this.setState({
                webModal: false,
                // generateRouteLoading: false,
            });
        }
    }
    async jazzcashPay(oid) {
        await this.setState({ oid: oid, total: this.state.order.map(item => item.quan * Number(item.price)).reduce((prev, next) => prev + next) })
        console.log(this.state.total + '00')
        this.setState({ webModal: true })
        // this.emptyCart(0)
    }
    async add(id) {
        console.log(id)
        var ord = this.state.order
        ord.find(x => x.id === id).quan += 1
        // ord.push({id:id, quan:1, price:price, name:name, stock:stock})
        await this.setState({ order: ord })
        console.log(this.state.order)
        // Alert.alert('Success', 'The product has been added to your cart')
    }
    async subtract(id) {
        console.log(id)
        var ord = this.state.order
        if (ord.find(x => x.id === id).quan !== 1) {
            ord.find(x => x.id === id).quan -= 1
            // ord.push({id:id, quan:1, price:price, name:name, stock:stock})
            await this.setState({ order: ord })
            console.log(this.state.order)
        } else {
            ord.splice(ord.indexOf(ord.find(x => x.id === id)), 1)
            await this.setState({ order: ord })
            if (this.state.order.length === 0) {
                this.props.navigation.goBack()
            }
        }

        // Alert.alert('Success', 'The product has been added to your cart')
    }
    async emptyCart(a) {
        if (a === 1) {
            Alert.alert(
                'Empty Cart',
                'Are you sure?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'Yes', onPress: async () => {
                            var ord = this.state.order
                            ord.splice(0, ord.length)
                            await this.setState({ order: ord })
                            if (this.state.order.length === 0) {
                                this.props.navigation.goBack()
                            }
                        }
                    },
                ],
                { cancelable: false }
            )
        }
        else {
            var ord = this.state.order
            ord.splice(0, ord.length)
            await this.setState({ order: ord })
            if (this.state.order.length === 0) {
                this.props.navigation.goBack()
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', width: '100%', height: 55, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'Montserrat-Bold' }}>My Cart</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignSelf: 'center', paddingRight: 5 }}>
                            <TouchableOpacity onPress={() =>
                                // this.placeOrder()
                                this.setState({ pModal: true })
                            }>
                                <View style={{ padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#32a84e' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                                        Check out
                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => this.emptyCart(1)}>
                                <View style={{ padding: 5, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#b84c21' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Montserrat-Bold' }}>Empty cart</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 50 }}>
                    <View>
                        <FlatList
                            data={this.state.order}
                            renderItem={(item) => {
                                return (
                                    <View style={styles.listItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: item.item.image }} />
                                                <View>
                                                    <TouchableOpacity onPress={() => this.add(item.item.id)}>
                                                        <View>
                                                            <Image
                                                                style={{ width: 30, height: 30, borderRadius: 35, padding: 5 }}
                                                                source={require('../Logos/plus.png')} />
                                                            {/* <Text>+Add</Text> */}
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => this.subtract(item.item.id)}>
                                                        <View>
                                                            <Image
                                                                style={{ width: 30, height: 30, borderRadius: 35, padding: 5 }}
                                                                source={require('../Logos/minus.png')} />
                                                            {/* <Text>-Subtract</Text> */}
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={{ fontFamily: 'Montserrat-Bold' }}>{item.item.name}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text>{'Price per piece:  '}</Text>
                                                    <Text>{'Rs. ' + item.item.price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text>{'Quantity:  '}</Text>
                                                    <Text>{item.item.quan}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text>{'Total price:  '}</Text>
                                                    <Text>{'Rs. ' + Number(item.item.price) * Number(item.item.quan)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={{ backgroundColor: '#32a84e', padding: 15, borderRadius: 5, alignSelf: 'center' }}>
                        {
                            this.state.order.length > 0 ?
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                                        Total Items:{' ' + this.state.order.map(item => item.quan).reduce((prev, next) => prev + next)}
                                    </Text>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                                        Grand Total:{' Rs. ' + this.state.order.map(item => item.quan * Number(item.price)).reduce((prev, next) => prev + next)}
                                    </Text>
                                </View> : null
                        }
                    </View>
                    {/* <View style={{backgroundColor:'#32a84e', padding:15, borderRadius:5, alignSelf:'center'}}>
                        <TouchableOpacity onPress={()=>
                            // this.placeOrder()
                            this.setState({pModal:true})
                        }>
                            <Text style={{fontFamily:'Montserrat-Bold', color:'white'}}>
                                Check out
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                <Modal
                    style={{ flex: 1 }}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.pModal}
                    onRequestClose={() => {
                        this.setState({ pModal: false });
                    }}>
                    <View style={{ flex: 1 }}>


                   



                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, flex: 5, justifyContent: 'center' }}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Text>
                                Payment Method
                            </Text>
                            <Picker
                                style={{ width: '80%' }}
                                selectedValue={this.state.pType}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ pType: itemValue })
                                }>
                                <Picker.Item label='Cash on Delivery' value='cash' />
                                <Picker.Item label='JazzCash' value='jazz' />
                                <Picker.Item label='Easypaisa' value='easypaisa' />
                                <Picker.Item label='Card' value='card' />
                            </Picker>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    value={this.state.name_s}
                                    // keyboardType = "phone-"
                                    onChangeText={(name_s) => {
                                        this.setState({ name_s })

                                    }}
                                    placeholder="Name"
                                    underlineColorAndroid='transparent' />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    value={this.state.phone}
                                    keyboardType = "phone-pad"
                                    onChangeText={(phone) => {
                                        this.setState({ phone })

                                    }}
                                    placeholder="Phone number"
                                    underlineColorAndroid='transparent' />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    value={this.state.address}
                                    onChangeText={(address) => {
                                        this.setState({ address })

                                    }}
                                    placeholder="Address"
                                    underlineColorAndroid='transparent' />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.inputs}
                                    value={this.state.email_s}
                                    onChangeText={(email_s) => {
                                        this.setState({ email_s })

                                    }}
                                    placeholder="Email (optional)"
                                    underlineColorAndroid='transparent' />
                            </View>


                            

                            <TouchableOpacity onPress={() =>
                                this.placeOrder()
                                // this.setState({pModal:true})
                            }>
                                <View style={{ backgroundColor: '#32a84e', padding: 15, borderRadius: 5, alignSelf: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                                        Proceed
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
               
               
                <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "center" }}>Our representative will contact you and calculate delivery charges</Text>

                    </View>
                    </View>
               
               
                </Modal>
                <Modal
                    style={{ flex: 1 }}
                    animationType='slide'
                    visible={this.state.webModal}
                    onRequestClose={() => {
                        this.setState({ webModal: false })
                    }}>
                    {/* <View style={{flex:1, alignItems:'center', justifyContent:'center'}}> */}
                    <WebView
                        ref="webview"
                        // style={{ marginTop: 20 }}
                        source={{ uri: 'https://quaidstp.com/projects/hazir_sir/portal/jazzcash/index1.php?user_id=' + this.state.uid + '&order_id=' + this.state.oid + '&amount=' + this.state.total + '00' }}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                        renderLoading={() => {
                            return <TabViewLoader />;
                        }}
                    />
                    {/* </View> */}
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        margin: 10,
        backgroundColor: 'white'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputContainer: {
        padding: 5,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        width: '100%',
        height: 45,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },

});

//make this component available to the app
export default Cart;
