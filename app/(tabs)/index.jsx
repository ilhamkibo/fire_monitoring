import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Button,
} from "react-native";
import Paho from "paho-mqtt";
import TimeContainer from "../../components/TimeContainer";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const TabTwoScreen = () => {
  const [data, setData] = useState({
    asapValue: 30,
    suhuValue: 10,
    apiValue: 30,
    asap: "Normal",
    suhu: "Tipis",
    output: "Normal",
    api: "Lemah",
  });

  const getFuzzyFire = (fire) => {
    if (fire < 30) {
      return "Lemah";
    } else if (fire >= 30 && fire <= 70) {
      createTwoButtonAlert("SIAGA! Api Sedang", `Api mencapai: ${fire}`);
      return "Sedang";
    } else {
      createTwoButtonAlert("BAHAYA! Api Kuat", `Api mencapai: ${fire}`);
      return "Kuat";
    }
  };

  const getFuzzyAsap = (asapValue) => {
    if (asapValue < 30) {
      return "Tipis";
    } else if (asapValue >= 30 && asapValue <= 70) {
      createTwoButtonAlert(
        "SIAGA! Asap Sedang",
        `Kepekatan asap mencapai: ${asapValue}`
      );
      return "Sedang";
    } else {
      createTwoButtonAlert(
        "BAHAYA! Asap Pekat",
        `Kepekatan mencapai: ${asapValue}`
      );
      return "Pekat";
    }
  };

  const getFuzzySuhu = (temp) => {
    if (temp < 30) {
      return "Normal";
    } else if (temp >= 30 && temp <= 70) {
      createTwoButtonAlert("SIAGA! Suhu Sedang", `Suhu mencapai: ${temp}`);
      return "Hangat";
    } else {
      createTwoButtonAlert("BAHAYA! Suhu Tinggi", `Suhu mencapai: ${temp}`);
      return "Panas";
    }
  };

  useEffect(() => {
    // Create a client only if it does not already exist
    const client = new Paho.Client("broker.emqx.io", Number(8083), "bjirr");

    client.onMessageArrived = function (message) {
      // Parse the incoming message payload
      const payload = JSON.parse(message.payloadString);

      // Update the state with the new data
      setData((prevData) => ({
        ...prevData, // Preserve the previous state
        apiValue: payload.api,
        suhuValue: Number(payload.suhu).toFixed(2),
        asapValue: payload.asap,
        api: getFuzzyFire(Number(payload.api)),
        suhu: getFuzzySuhu(Number(payload.suhu)),
        asap: getFuzzyAsap(Number(payload.asap)),
        output: payload.status,
      }));
    };

    client.connect({
      onSuccess: function () {
        client.subscribe("fire-alarm");
        console.log("connected");
      },
    });
  }, []);

  const testImageUrl = "https://via.placeholder.com/150"; // Use this URL to test

  const createTwoButtonAlert = (title, subtitle) =>
    Alert.alert(title, subtitle, [
      // {
      //   text: "Cancel",
      //   onPress: () => console.log("Cancel Pressed"),
      //   style: "cancel",
      // },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  return (
    <ScrollView style={styles.container}>
      <TimeContainer />
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                gap: 5,
              }}
            >
              <TabBarIcon size={20} name={"cloud"} color={"#0a4d8f"} />
              <Text style={styles.cardTitle}>Asap</Text>
            </View>
            <Text style={styles.cardContent}>{data.asapValue}</Text>
            <Text style={styles.cardContent}>{data.asap}</Text>
          </View>
          <View style={styles.card}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                gap: 5,
              }}
            >
              <TabBarIcon size={20} name={"thermometer"} color={"#0a4d8f"} />
              <Text style={styles.cardTitle}>Suhu</Text>
            </View>
            <Text style={styles.cardContent}>{data.suhuValue}</Text>
            <Text style={styles.cardContent}>{data.suhu}</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                gap: 5,
              }}
            >
              <TabBarIcon size={20} name={"bonfire"} color={"#0a4d8f"} />
              <Text style={styles.cardTitle}>Api</Text>
            </View>
            <Text style={styles.cardContent}>{data.apiValue}</Text>
            <Text style={styles.cardContent}>{data.api}</Text>
          </View>
          <View style={styles.card}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                gap: 5,
              }}
            >
              <TabBarIcon
                size={20}
                name={"checkmark-circle"}
                color={"#0a4d8f"}
              />
              <Text style={styles.cardTitle}>Output</Text>
            </View>
            <Text style={[styles.cardContent, { marginTop: 10 }]}>
              {data.output}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.wleo}>
        <Image
          source={require("../../assets/images/fkom.png")}
          style={{
            width: 200,
            height: 100,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wleo: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#18192b", // Ganti warna background di sini
  },
  headerImage: {
    color: "#000",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#1f2033",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0a4d8f",
  },
  cardContent: {
    fontSize: 16,
    textAlign: "center",
    color: "#616177",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
});

export default TabTwoScreen;
