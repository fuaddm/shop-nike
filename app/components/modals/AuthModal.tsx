import { ArrowRight, Eye, EyeClosed, IdCard, KeyRound, Mail, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label, Radio, RadioGroup } from 'react-aria-components';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import type Swiper from 'swiper';
// Import Swiper styles
import 'swiper/css';
import { Swiper as SwiperComp, SwiperSlide } from 'swiper/react';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@ui/InputOtp';

import { useAuthModalStore } from '@stores/authModalStore';

import { cn } from '@libs/cn';

type ModalNames =
  | 'signin'
  | 'signup'
  | 'signup-choice'
  | 'forgot-password'
  | 'forgot-password-verify-otp'
  | 'forgot-password-new-password';

export function AuthModal() {
  const swiperReference = useRef<Swiper | null>(null);
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const setIsOpen = useAuthModalStore((state) => state.setIsOpen);
  const [openModal, setOpenModal] = useState<ModalNames>('signin');
  const fetcher = useFetcher();
  const signupFetcher = useFetcher();
  const otpFetcher = useFetcher();
  const forgotFetcher = useFetcher();
  const forgotOTPFetcher = useFetcher();
  const newPasswordFetcher = useFetcher();
  const choiceFetcher = useFetcher();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setOpenModal('signin');
        swiperReference.current?.slideTo(0);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (otpFetcher.data?.success === true && otpFetcher.state === 'idle') {
      toast.success('Account Confirmed');
      setIsOpen(false);
    }
  }, [otpFetcher]);

  useEffect(() => {
    if (signupFetcher.data?.success === true && signupFetcher.state === 'idle') {
      swiperReference.current?.slideNext();
    }
    if (
      signupFetcher.data?.success === false &&
      signupFetcher.state === 'idle' &&
      signupFetcher.data?.restoreOrNew === true
    ) {
      toast.info('Choose to create a new account or restore an existing one.');
      setOpenModal('signup-choice');
    }
  }, [signupFetcher]);

  useEffect(() => {
    if (fetcher.data?.success === true && fetcher.state === 'idle') {
      toast.success('Successful login');
      setIsOpen(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (forgotFetcher.data?.success === true && forgotFetcher.state === 'idle') {
      toast.success('Email was sent');
      setOpenModal('forgot-password-verify-otp');
    }
  }, [forgotFetcher]);

  useEffect(() => {
    if (forgotOTPFetcher.data?.success === true && forgotOTPFetcher.state === 'idle') {
      toast.success('Correct OTP');
      setOpenModal('forgot-password-new-password');
    }
  }, [forgotOTPFetcher]);

  useEffect(() => {
    if (newPasswordFetcher.data?.success === true && newPasswordFetcher.state === 'idle') {
      toast.success('Password Changed Successfully');
      setIsOpen(false);
    }
  }, [newPasswordFetcher]);

  useEffect(() => {
    if (choiceFetcher.data?.success === true && choiceFetcher.state === 'idle') {
      toast.success('Submitted Successfully');
      swiperReference.current?.slideNext();
    }
  }, [choiceFetcher]);

  useEffect(() => {
    swiperReference.current?.update();
  }, [
    fetcher,
    signupFetcher,
    otpFetcher,
    forgotFetcher,
    forgotOTPFetcher,
    newPasswordFetcher,
    choiceFetcher,
    openModal,
  ]);

  const [isEyeOpen, setIsEyeOpen] = useState(false);

  return (
    <div
      className={cn({
        'invisible fixed top-0 left-0 z-1000 flex h-full w-full items-center justify-center opacity-0 transition-all md:grid md:place-items-center': true,
        'visible opacity-100': isOpen,
      })}
    >
      <div
        onClick={() => setIsOpen(false)}
        className="fixed top-0 left-0 z-0 h-full w-full bg-black/50"
      ></div>
      <div className="pointer-events-none relative right-0 left-0 z-10 container w-full md:mx-auto md:flex md:justify-center">
        <div className="border-outline-variant bg-surface-container pointer-events-auto w-full rounded-xl border px-5 py-4 shadow-xs md:max-w-[520px]">
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-2">
              <div className="border-outline-variant bg-surface-container-high rounded-full border p-2">
                <IdCard className="text-on-surface" />
              </div>
              <div className="text-lg font-medium">
                {openModal === 'signup' && 'Signup'}
                {openModal === 'signup-choice' && 'Account'}
                {openModal === 'signin' && 'Sign in'}
                {openModal === 'forgot-password' && 'Forgot Password'}
                {openModal === 'forgot-password-verify-otp' && 'Verify OTP'}
                {openModal === 'forgot-password-new-password' && 'Set New Password'}
              </div>
            </div>
            <Button
              onPress={() => setIsOpen(false)}
              className="group hover:bg-surface-container-lowest rounded bg-transparent p-1 transition"
            >
              <X className="text-on-surface-variant group-hover:text-on-surface" />
            </Button>
          </div>
          <div className="mt-6 mb-4 text-center text-2xl font-semibold">
            {openModal === 'signup' && 'Sign Up to Get Started'}
            {openModal === 'signin' && 'Welcome back! Please sign in'}
            {openModal === 'signup-choice' && (
              <span className="text-xl">Choose to create a new account or restore an existing one.</span>
            )}
          </div>
          <SwiperComp
            spaceBetween={20}
            slidesPerView={1}
            autoHeight={true}
            allowTouchMove={false}
            onSwiper={(swiper) => (swiperReference.current = swiper)}
          >
            <SwiperSlide>
              {openModal === 'signin' && (
                <fetcher.Form
                  method="post"
                  action="/login"
                  className="px-1"
                >
                  <div className="group mb-4 flex flex-col gap-1">
                    <Label
                      htmlFor="email"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="email"
                        name="email"
                        className="border-outline-variant focus:outline-primary bg-surface-container-high rounded-xl border px-3 py-2"
                        placeholder="example@gmail.com"
                      />
                      {fetcher.data?.errors?.email && <div className="text-red-600">{fetcher.data.errors.email}</div>}
                    </div>
                  </div>
                  <div className="group mb-5 flex flex-col gap-1">
                    <Label
                      htmlFor="password"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <KeyRound size={18} />
                      <span>Password</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={isEyeOpen ? 'text' : 'password'}
                          className="border-outline-variant bg-surface-container-high focus:outline-primary w-full rounded-xl border px-3 py-2"
                          placeholder={isEyeOpen ? 'secretpassword' : '**********'}
                        />
                        <Button
                          onPress={() => setIsEyeOpen((previous) => !previous)}
                          className="absolute top-1/2 right-4 -translate-y-1/2"
                        >
                          {isEyeOpen && (
                            <Eye
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                          {!isEyeOpen && (
                            <EyeClosed
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                        </Button>
                      </div>
                      {fetcher.data?.errors?.password && (
                        <div className="text-red-600">{fetcher.data.errors.password}</div>
                      )}
                    </div>
                  </div>
                  <div className="mb-5 flex justify-between">
                    <Label className="flex cursor-pointer items-center gap-2">
                      <input
                        name="rememberMe"
                        type="checkbox"
                      />
                      <span>Remember me</span>
                    </Label>
                    <Button
                      onPress={() => setOpenModal('forgot-password')}
                      className="text-on-surface cursor-pointer hover:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  {fetcher.data?.success === false && fetcher.state === 'idle' && fetcher.data?.errorMsg && (
                    <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                      {fetcher.data?.errorMsg}
                    </div>
                  )}
                  <Button
                    type="submit"
                    isDisabled={fetcher.state !== 'idle'}
                    className="bg-primary not-disabled:hover:bg-primary/80 disabled:bg-primary/80 text-on-primary relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl py-4 font-semibold transition disabled:cursor-default"
                  >
                    Login
                    {fetcher.state !== 'idle' && (
                      <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                        <svg
                          aria-hidden="true"
                          className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    onPress={() => setOpenModal('signup')}
                    className="group text-on-surface mx-auto mb-2 flex w-fit items-center gap-2"
                  >
                    Don&apos;t have an account
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Button>
                </fetcher.Form>
              )}
              {openModal === 'signup' && (
                <signupFetcher.Form
                  method="post"
                  action="/signup"
                  className="px-1"
                >
                  <input
                    type="hidden"
                    name="actionName"
                    value="credentials"
                  />
                  <div className="group mb-4 flex flex-col gap-1">
                    <Label
                      htmlFor="email"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="email"
                        name="email"
                        className="border-outline-variant bg-surface-container-high focus:outline-primary rounded-xl border px-3 py-2"
                        placeholder="example@gmail.com"
                      />
                      {signupFetcher.data?.errors?.email && (
                        <div className="text-red-600">{signupFetcher.data.errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="group mb-5 flex flex-col gap-1">
                    <Label
                      htmlFor="password"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <KeyRound size={18} />
                      <span>Password</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={isEyeOpen ? 'text' : 'password'}
                          className="border-outline-variant bg-surface-container-high focus:outline-primary w-full rounded-xl border px-3 py-2"
                          placeholder={isEyeOpen ? 'secretpassword' : '**********'}
                        />
                        <Button
                          onPress={() => setIsEyeOpen((previous) => !previous)}
                          className="absolute top-1/2 right-4 -translate-y-1/2"
                        >
                          {isEyeOpen && (
                            <Eye
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                          {!isEyeOpen && (
                            <EyeClosed
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                        </Button>
                      </div>
                      {signupFetcher.data?.errors?.password && (
                        <div className="text-red-600">{signupFetcher.data.errors.password}</div>
                      )}
                    </div>
                  </div>
                  <div className="group mb-5 flex flex-col gap-1">
                    <Label
                      htmlFor="repeat-password"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <KeyRound size={18} />
                      <span>Confirm Password</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <Input
                          id="repeat-password"
                          name="repeat-password"
                          type={isEyeOpen ? 'text' : 'password'}
                          className="border-outline-variant bg-surface-container-high focus:outline-primary w-full rounded-xl border px-3 py-2"
                          placeholder={isEyeOpen ? 'secretpassword' : '**********'}
                        />
                        <Button
                          onPress={() => setIsEyeOpen((previous) => !previous)}
                          className="absolute top-1/2 right-4 -translate-y-1/2"
                        >
                          {isEyeOpen && (
                            <Eye
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                          {!isEyeOpen && (
                            <EyeClosed
                              size={18}
                              className="text-on-surface-variant"
                            />
                          )}
                        </Button>
                      </div>
                      {signupFetcher.data?.errors?.repeatPassword && (
                        <div className="text-red-600">{signupFetcher.data.errors.repeatPassword}</div>
                      )}
                    </div>
                  </div>
                  {signupFetcher.data?.success === false &&
                    signupFetcher.state === 'idle' &&
                    signupFetcher.data?.rawError?.data?.result?.errorMsg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {signupFetcher.data?.rawError?.data?.result?.errorMsg}
                      </div>
                    )}
                  {signupFetcher.data?.success === false &&
                    signupFetcher.state === 'idle' &&
                    signupFetcher.data?.rawError?.data?.result?.error_msg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {signupFetcher.data?.rawError?.data?.result?.error_msg}
                      </div>
                    )}
                  <Button
                    type="submit"
                    isDisabled={signupFetcher.state !== 'idle'}
                    className="bg-primary not-disabled:hover:bg-primary/80 disabled:bg-primary/80 text-on-primary relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl py-4 font-semibold transition disabled:cursor-default"
                  >
                    Signup
                    {signupFetcher.state !== 'idle' && (
                      <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                        <svg
                          aria-hidden="true"
                          className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    onPress={() => setOpenModal('signin')}
                    className="group text-on-surface mx-auto mb-2 flex w-fit items-center gap-2"
                  >
                    Already have an account
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Button>
                </signupFetcher.Form>
              )}
              {openModal === 'signup-choice' && (
                <choiceFetcher.Form
                  method="POST"
                  action="/signup"
                >
                  <input
                    type="hidden"
                    name="actionName"
                    value="insert-choice"
                  />
                  <RadioGroup
                    name="choice"
                    className="flex flex-col gap-3 py-4"
                  >
                    <Radio
                      value="1"
                      className="bg-surface-container-highest hover:bg-surface-container-high group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition"
                    >
                      <div className="border-on-surface-variant aspect-square w-6 rounded-full border-2 p-1">
                        <div className="bg-on-surface-variant aspect-square h-full w-full scale-0 rounded-full transition-transform ease-out group-data-selected:scale-100"></div>
                      </div>
                      Create as a new account
                    </Radio>
                    <Radio
                      value="2"
                      className="bg-surface-container-highest group hover:bg-surface-container-high flex cursor-pointer items-center gap-3 rounded-lg p-3 transition"
                    >
                      <div className="border-on-surface-variant aspect-square w-6 rounded-full border-2 p-1">
                        <div className="bg-on-surface-variant aspect-square h-full w-full scale-0 rounded-full transition-transform ease-out group-data-selected:scale-100"></div>
                      </div>
                      Restore a deleted account
                    </Radio>
                  </RadioGroup>
                  <Button
                    type="submit"
                    isDisabled={choiceFetcher.state !== 'idle'}
                    className="bg-primary not-disabled:hover:bg-primary/80 disabled:bg-primary/80 text-on-primary relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl py-4 font-semibold transition disabled:cursor-default"
                  >
                    Submit
                    {choiceFetcher.state !== 'idle' && (
                      <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                        <svg
                          aria-hidden="true"
                          className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                  {choiceFetcher.data?.success === false &&
                    choiceFetcher.state === 'idle' &&
                    choiceFetcher.data?.rawError?.data?.result?.errorMsg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {choiceFetcher.data?.rawError?.data?.result?.errorMsg}
                      </div>
                    )}
                  {choiceFetcher.data?.success === false &&
                    choiceFetcher.state === 'idle' &&
                    choiceFetcher.data?.rawError?.data?.result?.error_msg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {choiceFetcher.data?.rawError?.data?.result?.error_msg}
                      </div>
                    )}
                  <Button
                    onPress={() => setOpenModal('signin')}
                    className="group text-on-surface mx-auto mb-2 flex w-fit items-center gap-2"
                  >
                    Back to sign in
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Button>
                </choiceFetcher.Form>
              )}
              {openModal === 'forgot-password' && (
                <forgotFetcher.Form
                  method="post"
                  action="/forgot-password"
                  className="px-1"
                >
                  <input
                    type="hidden"
                    name="actionName"
                    value="forgot-password"
                  />
                  <div className="group mb-4 flex flex-col gap-1">
                    <Label
                      htmlFor="email"
                      className="group-has-focus:text-primary flex w-fit items-center gap-2 font-medium"
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="email"
                        name="email"
                        className="border-outline-variant bg-surface-container-high focus:outline-primary rounded-xl border px-3 py-2"
                        placeholder="example@gmail.com"
                      />
                      {forgotFetcher.data?.errors?.email && (
                        <div className="text-red-600">{forgotFetcher.data.errors.email}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    isDisabled={forgotFetcher.state !== 'idle'}
                    className="bg-primary not-disabled:hover:bg-primary/80 disabled:bg-primary/80 text-on-primary relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl py-4 font-semibold transition disabled:cursor-default"
                  >
                    Reset password
                    {forgotFetcher.state !== 'idle' && (
                      <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                        <svg
                          aria-hidden="true"
                          className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                  {forgotFetcher.data?.success === false &&
                    forgotFetcher.state === 'idle' &&
                    forgotFetcher.data?.rawError?.data?.result?.errorMsg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {forgotFetcher.data?.rawError?.data?.result?.errorMsg}
                      </div>
                    )}
                  {forgotFetcher.data?.success === false &&
                    forgotFetcher.state === 'idle' &&
                    forgotFetcher.data?.rawError?.data?.result?.error_msg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {forgotFetcher.data?.rawError?.data?.result?.error_msg}
                      </div>
                    )}
                  <Button
                    onPress={() => setOpenModal('signin')}
                    className="group text-on-surface mx-auto mb-2 flex w-fit items-center gap-2"
                  >
                    Back to sign in
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Button>
                </forgotFetcher.Form>
              )}
              {openModal === 'forgot-password-verify-otp' && (
                <>
                  <div className="flex justify-center pt-10 pb-6">
                    <InputOTP
                      name="otp"
                      disabled={forgotOTPFetcher.state !== 'idle'}
                      onComplete={(otp) => {
                        const formData = new FormData();
                        formData.append('otp', otp);
                        formData.append('actionName', 'verify-otp');
                        forgotOTPFetcher.submit(formData, {
                          method: 'post',
                          action: '/forgot-password',
                        });
                      }}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="h-12 text-center">
                    {forgotOTPFetcher.data?.success === false && (
                      <div className="text-red-500">
                        Invalid OTP. Make sure you&apos;ve entered the latest 6-digit code received on your phone/email.
                      </div>
                    )}
                  </div>
                </>
              )}
              {openModal === 'forgot-password-new-password' && (
                <newPasswordFetcher.Form
                  method="post"
                  action="/forgot-password"
                  className="px-1"
                >
                  <input
                    type="hidden"
                    name="actionName"
                    value="new-password"
                  />
                  <div className="group mb-4 flex flex-col gap-1">
                    <Label
                      htmlFor="password"
                      className="group-has-focus:text-primary flex items-center gap-2 font-medium"
                    >
                      <KeyRound size={18} />
                      <span>New Password</span>
                    </Label>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="password"
                        name="newPassword"
                        type={'text'}
                        className="border-outline-variant bg-surface-container-high focus:outline-primary w-full rounded-xl border px-3 py-2"
                        placeholder="Enter a new password"
                      />
                      {newPasswordFetcher.data?.errors?.newPassword && (
                        <div className="text-red-600">{newPasswordFetcher.data.errors.newPassword}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    isDisabled={newPasswordFetcher.state !== 'idle'}
                    className="bg-primary not-disabled:hover:bg-primary/80 disabled:bg-primary/80 text-on-primary relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl py-4 font-semibold transition disabled:cursor-default"
                  >
                    Submit
                    {newPasswordFetcher.state !== 'idle' && (
                      <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                        <svg
                          aria-hidden="true"
                          className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                  {newPasswordFetcher.data?.success === false &&
                    newPasswordFetcher.state === 'idle' &&
                    newPasswordFetcher.data?.rawError?.data?.result?.errorMsg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {newPasswordFetcher.data?.rawError?.data?.result?.errorMsg}
                      </div>
                    )}
                  {newPasswordFetcher.data?.success === false &&
                    newPasswordFetcher.state === 'idle' &&
                    newPasswordFetcher.data?.rawError?.data?.result?.error_msg && (
                      <div className="mb-4 rounded-lg bg-red-600/70 px-4 py-3 text-center text-white">
                        {newPasswordFetcher.data?.rawError?.data?.result?.error_msg}
                      </div>
                    )}
                  <Button
                    onPress={() => setOpenModal('signin')}
                    className="group text-on-surface mx-auto mb-2 flex w-fit items-center gap-2"
                  >
                    Back to sign in
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Button>
                </newPasswordFetcher.Form>
              )}
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="flex justify-center py-10">
                  <InputOTP
                    name="otp"
                    disabled={otpFetcher.state !== 'idle'}
                    onComplete={(otp) => {
                      const formData = new FormData();
                      formData.append('otp', otp);
                      formData.append('actionName', 'otpSubmit');
                      otpFetcher.submit(formData, {
                        method: 'post',
                        action: '/signup',
                      });
                    }}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="h-12 text-center">
                  {otpFetcher.data?.success === false && (
                    <div className="text-red-500">
                      Invalid OTP. Make sure you&apos;ve entered the latest 6-digit code received on your phone/email.
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          </SwiperComp>
        </div>
      </div>
    </div>
  );
}
