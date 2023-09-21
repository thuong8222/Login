/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      inputText: '',
      list: [],
      task: '',
      currentTask: null
    };

  }
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
      await this.setState({ list: rs.data })
    }
  };
  Insert = async (model) => {
    console.log(model);
    let rq = await fetch('https://a070-14-162-214-142.ngrok-free.app/api/task/insert ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({TaskId:'',Note : this.state.task}),
      body: JSON.stringify(model),
    });
    let rs = await rq.json();
    if (rs.status === 'error') {
      Alert.alert('Error', rs.message);
      return;
    }
    if (rs.status === 'success') {
      Alert.alert('Success', 'Insert success');
      await this.setState({ list: rs.data })
    }
  };
  Update = async (model) => {
    let rq = await fetch('https://a070-14-162-214-142.ngrok-free.app/api/task/update ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });
    let rs = await rq.json();
    if (rs.status === 'error') {
      Alert.alert('Error', rs.message);
      return;
    }
    if (rs.status === 'success') {
      Alert.alert('Success', 'Update success');
      await this.setState({ list: rs.data })
    }
  };
  Delete = async (id) => {
    let rq = await fetch('https://a070-14-162-214-142.ngrok-free.app/api/task/delete?id=' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    let rs = await rq.json();
    if (rs.status === 'error') {
      Alert.alert('Error', rs.message);
      return;
    }
    if (rs.status === 'success') {
      Alert.alert('Success', 'Delete success');
      await this.setState({ list: rs.data })
    }
  };

  async componentDidMount() {
    this.GetList();
  };

  toggleModal = async () => {
    if (this.state.isModalVisible === true) {
      await this.setState({
        isModalVisible: false,
        task: '',
        currentTask: null
      });

    } else {
      await this.setState({
        isModalVisible: true,
      });
    }


  };

  handleInputChange = (text) => {
    this.setState({ inputText: text });
  };

  handleCreate = () => {
    const { inputText } = this.state;
    // Xử lý dữ liệu khi người dùng nhấn nút "Create"
    this.toggleModal(); // Đóng modal sau khi tạo xong
  };

Task_OnEditPress = async (data) => {
console.log('Task_OnEditPress ',data);
await this.setState({task : data.Note, currentTask : data});
this.toggleModal(); 
}

  render() {
    return (
      <SafeAreaView >

        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>
          <Text style={styles.title}> {"<<"}Click to Login Screen</Text>
        </TouchableOpacity>

        <View>

          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', }}>
              <Text style={styles.title}>Task List</Text>
              <TouchableOpacity>
                <Text style={styles.buttonP} onPress={this.toggleModal}> + </Text>
              </TouchableOpacity>
            </View>

            <FlatList

              ItemSeparatorComponent={<Text>b</Text>}
              data={this.state.list}
              keyExtractor={(item) => item.TaskId}
              renderItem={({ item }) => <TaskItem data={item} onEditPress={this.Task_OnEditPress} /> }

            //show Component when data empty
            // ListEmptyComponent={() => {
            //   return (
            //     <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>

            //       <Text style={{ fontSize: 20 }}>No data</Text>
            //     </View>
            //   )}}
            />
          </View>

          <Modal visible={this.state.isModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>

                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 24 }} onPress={this.toggleModal}>X</Text>
                </TouchableOpacity>

                <Text style={styles.title}> Update task</Text>
                <View>
                  <TextInput style={styles.input} value={this.state.task} onChangeText={async (text) => {
                    // console.log(text)
                    await this.setState({ task: text })
                  }} />
                  <TouchableOpacity style={styles.button} onPress={
                    async () => {
                      //lay gia tri hien tai cua task 
                      let model = {
                        TaskId: this.state.currentTask === null ? '' : this.state.currentTask.TaskId,
                        Note: this.state.task
                      };
                      console.log(model);
                      if (model.TaskId === '') { await this.Insert(model); }
                      else { await this.Update(model); }
                      await this.toggleModal();
                      this.GetList();
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
    );
  }
}

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
  }

  TaskITem_OnEdit_Press = async () => {
    this.props.onEditPress(this.props.data);
  }

  render() {
    return (
      <View>
        <Text>{this.props.data.Note}</Text>
        <TouchableOpacity onPress={this.TaskITem_OnEdit_Press}>
          <Text> Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text> Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    width: 200,
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
export default Home;
