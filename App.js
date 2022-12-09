import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, ImageBackground, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStateWithCallback from 'use-state-with-callback';
import { SwipeListView } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

export default function App () {
  const [todos, setTodos] = useStateWithCallback([], todos => console.log('todos', todos));
  const [newTodo, setNewTodo] = useState([])
  const [done, setDone] = useState()

  console.log(newTodo)
  // console.log(todos)
  const image = { uri: "https://i.pinimg.com/564x/43/80/ad/4380add2235f608d54368f7a8af5fb77.jpg" };

  const storeTodos = async () => {
    try {
      // we need to stringify our array into a string
      await AsyncStorage.setItem('todos', JSON.stringify(todos) );
    } catch (error) {
      // Error saving data
    }
  };

  const retrieveTodos = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if(value!==null){
      let bringBackToArray= JSON.parse(value)
      setTodos([...bringBackToArray])
      }
  // now we have data restored from asyncStorage parsed back into an array which we can use
  } catch (error) {
      // Error retrieving data
    }
  };

  useEffect(() => {
    retrieveTodos()
  }, []),

  useEffect(() => {
    storeTodos();
  }, [todos])

 const addTodo = (i) =>{
  console.log(i);
    if (!todos.includes(newTodo)) {
      // setIndex(index + 1)
      setTodos([...todos, {key: uuid.v4(), text: newTodo}])
      setNewTodo('')
      storeTodos(todos)
    } 
  };


  function pressDone(i) {
    // closeRow(rowMap, rowKey);
    if (!done) {
      setDone( {
      'id': i.key, 
      'style': {
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid'}})
    } else {
      setDone(null)
    }
    
    // const newData = [...todos];
    // const prevIndex = todos.findIndex(item => item.key === rowKey);
    // newData.splice(prevIndex, 1);
    // setTodos(newData);
    // <Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>(text)</Text>
  }

  // function showList() {
  //   // debugger 
  //   return todos && (todos.map((todo, i) => (
  //     <TouchableHighlight
  //       onPress={() => console.log('You touched me')}
  //       style={styles.rowFront}
  //       underlayColor={'#AAA'}
  //   >
  //       <View style={styles.card}>
  //       <Text key={i}>{todo.text}</Text>

  //       <Button
  //         onPress={() => removeTodo(i)}
  //         title="x"
  //         backgroundColor='#252525'
  //         color="#841584"
  //       />
  //     </View>
  //   </TouchableHighlight>     ) 
  //   ))
  // };

  const showList = data => (
    <TouchableHighlight
      onPress={() => console.log('You touched me')}
      style={styles.rowFront}
      underlayColor={'pink'}
  >
          <View style={styles.card}>
              <Text>{data.item.text}</Text>
              {/* insert here */}
              <Button
        onPress={() => pressDone(data.item.key)}
        title="x"
        backgroundColor='#252525'
        color="#841584"
      />
          </View>
      </TouchableHighlight>
  );

  const renderHiddenItem = (todos, rowMap) => (
    <View style={styles.rowBack}>
        {/* <Text>Left</Text> */}
        <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={() => closeRow(rowMap, todos.item.key)}
        >
            <Text style={styles.backTextWhite}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => deleteRow(rowMap, todos.item.key)}
        >
            <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
    </View>
);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
  //     console.log('row map', rowMap)
  // console.log('row key', rowKey)
        rowMap[rowKey].closeRow();
    }
};

const deleteRow = (rowMap, rowKey) => {
  // console.log('row map', rowMap)
  // console.log('row key', rowKey)
    closeRow(rowMap, rowKey);
    const newData = [...todos];
    const prevIndex = todos.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTodos(newData);
};
  // function removeTodo(i) {
  //   //debugger
  //   const temp = [...todos]
  //   temp.splice(i, 1)
  //   setTodos([...temp])
  // };

const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
};





  return <SafeAreaView style={styles.container}> 
  <View style={styles.container}>
  <ImageBackground source={image} style={styles.imageBackground}>

    <Text style={styles.heading}>To-do App</Text>
    
    <View style={styles.div}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setNewTodo(text)}
        value={newTodo}
        placeholder=" Your to-do activity"
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
    <ScrollView>
    <SwipeListView
                data={todos}
                renderItem={showList}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
        
        </ScrollView>
    </View>
    </ImageBackground>
  </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e9ac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignContent: 'stretch',
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  heading: {
    marginLeft: '18%',
    marginRight: 60,
    marginBottom: 40,
    marginTop: 20,
    fontSize: 40,
    fontWeight: '600',
    fontFamily: "Gill Sans", 
    color: '#FB2576',
    justifyContent: "space-between",
    alignItems: "center",
  },
  input:{
    // flex: 0.1,
    height: 50, //40px height to our input
    width:200, //100px width
    marginLeft: 10,
    backgroundColor: '#FAEAB1',
    borderColor: 'pink', //color of our border
    borderWidth: 2, //width of our border
    shadowColor: "pink",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
  }},
  div: {
    flex: 0.1,
    flexDirection: 'row',
    // backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 15, 
  },
  list: {
    flex: 0.9,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 10,
    // backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    // margin: 2,
    backgroundColor: 'pink',
    height: 60,
    width:230,
    borderColor: 'pink', //color of our border
    borderWidth: 1,
    borderRadius: 6,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    margin: 10,
},
rowBack: {
  alignItems: 'center',
  // backgroundColor: 'green',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  // paddingLeft: 15,
  height: 50,
  margin: 10,
  // borderBottomWidth: 1,
},
backRightBtn: {
  alignItems: 'center',
  bottom: 0,
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  width: 75,
},
backRightBtnLeft: {
  backgroundColor: '#FAEAB1',
  right: 75,
},
backRightBtnRight: {
  backgroundColor: '#FAEAB1',
  right: 0,
},

});
