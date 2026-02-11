import Toast from "react-native-toast-message";
import { Text, View, Dimensions } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// Get screen width
const SCREEN_WIDTH = Dimensions.get("window").width;

// ✅ Custom Toast UI using props.text2
const toastConfig = {
  success: ({ props }) => (
    <View
      style={{
        width: SCREEN_WIDTH * 0.9,
        padding: hp(2),
        backgroundColor: "#fff",
        borderRadius: hp(2),
        alignSelf: "center",
        elevation: 10,
      }}
    >
      <Text style={{ fontSize: 18, color: "#000" }}>
        {props.text2 || "Success!"}
      </Text>
    </View>
  ),

  error: ({ props }) => (
    <View
      style={{
        width: SCREEN_WIDTH * 0.9,
        padding: hp(2),
        backgroundColor: "#000",
        borderRadius: hp(2),
        alignSelf: "center",
        elevation: 10,
      }}
    >
      <Text style={{ fontSize: hp(2), color: "#fff" }}>
        {props.text2 || "Error occurred!"}
      </Text>
    </View>
  ),

  info: ({ props }) => (
    <View
      style={{
        width: SCREEN_WIDTH * 0.9,
        padding: hp(2),
        backgroundColor: "#17a2b8",
        borderRadius: hp(2),
        alignSelf: "center",
        elevation: 10,
      }}
    >
      <Text style={{ fontSize: 18, color: "#fff" }}>
        {props.text2 || "Info message!"}
      </Text>
    </View>
  ),
};

// ✅ Success Toast
const successAlert = ({ message }) => {
  Toast.show({
    type: "success",
    position: "top",
    props: { text2: message }, // ✅ Pass message as props.text2
  });
};

// ✅ Error Toast
const errorAlert = ({ message }) => {
  Toast.show({
    type: "error",
    position: "top",
    props: { text2: message },
  });
};

// ✅ Info Toast
const infoAlert = ({ message }) => {
  Toast.show({
    type: "info",
    position: "top",
    props: { text2: message },
  });
};

// ✅ Custom Toast Component (MUST be inside App.js root)
const CustomToast = () => <Toast config={toastConfig} />;

export { successAlert, errorAlert, infoAlert, CustomToast };
