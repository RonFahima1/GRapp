import { I18nManager, TextStyle, ViewStyle, ImageStyle, FlexStyle, StyleProp } from 'react-native';

// Type for styles that can be transformed for RTL
type RTLTransformableStyle = ViewStyle | TextStyle | ImageStyle;
type StylesObject = Record<string, RTLTransformableStyle>;

/**
 * Creates RTL-aware styles by flipping certain properties based on the current RTL state
 * @param styles The original styles object
 * @returns A new styles object with RTL-aware properties that can be used with StyleSheet
 */
export function createRTLAwareStyles<T extends StylesObject>(
  styles: T
): T {
  const isRTL = I18nManager.isRTL;
  const result = { ...styles } as T;

  // Process each style object
  Object.keys(styles).forEach((key) => {
    const styleKey = key as keyof T;
    const style = styles[styleKey];
    // Create a copy of the style with the same type as the original
    const newStyle = { ...style } as typeof style;

    // Transform margin and padding properties
    if ('marginLeft' in style || 'marginRight' in style) {
      if ('marginLeft' in style) {
        newStyle.marginLeft = isRTL ? style.marginRight : style.marginLeft;
      }
      if ('marginRight' in style) {
        newStyle.marginRight = isRTL ? style.marginLeft : style.marginRight;
      }
    }

    if ('paddingLeft' in style || 'paddingRight' in style) {
      if ('paddingLeft' in style) {
        newStyle.paddingLeft = isRTL ? style.paddingRight : style.paddingLeft;
      }
      if ('paddingRight' in style) {
        newStyle.paddingRight = isRTL ? style.paddingLeft : style.paddingRight;
      }
    }

    // Transform text alignment
    if ('textAlign' in style) {
      const textStyle = style as TextStyle;
      if (textStyle.textAlign === 'left') {
        (newStyle as TextStyle).textAlign = isRTL ? 'right' : 'left';
      } else if (textStyle.textAlign === 'right') {
        (newStyle as TextStyle).textAlign = isRTL ? 'left' : 'right';
      }
    }

    // Transform flexDirection
    if ('flexDirection' in style) {
      const flexStyle = style as FlexStyle;
      if (flexStyle.flexDirection === 'row') {
        (newStyle as FlexStyle).flexDirection = isRTL ? 'row-reverse' : 'row';
      } else if (flexStyle.flexDirection === 'row-reverse') {
        (newStyle as FlexStyle).flexDirection = isRTL ? 'row' : 'row-reverse';
      }
    }

    // Transform position properties
    if ('left' in style || 'right' in style) {
      if ('left' in style) {
        newStyle.left = isRTL ? style.right : style.left;
      }
      if ('right' in style) {
        newStyle.right = isRTL ? style.left : style.right;
      }
    }

    // Apply transforms for RTL if needed
    if ('transform' in style && Array.isArray(style.transform)) {
      const transforms = [...style.transform];
      const newTransforms = transforms.map(transform => {
        if ('scaleX' in transform) {
          // Flip scaleX for RTL
          return isRTL ? { scaleX: -transform.scaleX } : transform;
        }
        if ('rotate' in transform) {
          // Adjust rotation for RTL if needed
          const rotation = transform.rotate;
          if (typeof rotation === 'string' && (rotation.includes('deg') || rotation.includes('rad'))) {
            // Handle rotation transformations if needed
            // This is a placeholder for more complex rotation handling
          }
        }
        return transform;
      });
      newStyle.transform = newTransforms;
    }

    result[styleKey] = newStyle as T[keyof T];
  });

  return result as T;
}

/**
 * Helper function to get the correct icon rotation for RTL
 * @param defaultRotation The default rotation value
 * @returns The RTL-aware rotation value
 */
export function getRTLIconRotation(defaultRotation: number): number {
  return I18nManager.isRTL ? -defaultRotation : defaultRotation;
}

/**
 * Helper function to get the correct chevron transform for RTL
 * @returns The transform array for a chevron icon
 */
export function getChevronTransform(): { transform: { scaleX: number }[] } {
  return {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }]
  };
}

/**
 * Helper function to get the correct position for an element in RTL layout
 * @param defaultPosition The default position object with left/right properties
 * @returns The RTL-aware position object
 */
export function getRTLPosition(defaultPosition: { left?: number, right?: number }): { left?: number, right?: number } {
  if (I18nManager.isRTL) {
    const { left, right } = defaultPosition;
    return {
      left: right,
      right: left
    };
  }
  return defaultPosition;
}

/**
 * Helper function to get the correct icon position for RTL layout
 * @param defaultSide The default side ('left' or 'right')
 * @returns The RTL-aware side
 */
export function getRTLIconPosition(defaultSide: 'left' | 'right'): 'left' | 'right' {
  if (defaultSide === 'left') {
    return I18nManager.isRTL ? 'right' : 'left';
  }
  return I18nManager.isRTL ? 'left' : 'right';
}

/**
 * Helper function to get the correct flexDirection for RTL
 * @param defaultDirection The default direction ('row' or 'column')
 * @returns The RTL-aware flexDirection
 */
export function getRTLFlexDirection(defaultDirection: 'row' | 'column' = 'row'): 'row' | 'row-reverse' | 'column' | 'column-reverse' {
  if (defaultDirection === 'row') {
    return I18nManager.isRTL ? 'row-reverse' : 'row';
  } else if (defaultDirection === 'column') {
    // In some cases, we might want to reverse column direction for RTL
    // This is useful for vertical lists that should have a different order in RTL
    // Uncomment if needed: return I18nManager.isRTL ? 'column-reverse' : 'column';
  }
  return defaultDirection;
}

/**
 * Helper function to get the correct text alignment for RTL
 * @param defaultAlignment The default text alignment
 * @returns The RTL-aware text alignment
 */
export function getRTLTextAlign(defaultAlignment: 'left' | 'right' | 'center' | 'auto' = 'left'): 'left' | 'right' | 'center' | 'auto' {
  if (defaultAlignment === 'left') {
    return I18nManager.isRTL ? 'right' : 'left';
  }
  if (defaultAlignment === 'right') {
    return I18nManager.isRTL ? 'left' : 'right';
  }
  return defaultAlignment; // center and auto don't change
}
