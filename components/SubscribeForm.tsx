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

  return (
    <div className="relative">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-zinc-400 mb-2 font-[family-name:var(--font-inter)]"
      >
        {label}
        {required && <span className="text-[#ff0033] ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Glow effect on focus */}
        <motion.div
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#ff0033] via-[#ff006e] to-[#00ffff]"
          animate={{
            opacity: isFocused ? 0.6 : error ? 0.4 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ filter: 'blur(4px)' }}
        />
        
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
            relative w-full px-5 py-4 
            bg-black/80 border rounded-lg 
            text-white placeholder-zinc-500 
            focus:outline-none transition-colors
            font-[family-name:var(--font-inter)]
            ${error 
              ? 'border-[#ff0033] focus:border-[#ff0033]' 
              : 'border-zinc-800 focus:border-[#ff0033]'
            }
          `}
        />
        
        {/* Pulsing border on focus */}
        {isFocused && !error && (
          <motion.div
            className="absolute inset-0 rounded-lg border border-[#ff0033] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-2 text-sm text-[#ff0033] font-[family-name:var(--font-inter)]"
            role="alert"
          >
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
      className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ff0033] to-[#ff006e] text-white font-semibold rounded-lg font-[family-name:var(--font-space-grotesk)] overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered && !isLoading ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: isHovered && !isLoading
            ? '0 0 40px rgba(255, 0, 51, 0.6), 0 0 80px rgba(255, 0, 51, 0.3)'
            : '0 0 20px rgba(255, 0, 51, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <motion.span
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            {children}
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
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
        className="p-8 bg-[#ff0033]/10 border border-[#ff0033]/30 rounded-xl relative overflow-hidden"
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(255, 0, 51, 0.2)',
            '0 0 40px rgba(255, 0, 51, 0.4)',
            '0 0 20px rgba(255, 0, 51, 0.2)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff0033]/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff0033]/20 flex items-center justify-center"
        >
          <motion.span 
            className="text-4xl text-[#ff0033]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ✓
          </motion.span>
        </motion.div>
        
        <p className="text-white font-semibold text-xl mb-2 font-[family-name:var(--font-space-grotesk)] relative z-10">
          You&apos;re on the list!
        </p>
        <p className="text-zinc-400 font-[family-name:var(--font-inter)] relative z-10">
          {message}
        </p>
        
        {/* Option to subscribe another email */}
        <motion.button
          onClick={onReset}
          className="mt-6 text-sm text-zinc-500 hover:text-[#ff0033] transition-colors font-[family-name:var(--font-inter)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          className="max-w-md mx-auto space-y-5"
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
