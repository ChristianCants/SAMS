import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedCounter({ 
  value, 
  duration = 1,
  prefix = "",
  suffix = ""
}: { 
  value: number, 
  duration?: number,
  prefix?: string,
  suffix?: string
}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => {
    // Determine precision based on if value has decimals
    const precision = value % 1 !== 0 ? 1 : 0;
    return `${prefix}${current.toFixed(precision)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
    setHasAnimated(true);
  }, [spring, value]);

  return (
    <motion.span>
      {hasAnimated ? display : `${prefix}0${suffix}`}
    </motion.span>
  );
}
