import { keyframes } from '@mui/material/styles';

// Modern animation keyframes
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Animation timing functions
export const easing = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

// Animation duration presets
export const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
};

// Stagger animation utility
export const createStaggeredAnimation = (baseDelay = 100, stagger = 50) => {
  return (index) => ({
    animationDelay: `${baseDelay + (index * stagger)}ms`,
  });
};

// Hover animation utilities
export const hoverAnimations = {
  lift: {
    transition: `all ${duration.standard}ms ${easing.easeInOut}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
  },
  glow: {
    transition: `all ${duration.standard}ms ${easing.easeInOut}`,
    '&:hover': {
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
    },
  },
  scale: {
    transition: `all ${duration.standard}ms ${easing.easeInOut}`,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  rotate: {
    transition: `all ${duration.standard}ms ${easing.easeInOut}`,
    '&:hover': {
      transform: 'rotate(2deg)',
    },
  },
};

// Loading animation
export const loadingDots = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Page transition animations
export const pageTransitions = {
  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: easing.easeInOut },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.3, ease: easing.easeInOut },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: easing.easeInOut },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: easing.easeInOut },
  },
};

// Notification animations
export const notificationAnimations = {
  slideInFromTop: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.3, ease: easing.easeOut },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: {
      duration: 0.5,
      ease: [0.68, -0.55, 0.265, 1.55]
    },
  },
};

// Utility function to create custom animations
export const createAnimation = (keyframes, options = {}) => {
  const {
    duration: animDuration = duration.standard,
    easing: animEasing = easing.easeInOut,
    delay = 0,
    iterations = 1,
    direction = 'normal',
    fillMode = 'forwards',
  } = options;

  return {
    animation: `${keyframes} ${animDuration}ms ${animEasing} ${delay}ms ${iterations} ${direction} ${fillMode}`,
  };
};

// Performance-optimized animation variants
export const performanceMode = {
  reducedMotion: {
    '*': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
    },
  },
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
};