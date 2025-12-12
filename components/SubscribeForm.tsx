'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent, useCallback } from 'react';
import { subscribe, validateEmail, SubscribeData, SubscribeResult } from '@/lib/subscribe';

interface FormErrors {
  email?: string;
  name?: string;
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: SubscribeResult;
}

// Animated input component with validation state
function FormInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  error?: string;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      {/* Enhanced label with better visibility */}
      <label 
        htmlFor={id}
        className={`
          block text-sm font-semibold mb-3 
          font-[family-name:var(--font-inter)]
          tracking-wide uppercase
          transition-colors duration-200
          ${isFocused ? 'text-white' : 'text-zinc-300'}
          ${error ? 'text-[#ff6666]' : ''}
        `}
      >
        {label}
        {required && <span className="text-[#ff0033] ml-1.5">*</span>}
      </label>
      
      <div className="relative">
        {/* Subtle glow effect on focus */}
        <motion.div
          className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#ff0033]"
          animate={{
            opacity: isFocused ? 0.4 : error ? 0.25 : 0,
          }}
          transition={{ duration: 0.25 }}
          style={{ filter: 'blur(8px)' }}
        />
        
        {/* Input field with premium styling */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            relative w-full px-5 py-5
            bg-zinc-950/90 backdrop-blur-sm
            border-2 rounded-xl
            text-white text-base
            placeholder-zinc-600
            focus:outline-none 
            transition-all duration-200
            font-[family-name:var(--font-inter)]
            ${error 
              ? 'border-[#ff4444] focus:border-[#ff6666] bg-[#ff0033]/5' 
              : isFocused
                ? 'border-[#ff0033] bg-zinc-900/95'
                : hasValue
                  ? 'border-zinc-600 bg-zinc-900/90'
                  : 'border-zinc-800 hover:border-zinc-700'
            }
          `}
        />
        
        {/* Animated focus ring */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-[#ff0033] pointer-events-none"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Success indicator when filled */}
        <AnimatePresence>
          {hasValue && !error && !isFocused && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error indicator */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff4444]"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Enhanced error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-3 text-sm text-[#ff6666] font-medium font-[family-name:var(--font-inter)] flex items-center gap-2"
            role="alert"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-[#ff6666]" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Submit button with loading state
function SubmitButton({ 
  isLoading, 
  children 
}: { 
  isLoading: boolean; 
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full px-8 py-5 bg-gradient-to-r from-[#ff0033] to-[#ff006e] text-white font-bold text-base tracking-wide uppercase rounded-xl font-[family-name:var(--font-space-grotesk)] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed border border-white/10"
      whileHover={!isLoading ? { scale: 1.01 } : {}}
      whileTap={!isLoading ? { scale: 0.99 } : {}}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered && !isLoading ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovered && !isLoading
            ? '0 0 30px rgba(255, 0, 51, 0.5), 0 0 60px rgba(255, 0, 51, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 0 15px rgba(255, 0, 51, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        transition={{ duration: 0.25 }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <motion.span
              className="inline-block text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            {children}
            <motion.span
              className="text-lg"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
}

// Success message component
function SuccessMessage({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-center"
    >
      <motion.div
        className="p-10 bg-gradient-to-b from-[#ff0033]/15 to-[#ff0033]/5 border-2 border-[#ff0033]/40 rounded-2xl relative overflow-hidden backdrop-blur-sm"
        animate={{ 
          boxShadow: [
            '0 0 25px rgba(255, 0, 51, 0.15)',
            '0 0 45px rgba(255, 0, 51, 0.25)',
            '0 0 25px rgba(255, 0, 51, 0.15)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff0033]/8 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center"
        >
          <motion.span 
            className="text-4xl text-emerald-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ✓
          </motion.span>
        </motion.div>
        
        <h3 className="text-white font-bold text-2xl mb-3 font-[family-name:var(--font-space-grotesk)] relative z-10">
          You&apos;re on the list!
        </h3>
        <p className="text-zinc-300 text-lg font-[family-name:var(--font-inter)] relative z-10 leading-relaxed">
          {message}
        </p>
        
        {/* Option to subscribe another email */}
        <motion.button
          onClick={onReset}
          className="mt-8 text-sm text-zinc-400 hover:text-white transition-colors font-[family-name:var(--font-inter)] px-4 py-2 rounded-lg hover:bg-white/5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Subscribe another email →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Error toast component
function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-4 p-4 bg-[#ff0033]/10 border border-[#ff0033]/50 rounded-lg flex items-center gap-3"
    >
      <span className="text-[#ff0033] text-xl">⚠</span>
      <p className="flex-1 text-[#ff0033] text-sm font-[family-name:var(--font-inter)]">
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-[#ff0033] hover:text-white transition-colors"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </motion.div>
  );
}

// Main SubscribeForm component
export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>({ status: 'idle' });

  // Validate email on blur
  const handleEmailBlur = useCallback(() => {
    if (email) {
      const validation = validateEmail(email);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, email: validation.error }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  }, [email]);

  // Clear error on input change
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [errors.email]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [errors.name]);

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error });
      return;
    }

    // Start loading state
    setFormState({ status: 'loading' });

    // Prepare data
    const data: SubscribeData = {
      email: email.trim(),
      name: name.trim() || undefined,
    };

    try {
      // Call the subscribe function (fake or real depending on env)
      const result = await subscribe(data);

      if (result.success) {
        setFormState({ status: 'success', result });
      } else {
        setFormState({ status: 'error', result });
      }
    } catch (error) {
      console.error('[SubscribeForm] Unexpected error:', error);
      setFormState({
        status: 'error',
        result: {
          success: false,
          message: 'An unexpected error occurred',
          error: 'Please try again later.',
        },
      });
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setEmail('');
    setName('');
    setErrors({});
    setFormState({ status: 'idle' });
  };

  // Dismiss error toast
  const handleDismissError = () => {
    setFormState({ status: 'idle' });
  };

  return (
    <AnimatePresence mode="wait">
      {formState.status === 'success' ? (
        <SuccessMessage 
          key="success"
          message={formState.result?.message || "We'll keep you posted!"} 
          onReset={handleReset}
        />
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto space-y-6"
          noValidate
        >
          {/* Email field */}
          <FormInput
            id="subscribe-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            label="Email Address"
            error={errors.email}
            required
          />

          {/* Name field (optional) */}
          <FormInput
            id="subscribe-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="John Doe"
            label="Name (optional)"
            error={errors.name}
          />

          {/* Submit button */}
          <div className="pt-2">
            <SubmitButton isLoading={formState.status === 'loading'}>
              Get Notified
            </SubmitButton>
          </div>

          {/* Error toast */}
          <AnimatePresence>
            {formState.status === 'error' && formState.result && (
              <ErrorToast 
                message={formState.result.error || formState.result.message}
                onDismiss={handleDismissError}
              />
            )}
          </AnimatePresence>

          {/* Privacy note */}
          <motion.p 
            className="text-xs text-zinc-600 text-center font-[family-name:var(--font-inter)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
