import { createContext, useContext, useState, useEffect } from "react";
import { useColorMode, useToast } from "@chakra-ui/react";

const CompetitionContext = createContext();

export const useCompetition = () => useContext(CompetitionContext);

export const CompetitionContextProvider = ({ children }) => {
  const [competitionActive, setCompetitionActive] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState("wood");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWidgets, setShowWidgets] = useState(true);
  const [competitionEnded, setCompetitionEnded] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();

  // SDK hooks
  const [pointsChangeHooks, setPointsChangeHooks] = useState([]);
  const [badgeUpgradedHooks, setBadgeUpgradedHooks] = useState([]);
  const [competitionEndHooks, setCompetitionEndHooks] = useState([]);

  const registerOnPointsChange = (cb) => setPointsChangeHooks(hooks => [...hooks, cb]);
  const registerOnBadgeUpgraded = (cb) => setBadgeUpgradedHooks(hooks => [...hooks, cb]);
  const registerOnCompetitionEnd = (cb) => setCompetitionEndHooks(hooks => [...hooks, cb]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserInfo(data);
        setPoints(data.points || 0);
        setBadge(data.lastBadge || 'wood');
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserInfo(null);
        setPoints(0);
        setBadge('wood');
        setIsAdmin(false);
      }
    };

    const fetchCompetitionState = async () => {
      try {
        const response = await fetch('/api/competition/state', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch competition state');
        const data = await response.json();
        setCompetitionActive(data.active);
        setShowWidgets(data.active);
        setCompetitionEnded(data.ended);
      } catch (error) {
        console.error('Error fetching competition state:', error);
        setCompetitionActive(true);
        setShowWidgets(true);
        setCompetitionEnded(false);
      }
    };

    // Reconnect sync: fetch latest user info and points
    useEffect(() => {
      const handleReconnect = () => {
        fetchUserData();
        // Optionally, fetch audit log and reconcile if needed
      };
      window.addEventListener('online', handleReconnect);
      return () => {
        window.removeEventListener('online', handleReconnect);
      };
    }, []);

    fetchUserData();
    fetchCompetitionState();
  }, []);

  // Call hooks when points change
  const updatePoints = (delta) => {
    if (!competitionActive || competitionEnded) return;
    setPoints((p) => {
      const newTotal = p + delta;
      pointsChangeHooks.forEach(cb => cb(newTotal));
      return newTotal;
    });
  };

  // Call hooks when badge upgrades
  const updateBadge = (newBadge) => {
    if (!competitionActive || competitionEnded) return;
    setBadge((oldBadge) => {
      if (oldBadge !== newBadge) {
        badgeUpgradedHooks.forEach(cb => cb(oldBadge, newBadge));
      }
      return newBadge;
    });
  };

  // Call hooks when competition ends
  useEffect(() => {
    if (competitionEnded) {
      competitionEndHooks.forEach(cb => cb(userInfo?._id));
    }
    // eslint-disable-next-line
  }, [competitionEnded]);

  useEffect(() => {
    if (!competitionActive || !userInfo || !userInfo.streak) return;
    if (userInfo.streak % 4 === 0 && userInfo.streak !== 0) {
      // Calculate next tier
      const badgeThresholds = {
        wood: 0,
        bronze: 300,
        silver: 700,
        gold: 1300,
        ruby: 2000,
        emerald: 3000,
        sapphire: 4000,
        champion: 5000
      };
      const currentPoints = userInfo.points || 0;
      let nextTier = "champion";
      let nextThreshold = 5000;
      for (const [tier, threshold] of Object.entries(badgeThresholds)) {
        if (currentPoints < threshold) {
          nextTier = tier;
          nextThreshold = threshold;
          break;
        }
      }
      const gap = nextThreshold - currentPoints;
      toast({
        title: `⚡ You're one step closer to ${nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}!`,
        description: `${gap} pts to ${nextTier}. Keep it up!`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [competitionActive, userInfo?.streak]);

  const endCompetition = async () => {
    try {
      const response = await fetch('/api/competition/end', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to end competition');
      setCompetitionActive(false);
      setShowWidgets(false);
      setCompetitionEnded(true);
    } catch (error) {
      console.error('Error ending competition:', error);
    }
  };

  const resetCompetition = async () => {
    try {
      const response = await fetch('/api/competition/reset', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to reset competition');
      setCompetitionActive(true);
      setShowWidgets(true);
      setCompetitionEnded(false);
      setPoints(0);
      setBadge('wood');
    } catch (error) {
      console.error('Error resetting competition:', error);
    }
  };

  return (
    <CompetitionContext.Provider
      value={{
        competitionActive,
        userInfo,
        points,
        badge,
        isAdmin,
        colorMode,
        showWidgets,
        competitionEnded,
        setUserInfo,
        updatePoints,
        updateBadge,
        endCompetition,
        resetCompetition,
        setIsAdmin,
        // SDK hooks
        registerOnPointsChange,
        registerOnBadgeUpgraded,
        registerOnCompetitionEnd,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export { CompetitionContext }; 