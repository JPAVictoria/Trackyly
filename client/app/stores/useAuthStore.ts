import { create } from "zustand";

interface FormStore {
  loading: boolean;
  submitted: boolean;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  resetForm: () => void;
}

interface PasswordVisibilityStore {
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirmPassword: boolean;
  toggleShowConfirmPassword: () => void;
  showNew: boolean;
  toggleShowNew: () => void;
}

interface RegisterStore extends FormStore, PasswordVisibilityStore {
  resetForm: () => void;
}

interface PasswordState extends FormStore, PasswordVisibilityStore {
  showNew: boolean;
  showConfirmPassword: boolean;
  toggleShowNew: () => void;
  toggleShowConfirmPassword: () => void;
  resetPasswordForm: () => void;
}

interface LoginStore extends FormStore, PasswordVisibilityStore {
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  toggleShowPassword: () => void;
  resetForm: () => void;
}

interface AuthStore {
  login: LoginStore;
  forgotPassword: FormStore;
  register: RegisterStore;
  changePassword: PasswordState;
}

export const useAuthStore = create<AuthStore>((set) => ({
  login: {
    loading: false,
    submitted: false,
    showPassword: false,
    showConfirmPassword: false,
    showNew: false,
    setLoading: (loading) =>
      set((state) => ({ login: { ...state.login, loading } })),
    setSubmitted: (submitted) =>
      set((state) => ({ login: { ...state.login, submitted } })),
    toggleShowPassword: () =>
      set((state) => ({
        login: { ...state.login, showPassword: !state.login.showPassword },
      })),
    toggleShowConfirmPassword: () =>
      set((state) => ({
        login: {
          ...state.login,
          showConfirmPassword: !state.login.showConfirmPassword,
        },
      })),
    toggleShowNew: () =>
      set((state) => ({
        login: { ...state.login, showNew: !state.login.showNew },
      })),
    resetForm: () =>
      set((state) => ({
        login: {
          ...state.login,
          loading: false,
          submitted: false,
          showPassword: false,
          showConfirmPassword: false,
          showNew: false,
        },
      })),
  },

  forgotPassword: {
    loading: false,
    submitted: false,
    setLoading: (loading) =>
      set((state) => ({
        forgotPassword: { ...state.forgotPassword, loading },
      })),
    setSubmitted: (submitted) =>
      set((state) => ({
        forgotPassword: { ...state.forgotPassword, submitted },
      })),
    resetForm: () =>
      set((state) => ({
        forgotPassword: {
          ...state.forgotPassword,
          loading: false,
          submitted: false,
        },
      })),
  },

  register: {
    loading: false,
    submitted: false,
    showPassword: false,
    showConfirmPassword: false,
    showCurrent: false,
    showNew: false,
    setLoading: (loading) =>
      set((state) => ({ register: { ...state.register, loading } })),
    setSubmitted: (submitted) =>
      set((state) => ({ register: { ...state.register, submitted } })),
    toggleShowPassword: () =>
      set((state) => ({
        register: {
          ...state.register,
          showPassword: !state.register.showPassword,
        },
      })),
    toggleShowConfirmPassword: () =>
      set((state) => ({
        register: {
          ...state.register,
          showConfirmPassword: !state.register.showConfirmPassword,
        },
      })),
    toggleShowNew: () =>
      set((state) => ({
        register: { ...state.register, showNew: !state.register.showNew },
      })),
    resetForm: () =>
      set((state) => ({
        register: {
          ...state.register,
          loading: false,
          submitted: false,
          showPassword: false,
          showConfirmPassword: false,
          showCurrent: false,
          showNew: false,
        },
      })),
  },

changePassword: {
  showNew: false,
  showConfirmPassword: false,
  showPassword: false,
  loading: false,
  submitted: false,

  toggleShowPassword: () =>
    set((state) => ({
      changePassword: {
        ...state.changePassword,
        showPassword: !state.changePassword.showPassword,
      },
    })),
  toggleShowConfirmPassword: () =>
    set((state) => ({
      changePassword: {
        ...state.changePassword,
        showConfirmPassword: !state.changePassword.showConfirmPassword,
      },
    })),
  toggleShowNew: () =>
    set((state) => ({
      changePassword: {
        ...state.changePassword,
        showNew: !state.changePassword.showNew,
      },
    })),
  resetPasswordForm: () =>
    set((state) => ({
      changePassword: {
        ...state.changePassword,
        showNew: false,
        showConfirmPassword: false,
        loading: false,
        submitted: false,
      },
    })),
  setLoading: (loading) =>
    set((state) => ({
      changePassword: { ...state.changePassword, loading },
    })),
  setSubmitted: (submitted) =>
    set((state) => ({
      changePassword: { ...state.changePassword, submitted },
    })),
  resetForm: () =>
    set((state) => ({
      changePassword: {
        ...state.changePassword,
        showNew: false,
        showConfirmPassword: false,
        loading: false,
        submitted: false,
      },
    })),
},
}));
