import React, { useEffect, useState } from "react";
// screens
import MainNavigation from "./Main_Navigation";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";

// utils
const navigationRef = createNavigationContainerRef();

const Navigation = () => {
  return (
      <NavigationContainer ref={navigationRef} >
        <MainNavigation />
      </NavigationContainer>
  );
};

export default Navigation;