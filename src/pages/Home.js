import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  Portal,
  Provider,
  Text,
} from "react-native-paper";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import axios from "axios";

const apiKey = "41dc6af5cda04fcfbef2bf695cc48394";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState("");
  const [recipeSteps, setRecipeSteps] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10`
      );
      setFoods(response.data.results);
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
        // Combine steps into a single paragraph
        const steps = response.data[0].steps
          .map((step) => step.step)
          .join("\n");
        setRecipeDetails(steps);
        setRecipeSteps(response.data[0].steps.map((step) => step.step));
      } else {
        setRecipeDetails("Recipe details not found.");
        setRecipeSteps(["Recipe details not found."]);
      }
    } catch (error) {
      console.error(error);
      setRecipeDetails("Recipe details not found.");
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
    setRecipeDetails("");
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
        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <FlatList
            data={foods}
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
    justifyContent: "center",
    padding: 10,
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
  recipeDetails: {
    marginTop: 5,
    marginVertical: 20,
  },
  recipeStep: {
    marginVertical: 5,
  },
});

export default Home;
