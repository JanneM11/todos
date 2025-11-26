import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';


interface Item {
  id: string
  name: string
  done: boolean
}

const STORAGE_KEY = 'TODO_LIST_ITEMS'

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [input, setInput] = useState('')
  

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY)
        if (json) setItems(JSON.parse(json))
      } catch (e){
    }
    })() 
  }, [])

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])
  
  

  const addItem = () => {
    if (input.trim()) {
      setItems(prev => [
        ...prev,
        { id: Date.now().toString(), name: input.trim(), done: false },
      ])
      setInput('')
    }
  }

  const toggleDone = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: !item.done} : item
      )
    )

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo list</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder='Enter task'
        />
        <Button title='Save' onPress={addItem} />
      </View>
      <SwipeListView
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowFront}>
            <Pressable onPress={() => toggleDone(item.id)}>
              <Text
                style={{textDecorationLine: item.done ? 'line-through' : 'none'}}
              >
                {item.name}
              </Text>
            </Pressable>
          </View>
        )}
        disableRightSwipe
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight:8,
  },
  rowFront: {
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 16
  },
  rowBack: {
    backgroundColor: '#ddd',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  }
});
