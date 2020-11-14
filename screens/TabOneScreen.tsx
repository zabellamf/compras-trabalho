import AsyncStorage from "@react-native-community/async-storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Button, ScrollView } from "react-native";
import { Text, View } from "../components/Themed";
import { TextInput } from "react-native";

type Item = {
  done: boolean;
  description: string;
};

type List = {
  id: number;
  active: boolean;
  done: boolean;
  items: Item[];
};

type Lists = {
  data: List[];
};

export default function TabOneScreen() {
  const [lists, setLists] = useState<Lists>();
  const [activeList, setActiveList] = useState<List>();
  const [loading, setLoading] = useState(true);
  const [term, onChangeText] = React.useState("");

  useEffect(() => {
    const _getLists = async () => {
      try {
        const value = await AsyncStorage.getItem("LISTS");
        if (value !== null) {
          // We have data!!
          const storage: Lists = JSON.parse(value);
          setLists(storage);
          setActiveList(storage.data.find((i) => i.active));
        }
      } catch (error) {
        // Error retrieving data
      } finally {
        setLoading(false);
      }
    };

    _getLists();
  }, []);

  const _createNewList = async () => {
    const list: List = {
      id: lists ? lists.data.length++ : 1,
      active: true,
      done: false,
      items: [],
    };

    const data = lists ? [...lists.data, list] : [list];
    setLists({ data });
    setActiveList(list);
    await AsyncStorage.setItem("LISTS", JSON.stringify({ data }));
  };

  const _createItem = async () => {
    if (!activeList || !lists) return;
    if (!term) return;

    const active = {
      ...activeList,
      items: [...activeList.items, { done: false, description: term }],
    };
    const newLists = lists?.data.map((x) => {
      if (x.id == active.id) {
        return active;
      }
      return x;
    });

    setActiveList(active);
    setLists({ data: newLists });
    await AsyncStorage.setItem("LISTS", JSON.stringify({ data: newLists }));
    onChangeText("");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando a lista...</Text>
      </View>
    );
  }

  if (lists && activeList?.id) {
    return (
      <View style={styles.containerItems}>
        <View style={styles.containerNew}>
          <TextInput
            style={styles.newInput}
            onChangeText={(text) => onChangeText(text)}
            value={term}
          />
          <View style={styles.newButton}>
            <Button
              onPress={_createItem}
              title="Add Item"
              color="#b077c6"
              accessibilityLabel="Criar uma nova lista de compra"
            />
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          {activeList.items.map((item) => (
            <Text>
              {item.description} - {item.done ? "concluido" : "falta"}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Não encontramos uma lista de compra ativa.</Text>
      <Text>Gostaria de adicionar uma nova?</Text>
      <View style={styles.button}>
        <Button
          onPress={_createNewList}
          title="Criar"
          color="#b077c6"
          accessibilityLabel="Criar uma nova lista de compra"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 20,
  },
  containerNew: {
    flexDirection: "row",
  },
  newInput: {
    height: 32,
    borderColor: "#4ca286",
    borderWidth: 1,
    flex: 3,
  },
  newButton: {
    flex: 1,
  },
  containerItems: {
    flex: 1,
    padding: "5%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    padding: "20%",
  },
});
