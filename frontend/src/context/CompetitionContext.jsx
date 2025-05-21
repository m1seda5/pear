import { createContext, useContext, useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

const CompetitionContext = createContext();

export const useCompetition = () => useContext(CompetitionContext);

export const CompetitionContextProvider = ({ children }) => {
  const [competitionActive, setCompetitionActive] = useState(true); // true = on, false = ended
  const [userInfo, setUserInfo] = useState(null); // { id, name, isAdmin, ... }
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState("wood");
  const [isAdmin, setIsAdmin] = useState(false);
  const { colorMode } = useColorMode();

  // Placeholder: fetch user info and competition state from API here
  useEffect(() => {
    // TODO: fetch user info, points, badge, admin status, and competition state
  }, []);

  const updatePoints = (delta) => setPoints((p) => p + delta);
  const updateBadge = (newBadge) => setBadge(newBadge);
  const endCompetition = () => setCompetitionActive(false);

  return (
    <CompetitionContext.Provider
      value={{
        competitionActive,
        userInfo,
        points,
        badge,
        isAdmin,
        colorMode,
        setUserInfo,
        updatePoints,
        updateBadge,
        endCompetition,
        setIsAdmin,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
}; 