import { Card, CardContent, Box } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { fadeIn, slideInLeft, scaleIn, hoverAnimations } from '../../utils/animations';

const AnimatedCard = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  hoverEffect = 'lift',
  sx = {},
  ...props
}) => {
  const { animationsEnabled } = useTheme();

  const getAnimation = () => {
    if (!animationsEnabled) return {};

    switch (animation) {
      case 'slideInLeft':
        return {
          animation: `${slideInLeft} 0.6s ease-out ${delay}ms both`,
        };
      case 'scaleIn':
        return {
          animation: `${scaleIn} 0.5s ease-out ${delay}ms both`,
        };
      case 'fadeIn':
      default:
        return {
          animation: `${fadeIn} 0.8s ease-out ${delay}ms both`,
        };
    }
  };

  const getHoverEffect = () => {
    if (!animationsEnabled) return {};

    return hoverAnimations[hoverEffect] || hoverAnimations.lift;
  };

  return (
    <Card
      sx={{
        ...getAnimation(),
        ...getHoverEffect(),
        ...sx,
      }}
      {...props}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;