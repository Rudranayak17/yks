import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRegistrationMutation } from '@/store/api/auth';
import { showToast } from '@/utils/ShowToast';

// Updated schema with phone number
const signupSchema = yup.object().shape({
  name: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Updated form data type
type SignupFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createUser] = useRegistrationMutation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Updated submit handler
  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      const { name, email, phone, password } = data;

      // Assuming createUser is an API call from your registration mutation
      await createUser({
        username: name,
        email,
        phone,
        password,
      }).unwrap();

      // Add success handling here (e.g., navigation to login screen)
      console.log('Registration successful');
    } catch (error: any) {
      // console.error('Registration failed:', error);

      if (error.status === 400) {
        showToast({
          message: error?.data?.message||'Something went wrong',
          backgroundColor: 'red',
        });
        return;
      }
      showToast({
        message: 'Something went wrong',
        backgroundColor: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Animated.View entering={FadeInDown.delay(100).duration(1000)}>
            <Text style={styles.logo}>YKS</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(1000)}
            style={styles.headerContainer}
          >
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subHeader}>Sign up to get started</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).duration(1000)}
            style={styles.formContainer}
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <User size={20} color="#666" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <Mail size={20} color="#666" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* New Phone Number Input */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <Phone size={20} color="#666" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color="#666" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color="#666" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#5271FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    height: 55,
  },
  iconContainer: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#5271FF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  loginText: {
    color: '#5271FF',
    fontFamily: 'Poppins-Medium',
  },
});
