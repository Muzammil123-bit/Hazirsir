import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, Image,
    RefreshControl, StyleSheet, TextInput
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

import {
    // Rating,
    AirbnbRating
} from 'react-native-ratings';


class CompletedOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            chatsPoster: [],
            chatsTasker: [],
            refreshing: false,
            data: '',

        };
    }
    async componentDidMount() {
        const value = await AsyncStorage.getItem('userID')
        await this.setState({ uid: value })

        setTimeout(async () => {
            await this.sendToServer()

        }, 200);
    }
    async onRefreshtask() {
        this.setState({ refreshing: true })
        await this.sendToServer()
        this.setState({ refreshing: false })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    async sendToServer() {
        // console.log(uid)
        const url = 'https://www.hazirsir.com/web_service/read_gig_apply.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [this.state.uid],
            })
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                await this.setState({ data: responseJson[2] })
                console.warn(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);
                // alert(JSON.stringify(error));


                return error;
            });
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f2f2f2", }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefreshtask()} />
                    }>
                    {this.state.data.length ?
                        <View>
                            <Text style={{ color: 'gray' }}>Drag down to refresh</Text>

                            <FlatList
                                data={this.state.data}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View>
                                            <View style={{ backgroundColor: '#ffffff', marginTop: 4, marginBottom: 4, marginHorizontal: 10 }}>
                                                <TouchableOpacity
                                                    style={{ marginVertical: 10 }}
                                                    // onPress={()=> this.ItemPass()}
                                                    onPress={() => this.props.navigation.navigate('GigChat',
                                                        {
                                                            Apply_gig_id: item.id,
                                                            Recever_id: item.user_id,
                                                            ChatName: item.name,
                                                            Gig_title: item.gig_title,
                                                            Gig_requirement: item.gig_requirement,
                                                            Gig_ans: item.client_req_ans,
                                                        }
                                                    )}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Image
                                                            style={
                                                                { width: 65, height: 65, marginTop: 0, paddingTop: 0, borderRadius: 32, }
                                                            }
                                                            source={{ uri: item.pic }}
                                                            resizeMode='cover' />

                                                        <View >

                                                            <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "bold" }}>Gig Title: {item.gig_title}</Text>

                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, fontWeight: "bold" }}>Client: </Text>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, width: "60%" }}>{item.name}</Text>

                                                            </View>

                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, fontWeight: "bold" }}>Package: </Text>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, width: "60%" }}>{item.package_detail}</Text>


                                                            </View>


                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, fontWeight: "bold" }}>Price: </Text>
                                                                <Text style={{ marginLeft: 10, fontSize: 13, marginTop: 4, width: "60%" }}>{item.package_price}</Text>


                                                            </View>
                                                            {item.status === "reviewed" ?

                                                                null :

                                                                <TouchableOpacity
                                                                    style={{ alignSelf: "flex-end", backgroundColor: "#32a84e", marginRight: 10, borderRadius: 30 }}

                                                                    onPress={() => this.props.navigation.navigate('Rating_gig',
                                                                        {
                                                                            gig_title: item.gig_title,
                                                                            package_detail: item.package_detail,
                                                                            user_tasker_id: item.user_id,
                                                                            gig_id: item.id,

                                                                        }
                                                                    )}
                                                                >
                                                                    <Text style={{ color: 'white', paddingVertical: 3, paddingHorizontal: 8 }}>Review</Text>
                                                                </TouchableOpacity>



                                                            }









                                                        </View>



                                                    </View>




                                                </TouchableOpacity>



                                            </View>



                                        </View>
                                    )
                                }}
                            />
                        </View>

                        :
                        <Text style={{ color: 'gray' }}>No records found</Text>


                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    typeHeading: {
        alignSelf: 'center',
        fontSize: 10,
        paddingVertical: 5
    }
})
export default withNavigation(CompletedOffer);
