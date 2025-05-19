import { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tenLight from "../assets/images/10(light).png";
import tenDark from "../assets/images/10(dark).png";
import twentyLight from "../assets/images/20(light).png";
import twentyDark from "../assets/images/20(dark).png";
import twentyfiveLight from "../assets/images/25(light).png";
import twentyfiveDark from "../assets/images/25(dark).png";
import fiftyLight from "../assets/images/50(light).png";
import fiftyDark from "../assets/images/50(dark).png";
import seventyfiveLight from "../assets/images/75(light).png";
import seventyfiveDark from "../assets/images/75(dark).png";
import hundredLight from "../assets/images/100(light).png";
import hundredDark from "../assets/images/100(dark).png";
import twofiftyLight from "../assets/images/250(light).png";
import twofiftyDark from "../assets/images/250(dark).png";
import { CompetitionContext } from "../context/CompetitionContext";

const pngMap = {
  10: { light: tenLight, dark: tenDark },
  20: { light: twentyLight, dark: twentyDark },
  25: { light: twentyfiveLight, dark: twentyfiveDark },
  50: { light: fiftyLight, dark: fiftyDark },
  75: { light: seventyfiveLight, dark: seventyfiveDark },
  100: { light: hundredLight, dark: hundredDark },
  250: { light: twofiftyLight, dark: twofiftyDark },
};

const allowed = [10, 20, 25, 50, 75, 100, 250];

const getPointsPng = (points, mode) => {
  const closest = allowed.reduce((a, b) => Math.abs(b - points) < Math.abs(a - points) ? b : a);
  return pngMap[closest][mode] || pngMap[25][mode];
};

const PointPopUp = ({ points, mode = "light", position = { top: 0, left: 0 }, onDone }) => {
  const { competitionActive, updatePoints } = useContext(CompetitionContext) || { competitionActive: true, points: 0, updatePoints: () => {} };

  useEffect(() => {
    if (!competitionActive) return;
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => updatePoints(data.points || 0))
      .catch(() => updatePoints(0));
  }, [competitionActive, updatePoints]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.img
        src={getPointsPng(points, mode)}
        alt={`+${points} points`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex: 9999,
          pointerEvents: "none",
          width: 80,
          height: 80,
        }}
      />
    </AnimatePresence>
  );
};

export default PointPopUp; 