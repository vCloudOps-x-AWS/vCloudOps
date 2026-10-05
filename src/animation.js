export const orbitalCarouselVariants = {
  animate: {
    rotate: [0, -360],
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 40,
    },
  }
}

export const orbitalItemVariants = {
  animate: {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 40,
    },
  }
}

export const planetPulseVariants = {
  initial: { scale: 0.95, opacity: 0.8 },
  animate: {
    scale: [0.95, 1.05, 0.95],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut",
    }
  }
}

export const ringRotateVariants = {
  animate: {
    rotateX: [75, 75],
    rotateZ: [0, 360],
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 30,
    }
  }
}

export const calculateOrbitalPositions = (totalItems, radius, centerX = 0, centerY = 0) => {
  const positions = [];
  const angleStep = (Math.PI * 2) / totalItems;

  for (let i = 0; i < totalItems; i++) {
    const angle = i * angleStep;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle: angle,
    });
  }
  return positions;
}
