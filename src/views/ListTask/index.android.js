import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Modal,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const ListTask = (props) => {
    const navigation = useNavigation();
    const [currentTask, setCurrentTask] = useState(null);
    const [messageError, setMessageError] = useState('');
    const [count, setCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [list, setList] = useState([]);
    const [task, setTask] = useState('');

    GetList = async () => {
        let rq = await fetch('https://a070-14-162-214-142.ngrok-free.app/api/task/getlisttask ', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let rs = await rq.json();
        if (rs.status === 'error') {
            Alert.alert('Error', rs.message);
            return;
        }
        if (rs.status === 'success') {
            setList(rs.data)
        }
    };

    useEffect(() => {
        GetList();
    }, []);

    const GoToLogin = () => {
        navigation.navigate('Login');
    }

    const TaskList_keyExtractor = (item, index) => {
        return item.TaskId;
    }
    const Task_OnEditPress = (data) => {
        setCurrentTask(data);
        setTask(data.Note);
        OpenModal();
     }
    const TaskList_renderItem = ({ item }) => {
        return (<TaskItem data={item} onEditPress={Task_OnEditPress} />);
    }

    const CloseModal = () => {

        setIsModalVisible(false);
        setTask('');
        setCurrentTask(null);
    }
    const OpenModal = () => {
        setIsModalVisible(true);
    }


    return (
        <SafeAreaView >

            <TouchableOpacity onPress={GoToLogin}>
                <Text > {"<<"}Click to Login Screen</Text>
            </TouchableOpacity>

            <View>

                <View style={{ padding: 15 }}>
                    <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', }}>
                        <Text style={styles.title}>Task List</Text>
                        <TouchableOpacity>
                            <Text style={styles.buttonP} onPress={OpenModal}> + </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList

                        ItemSeparatorComponent={<View style={{borderBottomColor:'#c3c3c3',borderBottomWidth:.5}}></View>}
                        data={list}
                        keyExtractor={TaskList_keyExtractor}
                        renderItem={TaskList_renderItem}

                    //show Component when data empty
                    // ListEmptyComponent={() => {
                    //   return (
                    //     <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>

                    //       <Text style={{ fontSize: 20 }}>No data</Text>
                    //     </View>
                    //   )}}
                    />
                </View>

                <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>

                            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 24 }} onPress={CloseModal}>X</Text>
                            </TouchableOpacity>

                            <Text style={styles.title}> Update task</Text>
                            <View>
                                <TextInput style={styles.input} value={task} onChangeText={ (text) => {
                                    // console.log(text)
                                  setTask(text);
                                }} />
                                <TouchableOpacity style={styles.button} onPress={
                                    async () => {
                                        //lay gia tri hien tai cua task 
                                        let model = {
                                            TaskId: currentTask === null ? '' : currentTask.TaskId,
                                            Note: task
                                        };
                                        console.log(model);
                                        if (model.TaskId === '') { await Insert(model); }
                                        else { await Update(model); }
                                        CloseModal();
                                        GetList();
                                    }

                                }>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    )
}

const TaskItem = (props) => {
    const TaskITem_OnEdit_Press = () => {
        props.onEditPress(props.data);
    }
    return (
        <View style={{ flexDirection: 'row',alignItems:'center' }}>
            <Text style={{ flex: 1 }}>{props.data.Note}</Text>
            <TouchableOpacity style={[styles.btn, styles.btn_edit]} onPress={TaskITem_OnEdit_Press}>
                <Text style={[styles.btn_text]}> Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btn_delete]}>
                <Text style={[styles.btn_text]}> Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ListTask;

const styles = StyleSheet.create({

    btn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
    btn_edit: { backgroundColor: 'orange' },
    btn_delete: { backgroundColor: 'red' },
    btn_text: { color: 'white' },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        borderColor: 'gray', borderWidth: 1, width: 300, height: 40, fontSize: 20,
    },
    buttonP: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        textAlign: 'right',
        marginRight: 20,
    },
    button: {
        width: 50,
        height: 40,
        borderWidth: 1,
        borderColor: '#FFA500',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 5, // Border radius
        backgroundColor: '#CD853F',
        color: 'black'
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',

        textAlignVertical: 'center',

    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },

});