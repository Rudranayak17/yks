import Toast from "react-native-root-toast";

interface ToastOptions {
  message: string;
  backgroundColor?: string;
  textColor?: string;
  duration?: number;
  position?: number;
  textStyle?: object;
  animation?: boolean;
  hideOnPress?: boolean;
  delay?: number;
}

const defaultOptions: ToastOptions = {
  backgroundColor: "#000",
  textColor: "#fff",
  duration: Toast.durations.LONG,
  position: Toast.positions.BOTTOM,
  textStyle: {
    textTransform: "capitalize",
  },
  animation: true,
  hideOnPress: true,
  delay: 0,
  message: ""
};

export const showToast = (options: ToastOptions) => {
  const { 
    message, 
    backgroundColor = defaultOptions.backgroundColor,
    textColor = defaultOptions.textColor,
    duration = defaultOptions.duration,
    position = defaultOptions.position,
    textStyle = defaultOptions.textStyle,
    animation = defaultOptions.animation,
    hideOnPress = defaultOptions.hideOnPress,
    delay = defaultOptions.delay
  } = options;

  Toast.show(message, {
    duration,
    position,
    textStyle,
    backgroundColor,
    textColor,
    animation,
    hideOnPress,
    delay,
  });
};