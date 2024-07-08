import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  Portal,
  Provider,
  Searchbar,
  Text,
} from "react-native-paper";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";

import axios from "axios";

const apiKey = "41dc6af5cda04fcfbef2bf695cc48394";

const Details = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [recipeSteps, setRecipeSteps] = useState([]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const searchFoods = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchQuery}&number=10`
      );
      setSearchResults(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (foodId) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${foodId}/analyzedInstructions?apiKey=${apiKey}`
      );
      if (response.data.length > 0) {
        // Get steps if available
        setRecipeSteps(response.data[0].steps.map((step) => step.step));
      } else {
        setRecipeSteps(["Recipe details not found."]);
      }
    } catch (error) {
      console.error(error);
      setRecipeSteps(["Recipe details not found."]);
    }
  };

  const showModal = async (food) => {
    setSelectedFood(food);
    setVisible(true);
    await fetchRecipeDetails(food.id);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedFood(null);
    setRecipeSteps([]);
  };

  const renderFoodItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Button mode="contained" onPress={() => showModal(item)}>
          View Recipe
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search for foods..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          onSubmitEditing={searchFoods}
          style={styles.searchbar}
        />
        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}>
          <ScrollView>
            {selectedFood && (
              <>
                <Text style={styles.modalTitle}>{selectedFood.title}</Text>
                <Image
                  source={{ uri: selectedFood.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.recipeTitle}>Recipe Steps:</Text>
                {recipeSteps.length > 0 ? (
                  recipeSteps.map((step, index) => (
                    <Text key={index} style={styles.recipeStep}>{`${
                      index + 1
                    }. ${step}`}</Text>
                  ))
                ) : (
                  <Text>No recipe steps found.</Text>
                )}
                <Button mode="contained" onPress={hideModal}>
                  Close
                </Button>
              </>
            )}
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchbar: {
    marginBottom: 10,
    marginTop: 50,
  },
  card: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  recipeStep: {
    marginVertical: 5,
  },
});

export default Details;
