import React, {useState, useEffect, useStateWithCallback} from 'react'
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App () {
  const [todos, setTodos] = useStateWithCallback(JSON.parse(AsyncStorage.getItem('todos')) || [], todos => {console.log(todos);});
  // const todos = ['abc', 'def']
  const [newTodo, setNewTodo] = useState('')
  console.log(newTodo)
  // console.log(todos)

  const storeTodos = async () => {
    try {
      // we need to stringify our array into a string
      await AsyncStorage.setItem('todos', JSON.stringify(todos) );
    } catch (error) {
      // Error saving data
    }
  };

  useEffect(() => {
    storeTodos();
  }, [todos]),

  function addTodo() {
    if (!todos.includes(newTodo)) {
      setTodos([...todos, newTodo])
      setNewTodo('')
      _storeData(todos)
    } 
  };

  function removeTodo(i) {
    //debugger
    const temp = [...todos]
    temp.splice(i, 1)
    setTodos([...temp])
  };

  function showList() {
    // debugger 
    return todos.map((todo, i) => (
      <View style={styles.wrapper}>
      <Text key={i}>{todo}</Text>

      <Button
          onPress={() => removeTodo(i)}
          title="x"
          backgroundColor='#252525'
          color="#841584"
        />
    </View>

    ))
  };

  return <SafeAreaView style={styles.container}> 
  <View style={styles.container}>
    <Text style={styles.heading}>Your To-do App</Text>
    
    <View style={styles.div}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setNewTodo(text)}
        value={newTodo}
        placeholder="Your to-do"
      />
      <View>
        <Button
            onPress={addTodo}
            title="+"
            backgroundColor='#252525'
            color="#841584"
          />
      </View>
    </View>

    <View  style={styles.list}>
        {showList()}
    </View>
  </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    // margin: 30,
    fontSize: 30,
  },
  input:{
    // flex: 0.1,
      height: 40, //40px height to our input
    width:200, //100px width
    borderColor: 'pink', //color of our border
    borderWidth: 1 //width of our border
  },
  div: {
    flex: 0.1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 0.9,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    margin: 2,
    backgroundColor: 'pink',
    height: 50,
    width:200,
    borderColor: 'pink', //color of our border
    borderWidth: 1,
    borderRadius: 6,
  }
});
