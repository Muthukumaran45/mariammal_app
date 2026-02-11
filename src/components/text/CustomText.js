import React from "react";
import { Text } from "react-native";

// packages
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from "../../styles/Color";
import { Nunito_Regular } from "../../utils/FontFamily";


const CustomText = (
  { style,
    size = 1.8,
    children,
    fontWight = "",
    color = COLORS.textHeader,
    ML = 0,
    MR = 0,
    MT = 0,
    MB = 0,
    fontFamily = Nunito_Regular || ""
  }
) => {
  return (
    <Text style={[
      {
        fontSize: hp(size),
        fontWeight: fontWight,
        color: color,
        fontFamily: fontFamily,
        marginLeft: hp(ML),
        marginRight: hp(MR),
        marginTop: hp(MT),
        marginBottom: hp(MB),

      },
      style]}>
      {children}
    </Text>
  );
};

export default CustomText;
