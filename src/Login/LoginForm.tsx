import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';
import { updateUsername, updatePassword } from '../../store/slices/loginSlice';
import './LoginForm.scss';

const DEBOUNCE_DELAY = 500;

const createDebouncedFunction = (delay: number) => (
  fn: (value: string) => void
) => (timeoutRef: React.MutableRefObject<number | null>) => (
  value: string
): void => {
  if (timeoutRef.current !== null) {
    window.clearTimeout(timeoutRef.current);
  }
  timeoutRef.current = window.setTimeout(() => {
    fn(value);
    timeoutRef.current = null;
  }, delay);
};

interface TouchedState {
  username: boolean;
  password: boolean;
}

const initialTouchedState: TouchedState = {
  username: false,
  password: false,
};

const MIN_LENGTH = 3;

const markFieldTouched = (state: TouchedState) => (field: keyof TouchedState): TouchedState => ({
  ...state,
  [field]: true,
});

const hasMinimumLength = (minLength: number) => (value: string): boolean => 
  value.length >= minLength;

const validateField = hasMinimumLength(MIN_LENGTH);

const computeFieldError = (minLength: number) => (value: string) => (touched: boolean): string | null => {
  if (!touched) return null;
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

const deriveFieldError = computeFieldError(MIN_LENGTH);

const allFieldsValid = (username: string) => (password: string) => (acceptedTerms: boolean): boolean => {
  const fieldsValid = [username, password].every(validateField);
  return fieldsValid && acceptedTerms;
};

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username: reduxUsername, password: reduxPassword } = useAppSelector((state: RootState) => state.login);
  const [localUsername, setLocalUsername] = useState<string>(reduxUsername);
  const [localPassword, setLocalPassword] = useState<string>(reduxPassword);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [touchedState, setTouchedState] = useState<TouchedState>(initialTouchedState);
  
  const usernameTimeoutRef = useRef<number | null>(null);
  const passwordTimeoutRef = useRef<number | null>(null);

  const debouncedUsernameDispatch = createDebouncedFunction(DEBOUNCE_DELAY)(
    (value: string) => dispatch(updateUsername(value))
  )(usernameTimeoutRef);

  const debouncedPasswordDispatch = createDebouncedFunction(DEBOUNCE_DELAY)(
    (value: string) => dispatch(updatePassword(value))
  )(passwordTimeoutRef);

  useEffect(() => {
    setLocalUsername(reduxUsername);
  }, [reduxUsername]);

  useEffect(() => {
    setLocalPassword(reduxPassword);
  }, [reduxPassword]);

  useEffect(() => {
    return () => {
      if (usernameTimeoutRef.current !== null) {
        window.clearTimeout(usernameTimeoutRef.current);
      }
      if (passwordTimeoutRef.current !== null) {
        window.clearTimeout(passwordTimeoutRef.current);
      }
    };
  }, []);

  const createUsernameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setLocalUsername(value);
    debouncedUsernameDispatch(value);
    
    if (!touchedState.username) {
      setTouchedState((prevState) => markFieldTouched(prevState)('username'));
    }
  };

  const createPasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setLocalPassword(value);
    debouncedPasswordDispatch(value);
    
    if (!touchedState.password) {
      setTouchedState((prevState) => markFieldTouched(prevState)('password'));
    }
  };

  const createTermsChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAcceptedTerms(e.target.checked);
  };

  const createBlurHandler = (field: keyof TouchedState) => (): void => {
    setTouchedState((prevState) => 
      prevState[field] ? prevState : markFieldTouched(prevState)(field)
    );
  };

  const flushPendingUpdates = (): void => {
    if (usernameTimeoutRef.current !== null) {
      window.clearTimeout(usernameTimeoutRef.current);
      dispatch(updateUsername(localUsername));
      usernameTimeoutRef.current = null;
    }
    if (passwordTimeoutRef.current !== null) {
      window.clearTimeout(passwordTimeoutRef.current);
      dispatch(updatePassword(localPassword));
      passwordTimeoutRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    flushPendingUpdates();
    if (allFieldsValid(localUsername)(localPassword)(acceptedTerms)) {
      console.log('Form submitted:', { username: localUsername, password: localPassword, acceptedTerms });
      // Add your login logic here
      localStorage.setItem('userName', localUsername);
      localStorage.setItem('password', localPassword);
      navigate('/home');
    }
  };

  const usernameError = deriveFieldError(localUsername)(touchedState.username);
  const passwordError = deriveFieldError(localPassword)(touchedState.password);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={localUsername}
          autoFocus
          onChange={createUsernameChangeHandler}
          onBlur={createBlurHandler('username')}
          className={`form-input ${usernameError ? 'form-input-error' : ''}`}
        />
        {usernameError && <span className="error-message">{usernameError}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={localPassword}
          onChange={createPasswordChangeHandler}
          onBlur={createBlurHandler('password')}
          className={`form-input ${passwordError ? 'form-input-error' : ''}`}
        />
        {passwordError && <span className="error-message">{passwordError}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={createTermsChangeHandler}
            className="checkbox-input"
          />
          <span>I accept the Terms and Agreements</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!allFieldsValid(localUsername)(localPassword)(acceptedTerms)}
        className="submit-button"
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;

