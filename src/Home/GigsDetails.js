import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TextInput, FlatList, Image, Slider, Modal,
    TouchableOpacity, Dimensions, BackHandler
} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import ImageZoom from 'react-native-image-pan-zoom';
import Sound from 'react-native-sound'
import AsyncStorage from '@react-native-community/async-storage';


import { withNavigation } from 'react-navigation';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DATA = [
    {
        work_date: 'bd7acbea',
        title: 'First Item',
    },
    {
        work_date: '3ac68afc-',
        title: 'Second Item',
    },
    {
        work_date: '58694a0f',
        title: 'Third Item',
    },
    {
        work_date: '3ac68afc-',
        title: 'Second Item',
    },
    {
        work_date: '58694a0f',
        title: 'Third Item',
    },

];
let navigatio = null;

class GigsDetails extends Component {

    navigate_data = navigate_ => {
        navigatio = navigate_;
    };
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.onPause = this.onPause.bind(this);
        this.state = {
            title_state: "",
            videoModal: false,
            imageModal: false,
            videoLink: "",
            ImageLink: "",
            duration: 0,
            currentTime: null,
            pausedVdo: true,
            gig_user_id: '',
            order_id: '',
            title: '',
            requirements: '',
            requirements_ans: '',
            packagee: '',
            image: '',
            audio: '',
            video: '',
            skill_name: '',
            Images_state: '',
            Videos_state: '',
            Audio_state: '',
            Package_state: '',
            requirement_modal: false,
            package_id: '',
            playing_: false


        };
    }

    msToTime(time) {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    onSeeking(value) {
        console.log(Math.round(value))
        this.seek(Math.round(value));
    }
    seek(time) {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
        });
    }
    onLoad = data => {
        console.log(this.msToTime(data.duration))

        this.setState({ duration: data.duration, isLoading: false })
    };
    onEnd = () => this.setState({ paused: true });
    onProgress = data => {
        console.log(data)
        if (!this.state.paused)
            this.setState({ currentTime: data.currentTime });

    };
    onPause = () => this.setState({ paused: !this.state.paused })

    async video(vid) {
        await this.setState({ videoLink: vid })
        await this.setState({ videoModal: true })
        // alert(this.state.videoLink);
    }


    async requirement_(pkg_id) {
        await this.setState({ requirement_modal: true })
        await this.setState({ package_id: pkg_id })
        // alert(this.state.videoLink);
    }



    async bigImage(img) {
        await this.setState({ ImageLink: img })
        await this.setState({ imageModal: true })
        // alert(this.state.videoLink);
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        const value = await AsyncStorage.getItem('userID')
        // await this.setState({uid:value})
        var user_id = this.props.navigation.getParam('user_id', '0');
        var order_id = this.props.navigation.getParam('order_id', '0');
        var title = this.props.navigation.getParam('title', '0');
        var requirements = this.props.navigation.getParam('requirements', '0');
        var packagee = this.props.navigation.getParam('package', '0');
        var image = this.props.navigation.getParam('image', '0');
        var audio = this.props.navigation.getParam('audio', '0');
        var video = this.props.navigation.getParam('video', '0');
        var skill_name = this.props.navigation.getParam('skill_name', '0');

        this.setState({
            gig_user_id: value, order_id, title, requirements,
            packagee, image, audio, video, skill_name
        })

        setTimeout(() => {
            this.sendToServer();
        }, 500);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        // this.willFocusSubscription.remove();
    }

    handleBackButtonClick = () => {

        try {
            this.track.pause()
            this.track.stop(() => {
            });
            this.track.release();

        } catch (error) {

        }


        this.props.navigation.goBack(null);



        return true;

    }


    async sendToServer() {
        // console.log(uid)
        const url = 'https://www.hazirsir.com/web_service/read_gig_details.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                z: [this.state.gig_user_id, this.state.order_id],
            })
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                // Showing response message coming from server after inserting records.
                // resolve(responseJson);
                console.warn(JSON.stringify(responseJson));
                this.setState({
                    Images_state: responseJson[1], Videos_state: responseJson[3],
                    Audio_state: responseJson[2], Package_state: responseJson[4]
                })
                // console.warn("jjj",z);
                //   if(responseJson!=='Record doesnot exist' && responseJson!=='Wrong Credentials!'){
                //   await this.setState({data:responseJson })
                //   }

                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);

                return error;
            });
    }

    async apply_gig() {
        // console.log(uid)


        if (this.state.requirements_ans === '') {
            alert("Please write ans");
        }
        else {



            const url = 'https://www.hazirsir.com/web_service/apply_gig.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
            await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    z: [this.state.gig_user_id, this.state.order_id, this.state.package_id, this.state.requirements_ans],
                })
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    // Showing response message coming from server after inserting records.
                    // resolve(responseJson);
                    console.warn("response applyyyy   ", JSON.stringify(responseJson), this.state.package_id);
                    // this.setState({
                    //     Images_state: responseJson[1], Videos_state: responseJson[3],
                    //     Audio_state: responseJson[2], Package_state: responseJson[4]
                    // })
                    // console.warn("jjj",z);
                    alert(responseJson);
                    if (responseJson === 'Record created successfully') {
                        await this.setState({ requirement_: "" })
                        await this.setState({ package_id: "" })
                        await this.setState({ requirement_modal: "" })
                    }

                    return responseJson;
                })
                .catch((error) => {
                    // reject(error);
                    console.log(error);

                    return error;
                });



        }



    }


    play_ = (url) => {

        

        try {
            this.track.stop(() => { });
        } catch (error) {
        }
        
        try {
            this.track = new Sound(url, null, (e) => {
                if (e) {
                    alert('error loading track:' + e)
                } else {

                    this.track.play((success) => {

                        if (success) {


                        } else {
                            alert('playback failed due to audio decoding errors');
                        }
                    });
                }
            })



        } catch (e) {
            console.warn(`cannot play the sound file`, e)
        }
    }

    pause_ = async () => {
        try {

            this.track.pause()

        } catch (e) {
            console.warn(`pause error`, e)
        }

        this.setState({ playing_: false })

    }

    resume_ = async () => {
        // alert("hhh");
        try {
            this.track.play()

        } catch (e) {
            console.warn(`resume error`, e)
        }

    }
    stop_ = async () => {
        // alert("hhh");
        try {

            this.track.stop(() => { });
        } catch (e) {
            console.warn(`stop error`, e)
        }

    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ marginHorizontal: 15, marginBottom: 20 }}>
                        <Text style={{ fontSize: 15, marginTop: 40 }}>Title</Text>
                        <TextInput
                            style={{ backgroundColor: "#fff", paddingLeft: 10, marginTop: 8, color: "#000" }}
                            placeholder="Title"
                            editable={false}
                            // onChangeText={text => this.setState({ title_state: text })}
                            value={this.state.title}></TextInput>

                        <Text style={{ fontSize: 15, marginTop: 5 }}>Category</Text>
                        <TextInput
                            style={{ backgroundColor: "#fff", paddingLeft: 10, marginTop: 8, color: "#000" }}
                            placeholder="Category"
                            editable={false}
                            // onChangeText={text => this.setState({ title_state: text })}
                            value={this.state.skill_name}></TextInput>
                

                        {this.state.image === "yes" ?
                            (
                                <View style={{borderTopWidth:.5, borderBottomWidth:.5, borderColor:"#000", marginTop:10}}>

                                    <Text style={{ fontSize: 15, marginTop: 5 }}>Images</Text>
                                    <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center" , backgroundColor:"#fff"}}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            <FlatList
                                                data={this.state.Images_state}
                                                horizontal={true}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View>
                                                            <View style={{ backgroundColor: '#ffffff', marginTop: 4, marginBottom: 12, marginHorizontal: 10, alignItems: "center", justifyContent: "center", flex: 1 }}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.bigImage(item.image_url)}>
                                                                    <Image style={{ height: 80, width: 80, flex: 1 }}
                                                                        source={{ uri: item.image_url }} />
                                                                </TouchableOpacity>

                                                            </View>

                                                        </View>
                                                    )
                                                }}
                                            />

                                        </ScrollView>


                                    </View>
                                </View>

                            ) : null}


                        {this.state.video === "yes" ?
                            (
                                <View style={{ borderBottomWidth:.5, borderColor:"#000", marginTop:10}} >

                                    <Text style={{ fontSize: 15, marginTop: 5 }}>Videos</Text>
                                    <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor:"#fff" }}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}>
                                            <FlatList
                                                data={this.state.Videos_state}
                                                horizontal={true}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View>
                                                            <View style={{ backgroundColor: '#ffffff', marginTop: 4, marginBottom: 12, marginHorizontal: 10, alignItems: "center", justifyContent: "center", flex: 1 }}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.video(item.video_url)}>
                                                                    <Video source={{ uri: item.video_url }}
                                                                        ref={(ref) => { this.player = ref }}
                                                                        paused={this.state.pausedVdo}
                                                                        style={{ height: 80, width: 80 }} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )
                                                }} />
                                        </ScrollView>
                                    </View>

                                </View>


                            ) : null}


                        {this.state.audio === "yes" ?
                            (
                                <View style={{ borderBottomWidth:.5, borderColor:"#000", marginTop:10}}>

                                    <Text style={{ fontSize: 15, marginTop: 5 }}>Audio</Text>
                                    <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor:"#fff" }}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}>
                                            <FlatList
                                                data={this.state.Audio_state}
                                                horizontal={true}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View>

                                                            <View style={{ marginTop: 4, marginBottom: 16, marginHorizontal: 10, alignItems: "center", justifyContent: "center", flex: 1, flexDirection:"row" }}>



                                                                <TouchableOpacity
                                                                    onPress={() => this.play_(item.audio_url)}>

                                                                    <Image style={{
                                                                        height: 35,
                                                                        width: 35,
                                                                        flex: 1
                                                                    }} source={require('../Logos/play.png')} />


                                                                </TouchableOpacity>


                                                                <TouchableOpacity
                                                            style={{marginLeft: 5}}
                                                                    onPress={() => this.stop_()}>

                                                                    <Image style={{
                                                                        height: 35,
                                                                        width: 35,
                                                                        flex: 1
                                                                    }} source={require('../Logos/stoprec.png')} />


                                                                </TouchableOpacity>


                                                            </View>

                                                        </View>
                                                    )
                                                }}
                                            />

                                        </ScrollView>


                                    </View>
                                </View>
                            ) : null}

                        {this.state.packagee === "yes" ?
                            (
                                <View >

                                    <View style={{ marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                                        {/* <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                        > */}
                                        <FlatList
                                            data={this.state.Package_state}
                                            // horizontal={true}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View>


                                                        <Text style={{ fontSize: 15, marginTop: 10 }}>Package {index + 1}</Text>

                                                        <View style={{ marginTop: 4, marginBottom: 4, marginHorizontal: 10, borderColor: "#000", borderWidth: .3, padding: 8, width: windowWidth * .82 }}>


                                                            <TextInput
                                                                style={{ backgroundColor: "#fff", paddingLeft: 10, marginTop: 8, color: "#000" }}
                                                                placeholder="Category"
                                                                // onChangeText={text => this.setState({ title_state: text })}
                                                                value={item.package_details}></TextInput>

                                                            <TextInput
                                                                style={{ backgroundColor: "#fff", marginTop: 10, paddingLeft: 10, width: "30%", color: "#000" }}
                                                                placeholder="Price"
                                                                keyboardType="numeric"
                                                                value={item.price}>
                                                            </TextInput>

                                                            <TouchableOpacity
                                                                onPress={() => this.requirement_(item.package_id)}
                                                                style={{ backgroundColor: "#32a84e", alignSelf: "flex-end", width: 60, alignItems: "center", borderRadius: 35 }}>
                                                                <Text style={{ fontSize: 13, padding: 8, color: "#fff", textAlign: "center" }}>Buy</Text>
                                                            </TouchableOpacity>


                                                        </View>








                                                    </View>
                                                )
                                            }}
                                        />

                                        {/* </ScrollView> */}


                                    </View>

                                </View>


                            ) : null}


                    </View>

                </ScrollView>


                <View>
                    <Modal
                        style={{ flex: 1 }}
                        animationType="slide"
                        transparent={false}
                        visible={this.state.videoModal}
                        onRequestClose={() => {
                            this.setState({ videoModal: false });
                        }}>

                        <View style={{ padding: 5, alignSelf: 'center' }}>

                            <Video source={{ uri: this.state.videoLink }}
                                ref={(ref) => { this.player = ref }}
                                onLoad={this.onLoad}
                                onProgress={this.onProgress}
                                paused={this.state.paused}
                                onEnd={this.onEnd}
                                style={{ height: 300, width: 300 }}
                                repeat={true}
                            />
                            <Slider
                                value={this.state.currentTime}
                                minimumValue={0}
                                maximumValue={this.state.duration}
                                onSlidingComplete={value => this.onSeeking(value)}
                                trackStyle={styles.trackStyle}
                                thumbStyle={styles.thumbStyle}
                                minimumTrackTintColor='#333' />
                            <View style={styles.timeDurationContainer}>
                                <Text>{this.msToTime(this.state.currentTime)}</Text>
                                <Text>{this.msToTime(this.state.duration)}</Text>
                            </View>

                            <View style={styles.bContainer}>
                                <TouchableOpacity style={styles.btnContainer} onPress={() => this.onPause()}>
                                    {!this.state.paused ? (
                                        <Image
                                            style={{ width: 40, height: 40 }}
                                            source={require('../Logos/pause.png')} />
                                    ) : (
                                            <Image
                                                style={{ width: 40, height: 40 }}
                                                source={require('../Logos/play.png')} />
                                        )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>


                <View>
                    <Modal
                        style={{ flex: 1 }}
                        animationType="slide"
                        transparent={false}
                        visible={this.state.imageModal}
                        onRequestClose={() => { this.setState({ imageModal: false }) }}>
                        <View style={{ padding: 5, alignSelf: 'center' }}>
                            <ImageZoom cropWidth={Dimensions.get('window').width}
                                cropHeight={Dimensions.get('window').height}
                                imageWidth={windowWidth * 1}
                                imageHeight={windowHeight * 1}>
                                <Image style={{
                                    height: windowHeight * 1,
                                    width: windowWidth * 1,
                                    resizeMode: "contain"
                                }} source={{ uri: this.state.ImageLink }} />
                            </ImageZoom>
                        </View>
                    </Modal>
                </View>



                <View>
                    <Modal
                        style={{ flex: 1 }}
                        animationType="slide"
                        transparent={true}
                        visible={this.state.requirement_modal}
                        onRequestClose={() => { this.setState({ requirement_modal: false }) }}>

                        <View style={{ padding: 5, justifyContent: "center", flex: 1, }}>

                            <View style={{ backgroundColor: "green", paddingVertical: 60, paddingHorizontal: 10 }}>


                                <TextInput
                                    style={{ backgroundColor: "#F2F2F2", paddingLeft: 10, marginTop: 8, color: "#000", borderRadius: 35 }}
                                    placeholder="Category"
                                    numberOfLines={3}
                                    editable={false}
                                    // onChangeText={text => this.setState({ title_state: text })}
                                    value={this.state.requirements}></TextInput>


                                <TextInput
                                    style={{ backgroundColor: "#fff", paddingLeft: 10, marginTop: 8, color: "#000", height: 60, borderRadius: 35 }}
                                    placeholder="Answer"
                                    onChangeText={text => this.setState({ requirements_ans: text })}
                                    value={this.state.requirements_ans}></TextInput>


                                <TouchableOpacity
                                    onPress={() => this.apply_gig()}
                                    style={{ backgroundColor: "#32a84e", alignSelf: "flex-end", width: 80, alignItems: "center", borderRadius: 35, marginTop: 15 }}>
                                    <Text style={{ fontSize: 13, padding: 8, color: "#fff", textAlign: "center" }}>Submit</Text>
                                </TouchableOpacity>

                            </View>





                        </View>



                    </Modal>
                </View>




            </View >
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
export default GigsDetails;
// export default withNavigation(GigsDetails);