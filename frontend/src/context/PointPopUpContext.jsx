import { createContext, useContext, useState, useCallback } from "react";
import PointPopUp from "../components/PointPopUp";
import { useColorMode } from "@chakra-ui/react";

const PointPopUpContext = createContext();

export const usePointPopUp = () => useContext(PointPopUpContext);

export const PointPopUpProvider = ({ children }) => {
  const [popUp, setPopUp] = useState(null); // { points, mode }
  const { colorMode } = useColorMode();

  const triggerPopUp = useCallback((points, mode = colorMode) => {
    setPopUp({ points, mode });
  }, [colorMode]);

  const handleDone = () => setPopUp(null);

  return (
    <PointPopUpContext.Provider value={triggerPopUp}>
      {children}
      {popUp && (
        <PointPopUp
          points={popUp.points}
          mode={popUp.mode}
          position={{ top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}
          onDone={handleDone}
        />
      )}
    </PointPopUpContext.Provider>
  );
};

export { PointPopUpContext }; 