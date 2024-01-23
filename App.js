//import liraries
import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// create a component
const MyComponent = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const saveTodos = async saveTodo => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.error('error:', error);
    }
  };
  const addTodo = () => {
    if (todo) {
      const updatedTodos = [...todos, {id: Date.now(), text: todo}];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    }
  };

  const deleteTodo = async id => {
    const updatedTodo = todos?.filter(x => x.id !== id);
    setTodos(updatedTodo);
    saveTodos(updatedTodo);
  };

  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem('todos');
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {}
  };

  /* const updateTodos = id => {
    const existingTodo = todos?.find(x => x.id === id);

    if (!existingTodo) {
      return;
    }
    Alert.prompt('Edit Todo', 'Update', newUpdateText => {
      if (newUpdateText) {
        const updatedTodos = todos.map(item =>
          item?.id === id ? {...item, text: newUpdateText} : item,
        );
        setTodos(updatedTodos);
        saveTodos(updatedTodos);
      }
    });
  }; */
  const updateTodos = id => {
    const existingTodo = todos?.find(x => x.id === id);

    if (!existingTodo) {
      return;
    }

    Alert.prompt(
      'Edit Todo',
      'Update',
      newUpdateText => {
        if (newUpdateText) {
          const updatedTodos = todos.map(item =>
            item?.id === id ? {...item, text: newUpdateText} : item,
          );
          setTodos(updatedTodos);
          saveTodos(updatedTodos);
        }
      },
      'plain-text',
      existingTodo.text,
    );
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>React Native AsyncStorage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type to Todo"
            value={todo}
            onChangeText={text => setTodo(text)}
          />
          <View style={styles.listItemText}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addTodo}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={todos}
          keyExtractor={item => item.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Text>{item?.text}</Text>
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => deleteTodo(item?.id)}>
                  <Text style={styles.textButton}>Delete </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={[styles.button, styles.updateButton]}>
                  <Text
                    style={styles.textButton}
                    onPress={() => updateTodos(item?.id)}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
  },
  listItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'red',

    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'blue',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
  },
  updateButton: {
    backgroundColor: 'green',
  },
});
export default MyComponent;
