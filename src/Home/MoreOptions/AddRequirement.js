import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

class AddRequirement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pkg_one_details_state: '',
            Skill_id: '',
            package_title: '',
            package_one_details: '',
            package_one_price: '',
            package_two_details: '',
            package_two_price: '',
            package_three_details: '',
            package_three_price: ''






        };
    }

    async componentDidMount() {

        var Skill_id = this.props.navigation.getParam('Skill_Id', '0');
        var package_title = this.props.navigation.getParam('package_title', '');
        var package_one_details = this.props.navigation.getParam('package_one_details', '');
        var package_one_price = this.props.navigation.getParam('package_one_price', '');
        var package_two_details = this.props.navigation.getParam('package_two_details', '');
        var package_two_price = this.props.navigation.getParam('package_two_price', '');
        var package_three_details = this.props.navigation.getParam('package_three_details', '');
        var package_three_price = this.props.navigation.getParam('package_three_price', '');

        this.setState({
            Skill_id, package_title, package_one_details, package_one_price,
            package_two_details, package_two_price, package_three_details, package_three_price
        })

        // alert( package_two_details + package_three_details );
    }

    async sendSkills() {
        //   this.props.navigation.navigate("SubmitGigg")

        if (this.state.pkg_one_details_state === "") {
            alert(" Please Write Requirements");
        }
        else {




            this.props.navigation.navigate("SubmitGigg"
                ,
                {
                    Skill_Id: this.state.Skill_id,
                    package_title: this.state.package_title,
                    package_one_details: this.state.package_one_details,
                    package_one_price: this.state.package_one_price,
                    package_two_details: this.state.package_two_details,
                    package_two_price: this.state.package_two_price,
                    package_three_details: this.state.package_three_details,
                    package_three_price: this.state.package_three_price,
                    Requirement_: this.state.pkg_one_details_state

                }
            )



        }


    }

    render() {
        return (

            <View style={styles.container}>

                <View style={{ marginHorizontal: 15, marginTop: 25, flex: 4 }}>



                    <TextInput
                        style={{ backgroundColor: "#fff", marginTop: 10, paddingLeft: 10 }}
                        placeholder="Please write your Requirements from the client for work done"
                        multiline={true}
                        numberOfLines={12}
                        onChangeText={text => this.setState({ pkg_one_details_state: text })}
                        value={this.state.pkg_one_details_state}></TextInput>

                </View>

                <View style={{ flex: .5, alignItems: "flex-end", justifyContent: "flex-end", marginRight: 15 }}>
                    <TouchableOpacity onPress={() => this.sendSkills()}
                        style={{ marginBottom: 10 }}>
                        <View style={{ backgroundColor: '#32a84e', borderRadius: 5, height: 35, width: 150, alignSelf: 'center', marginTop: 7 }}>
                            <Text style={{ alignSelf: 'center', marginTop: 5, fontSize: 18, color: 'white' }}>
                                Next
                                </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",

    },
    header: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: "#32a84e",
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
    name: {
        fontSize: 22,
        color: "#00BFFF",
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10
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
export default AddRequirement;